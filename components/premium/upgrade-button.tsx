"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function UpgradeButton({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  async function handleUpgrade() {
    setLoading(true);
    setError(undefined);

    const scriptReady = await loadRazorpayScript();
    if (!scriptReady) {
      setError("Couldn't load payment checkout — check your connection and try again.");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/razorpay/create-order", { method: "POST" });
    const order = await orderRes.json();

    if (!orderRes.ok) {
      setError(order.error ?? "Couldn't start checkout — try again.");
      setLoading(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Project Connect",
      description: "Pro membership — 1 month",
      order_id: order.orderId,
      prefill: { email: userEmail, name: userName },
      theme: { color: "#5B4CFF" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        if (verifyRes.ok) {
          router.refresh();
        } else {
          const data = await verifyRes.json();
          setError(data.error ?? "Payment went through but activation failed — contact support.");
        }
        setLoading(false);
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });

    razorpay.open();
  }

  return (
    <div>
      <Button variant="accent" size="md" onClick={handleUpgrade} disabled={loading}>
        {loading ? "Opening checkout…" : "Upgrade to Pro — ₹59/mo"}
      </Button>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
