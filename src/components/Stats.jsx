import { useStats } from "../hooks/useContent";
import { useCountUp } from "../hooks/useCountUp";
import FadeInSection from "../components/FadeInSection";
import "./Stats.css";

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
  const stats = useStats();

  return (
    <FadeInSection>
      <section className="stats">
        {stats.map((stat) => (
          <StatItem key={stat.id} number={stat.number} label={stat.label} />
        ))}
      </section>
    </FadeInSection>
  );
}