import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { clubs, events } from '@/data/mockData';

type Stat = { label: string; value: number; suffix: string };

function StatItem({ stat, idx }: { stat: Stat; idx: number }) {
  const { value, ref } = useCountUp(stat.value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="glass glow-border rounded-2xl p-8 text-center"
    >
      <span ref={ref} className="block font-display text-5xl md:text-6xl font-bold gradient-text">
        {value.toLocaleString()}{stat.suffix}
      </span>
      <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

export default function Stats() {
  const stats: Stat[] = [
    { label: 'Active Clubs', value: clubs.length, suffix: '' },
    { label: 'Students Connected', value: clubs.reduce((sum, club) => sum + club.members, 0), suffix: '+' },
    { label: 'Events Hosted', value: events.length, suffix: '' },
    { label: 'Open Seats', value: events.reduce((sum, event) => sum + Math.max(event.capacity - event.registered, 0), 0), suffix: '' },
  ];

  return (
    <section className="container py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => <StatItem key={s.label} stat={s} idx={i} />)}
      </div>
    </section>
  );
}
