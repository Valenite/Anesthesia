"use client";

import type { CSSProperties } from "react";

export default function Marquee({
  items,
  reverse = false,
  duration = 26,
  className = "",
  big = false,
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
  big?: boolean;
}) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`whitespace-nowrap px-6 font-display uppercase tracking-wide md:px-10 ${
              big ? "text-3xl md:text-5xl" : "text-xl md:text-3xl"
            } ${i % 3 === 1 ? "text-outline-faint" : "text-ink"}`}
          >
            {it}
          </span>
          <span
            className={`size-2 shrink-0 ${i % 2 === 0 ? "bg-acid" : "bg-ink/30"}`}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`mq-hover overflow-hidden border-y border-line py-4 md:py-5 ${
        reverse ? "mq-reverse" : ""
      } ${className}`}
    >
      <div
        className="marquee-track flex w-max"
        style={{ "--mq": `${duration}s` } as CSSProperties}
      >
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
