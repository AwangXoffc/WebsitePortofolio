export const scrollToSection = (event, href, offset = 88) => {
  if (!href || !href.startsWith("#")) return;
  const id = href.slice(1);
  event?.preventDefault();
  window.history.replaceState(null, "", href);
  const reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  let attempts = 0;
  const moveToTarget = () => {
    const target = document.getElementById(id);
    if (!target) {
      if (attempts < 80) {
        attempts += 1;
        window.setTimeout(moveToTarget, 50);
      }
      return;
    }
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  };
  moveToTarget();
};
