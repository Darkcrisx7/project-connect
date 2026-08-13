import Razorpay from "razorpay";

export function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export const PRO_PRICE_PAISE = 5900; // ₹59.00
export const PRO_DURATION_DAYS = 30;
