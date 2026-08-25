import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { cashfreeHeaders, CASHFREE_API_BASE, PRO_PRICE_RUPEES } from "@/lib/cashfree";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, phone_number")
    .eq("id", user.id)
    .single();

  if (!profile?.phone_number) {
    return NextResponse.json(
      { error: "A mobile number on your profile is required to check out." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${CASHFREE_API_BASE}/orders`, {
      method: "POST",
      headers: cashfreeHeaders(),
      body: JSON.stringify({
        order_amount: PRO_PRICE_RUPEES,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id,
          customer_name: profile.full_name || "Bangalore Teamup user",
          customer_email: profile.email,
          customer_phone: profile.phone_number,
        },
        order_note: "Pro membership — 1 month",
      }),
    });

    const order = await res.json();

    if (!res.ok) {
      console.error("Cashfree order creation failed", order);
      return NextResponse.json({ error: "Couldn't start checkout — try again." }, { status: 500 });
    }

    const service = createServiceClient();
    await service.from("payments").insert({
      user_id: user.id,
      gateway: "cashfree",
      cashfree_order_id: order.order_id,
      amount_paise: PRO_PRICE_RUPEES * 100,
      status: "created",
    });

    return NextResponse.json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
    });
  } catch (err) {
    console.error("Cashfree order creation failed", err);
    return NextResponse.json({ error: "Couldn't start checkout — try again." }, { status: 500 });
  }
}
