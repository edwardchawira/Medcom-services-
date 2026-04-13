/**
 * Multiple-choice blocks: .mcq-root with buttons.mcq-opt[data-correct="true|false"]
 */
export function bindChapterMcqs(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll(".mcq-root").forEach((wrap) => {
    const feedback = wrap.querySelector(".mcq-feedback");
    wrap.querySelectorAll(".mcq-opt").forEach((node) => {
      const btn = node as HTMLButtonElement;
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const ok = btn.getAttribute("data-correct") === "true";
        if (feedback) {
          feedback.textContent = ok
            ? feedback.getAttribute("data-msg-correct") || "Correct."
            : feedback.getAttribute("data-msg-wrong") || "Not quite. Try again.";
          feedback.className =
            "mcq-feedback mt-3 text-sm min-h-[1.25rem] " +
            (ok ? "text-green-700 font-medium" : "text-amber-800");
        }
        if (ok) {
          wrap.querySelectorAll(".mcq-opt").forEach((b) => {
            const el = b as HTMLButtonElement;
            el.disabled = true;
            el.classList.add("opacity-70", "cursor-not-allowed");
          });
          btn.classList.remove("opacity-70");
          btn.classList.add(
            "ring-2",
            "ring-green-500",
            "border-green-600",
            "bg-green-50"
          );
        }
      });
    });
  });
}
