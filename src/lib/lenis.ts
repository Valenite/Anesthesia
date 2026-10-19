import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Smooth-scroll to a selector or pixel position using the shared Lenis instance. */
export function scrollTo(target: string | number) {
  if (!lenis) {
    if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }
  lenis.scrollTo(target as never, {
    offset: typeof target === "number" ? 0 : -72,
    duration: 1.5,
    easing: (t: number) => 1 - Math.pow(1 - t, 4),
  });
}
