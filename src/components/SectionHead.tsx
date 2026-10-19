"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

export default function SectionHead({
  index,
  title,
  note,
  className = "",
}: {
  index: string;
  title: string;
  note?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        root.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`mb-12 md:mb-16 ${className}`}>
      <div className="mb-4 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-fog md:text-xs">
        <span className="font-semibold text-acid">0{index}</span>
        <span className="h-px w-8 bg-acid/40" />
        {note && <span className="uppercase text-fog/80">{note}</span>}
      </div>
      <h2 className="font-display text-3xl md:text-5xl uppercase tracking-[0.06em] text-white font-medium">
        {title}
      </h2>
    </div>
  );
}
