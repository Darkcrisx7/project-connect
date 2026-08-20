"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
declare global {
  interface Window {
    Cashfree?: (options: { mode: string }) => {
      checkout: (options: Record<string, unknown>) => Promise<unknown>;
    };
  }
}
function loadCashfreeScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Cashfree) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
export function UpgradeButton({
  label = "Upgrade to Pro — ₹79/mo",
  loadingLabel = "Opening checkout…",
  variant = "accent",
}: {
  userEmail: string;
  userName: string;
  label?: string;
  loadingLabel?: string;
  variant?: "accent" | "outline";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  async function handleUpgrade() {
    setLoading(true);
    setError(undefined);

    const scriptReady = await loadCashfreeScript();
    if (!scriptReady) {
      setError("Couldn't load payment checkout — check your connection and try again.");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/cashfree/create-order", { method: "POST" });
    const order = await orderRes.json();
    if (!orderRes.ok) {
      setError(order.error ?? "Couldn't start checkout — try again.");
      setLoading(false);
      return;
    }

    const cashfree = window.Cashfree!({ mode: "production" });

    try {
      await cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: "_modal",
      });
    } catch {
      // Checkout closed/cancelled/errored client-side — fall through to
      // verify anyway, since Cashfree's server is the real source of truth.
    }

    const verifyRes = await fetch("/api/cashfree/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.orderId }),
    });

    if (verifyRes.ok) {
      router.refresh();
    } else {
      const data = await verifyRes.json();
      setError(data.error ?? "Payment wasn't completed — try again.");
    }
    setLoading(false);
  }

  return (
    <div>
      <Button variant={variant} size="md" onClick={handleUpgrade} disabled={loading}>
        {loading ? loadingLabel : label}
      </Button>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
