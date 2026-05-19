import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import EventCard from '@/components/cards/EventCard';
import { events } from '@/data/mockData';

export default function TrendingEvents() {
  const upcoming = events.filter(e => !e.isPast).slice(0, 4);
  return (
    <section className="container py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-sm uppercase tracking-widest gradient-text font-semibold mb-2">
            <Flame className="w-4 h-4" /> Trending now
          </motion.p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
            Events you don't want to miss
          </h2>
        </div>
        <Link to="/events" className="ghost-button text-sm self-start md:self-auto">
          All events <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
      </div>
    </section>
  );
}
