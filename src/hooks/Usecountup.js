import { useEffect, useRef, useState } from "react";

export function useCountUp(end, duration = 1800) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  const raw = parseFloat(end);
  const isNumeric = !isNaN(raw);
  const suffix = isNumeric ? end.replace(String(Math.floor(raw)), "") : "";

  useEffect(() => {
    if (!isNumeric) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          setValue(Math.floor(eased * raw));
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [raw, duration, isNumeric]);

  if (!isNumeric) return [ref, end];
  return [ref, `${value}${suffix}`];
}