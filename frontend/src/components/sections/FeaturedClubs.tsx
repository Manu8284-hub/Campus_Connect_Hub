import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ClubCard from '@/components/cards/ClubCard';
import { clubs } from '@/data/mockData';

export default function FeaturedClubs() {
  return (
    <section className="container py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm uppercase tracking-widest gradient-text font-semibold mb-2">
            Featured
          </motion.p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
            Clubs that move <span className="gradient-text">campus culture</span>
          </h2>
        </div>
        <Link to="/clubs" className="ghost-button text-sm self-start md:self-auto">
          Browse all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clubs.slice(0, 6).map((c, i) => <ClubCard key={c.id} club={c} index={i} />)}
      </div>
    </section>
  );
}
