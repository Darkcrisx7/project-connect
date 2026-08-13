import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { PRO_DURATION_DAYS } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Verify the signature ourselves — never trust the client's word that a
  // payment succeeded. This HMAC is the only proof that Razorpay actually
  // processed it, and it can only be computed with the secret key.
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: payment } = await service
    .from("payments")
    .select("id, user_id")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();

  if (!payment || payment.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found for this account" }, { status: 400 });
  }

  await service
    .from("payments")
    .update({ status: "paid", razorpay_payment_id })
    .eq("razorpay_order_id", razorpay_order_id);

  // Extend from whichever is later: now, or their current expiry (so
  // renewing early stacks on top instead of wasting remaining days).
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
