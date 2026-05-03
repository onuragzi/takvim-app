"use client";

import { useEffect, useState } from "react";

export default function NowLine() {
  const [pct, setPct] = useState(() => {
    const m = new Date().getMinutes();
    return (m / 60) * 100;
  });

  useEffect(() => {
    const tick = () => {
      const m = new Date().getMinutes();
      setPct((m / 60) * 100);
    };
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute left-0 right-0 flex items-center pointer-events-none z-10" style={{ top: `${pct}%` }}>
      <div
        className="now-dot w-2.5 h-2.5 rounded-full shrink-0 -ml-1.5"
        style={{ background: "var(--now)", boxShadow: "0 0 6px var(--now)" }}
      />
      <div className="flex-1 h-px" style={{ background: "var(--now)", opacity: 0.6 }} />
    </div>
  );
}
