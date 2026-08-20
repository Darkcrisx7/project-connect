import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { cashfreeHeaders, CASHFREE_API_BASE, PRO_DURATION_DAYS } from "@/lib/cashfree";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: payment } = await service
    .from("payments")
    .select("id, user_id, status")
    .eq("cashfree_order_id", orderId)
    .single();

  if (!payment || payment.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found for this account" }, { status: 400 });
  }

  if (payment.status === "paid") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("premium_until")
      .eq("id", user.id)
      .single();
    return NextResponse.json({ success: true, premiumUntil: profile?.premium_until });
  }

  // Never trust the client's word that a payment succeeded — ask Cashfree
  // directly for this order's real status, using our secret key.
  const statusRes = await fetch(`${CASHFREE_API_BASE}/orders/${orderId}`, {
    headers: cashfreeHeaders(),
  });
  const orderStatus = await statusRes.json();

  if (!statusRes.ok || orderStatus.order_status !== "PAID") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  await service.from("payments").update({ status: "paid" }).eq("cashfree_order_id", orderId);

  const { data: profile } = await supabase
    .from("profiles")
    .select("premium_until")
    .eq("id", user.id)
    .single();

  const base =
    profile?.premium_until && new Date(profile.premium_until).getTime() > Date.now()
      ? new Date(profile.premium_until)
      : new Date();
  const newExpiry = new Date(base.getTime() + PRO_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await supabase
    .from("profiles")
    .update({ premium_until: newExpiry.toISOString(), is_premium: true })
    .eq("id", user.id);

  return NextResponse.json({ success: true, premiumUntil: newExpiry.toISOString() });
}
