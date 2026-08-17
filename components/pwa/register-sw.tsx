"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Fails silently — installability is a nice-to-have, not critical.
      });
    }
  }, []);

  return null;
}
