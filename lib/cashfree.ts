export const CASHFREE_API_BASE = "https://api.cashfree.com/pg";
export const CASHFREE_API_VERSION = "2023-08-01";

export function cashfreeHeaders() {
  return {
    "x-client-id": process.env.CASHFREE_APP_ID!,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    "x-api-version": CASHFREE_API_VERSION,
    "Content-Type": "application/json",
  };
}

export const PRO_PRICE_RUPEES = 79;
export const PRO_DURATION_DAYS = 30;
