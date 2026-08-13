import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getRazorpay, PRO_PRICE_PAISE } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: PRO_PRICE_PAISE,
      currency: "INR",
      notes: { user_id: user.id, plan: "pro_monthly" },
    });

    const service = createServiceClient();
    await service.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount_paise: PRO_PRICE_PAISE,
      status: "created",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order creation failed", err);
    return NextResponse.json({ error: "Couldn't start checkout — try again." }, { status: 500 });
  }
}
