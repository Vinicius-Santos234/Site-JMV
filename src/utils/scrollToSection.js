export function scrollToSection(hash) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
