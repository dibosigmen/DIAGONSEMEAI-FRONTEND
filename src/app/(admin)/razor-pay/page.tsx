"use client";

import { useState, Suspense, useRef, useCallback } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

/* ================= BORDER GLOW ================= */
function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 260, s: 80, l: 70 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

  const vars: any = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(
      opacities[i] * intensity,
      100
    )}%)`;
  }
  return vars;
}

const BorderGlow = ({ children }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: any) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const dx = x - cx;
    const dy = y - cy;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    card.style.setProperty("--cursor-angle", `${angle}deg`);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      style={{
        ...buildGlowVars("260 80 70", 1),
        "--border-radius": "16px",
      } as any}
      className="relative rounded-xl p-[1.5px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-lg"
    >
      <div className="rounded-xl bg-white/70 backdrop-blur-2xl p-8 border border-white/20 shadow-xl">
        {children}
      </div>
    </div>
  );
};

/* ================= CHECKOUT ================= */
function RazorpayCheckoutContent() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const pkgNameParam = searchParams.get("packageName");

  const amountToPay = amountParam ? parseInt(amountParam) : 500;
  const packageName = pkgNameParam || "Health Package Upgrade";

  const [loading, setLoading] = useState(false);

  const makePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        body: JSON.stringify({ amount: amountToPay, currency: "INR" }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create order");

      const order = await res.json();

      const options = {
        key: "rzp_test_SYYCfVv7Um4t2Z",
        amount: order.amount,
        currency: order.currency,
        name: packageName,
        description: "Secure Payment",
        order_id: order.id,
        handler: function (response: any) {
          alert("✅ Payment Successful\n" + response.razorpay_payment_id);
        },
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.on("payment.failed", function (response: any) {
        alert("❌ Failed: " + response.error.description);
      });

      paymentObject.open();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BorderGlow>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Secure Checkout
        </h1>

        <p className="text-gray-500">
          You're upgrading to
        </p>

        {/* Package Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-lg p-5 border border-white/30 shadow-md">
          <p className="text-lg font-semibold text-gray-800">
            {packageName}
          </p>
          <p className="text-2xl font-bold text-[#10A37F] mt-2">
            ₹{amountToPay}
          </p>
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={makePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#10A37F] to-[#0e8a6a] text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Processing..." : "Pay Securely"}
        </motion.button>

        <p className="text-xs text-gray-400 mt-2">
          🔒 100% Secure Payment via Razorpay
        </p>
      </motion.div>
    </BorderGlow>
  );
}

/* ================= MAIN ================= */
export default function RazorpayCheckoutPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <RazorpayCheckoutContent />
      </Suspense>
    </div>
  );
}