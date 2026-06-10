import { STATS } from "../data/stats";
import { useCountUp } from "../hooks/useCountUp";
import FadeInSection from "../components/FadeInSection";

function StatItem({ number, label }) {
  const [ref, displayValue] = useCountUp(number);

  return (
    <div ref={ref}>
      <h3>{displayValue}</h3>
      <span>{label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <FadeInSection>
      <section className="stats">
        {STATS.map((stat) => (
          <StatItem key={stat.id} number={stat.number} label={stat.label} />
        ))}
      </section>
    </FadeInSection>
  );
}