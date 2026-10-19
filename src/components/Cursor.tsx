"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const [mounted, setMounted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setMounted(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let visible = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) visible = true;

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest("a, button, input, textarea, [role='button'], summary");
        isHovering = Boolean(isInteractive);
      }
    };

    const onMouseLeave = () => {
      visible = false;
    };

    const onMouseEnter = () => {
      visible = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.2);
      ringY = lerp(ringY, mouseY, 0.2);

      if (ringRef.current) {
        const scale = isHovering ? 2.2 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = visible ? (isHovering ? "0.6" : "0.3") : "0";
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] size-6 rounded-full border border-[#3b9eff] bg-[#3b9eff]/10 backdrop-blur-[0.5px] transition-transform duration-100 ease-out will-change-transform"
      style={{ opacity: 0 }}
    />
  );
}
