export const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+<>/=";

const frames = new WeakMap<HTMLElement, number>();

/**
 * Decrypt-style text scramble: reveals `finalText` left → right while the
 * unrevealed characters cycle through random glyphs.
 */
export function scramble(
  el: HTMLElement | null,
  finalText: string,
  duration = 700,
) {
  if (!el) return;
  const prev = frames.get(el);
  if (prev) cancelAnimationFrame(prev);

  const len = finalText.length;
  const start = performance.now();

  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const reveal = Math.floor(p * len);
    let out = finalText.slice(0, reveal);
    for (let i = reveal; i < len; i++) {
      out +=
        finalText[i] === " "
          ? " "
          : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) {
      frames.set(el, requestAnimationFrame(tick));
    } else {
      el.textContent = finalText;
      frames.delete(el);
    }
  };

  frames.set(el, requestAnimationFrame(tick));
}
