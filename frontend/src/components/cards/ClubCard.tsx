import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight } from 'lucide-react';
import type { Club } from '@/lib/api';

export default function ClubCard({ club, index = 0, view = 'grid' }: { club: Club; index?: number; view?: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/clubs/${club.id}`} className="glass glow-border rounded-2xl p-4 flex gap-5 items-center hover:shadow-glow-soft transition-all group">
          <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <div className={`absolute inset-0 bg-gradient-to-tr ${club.color} opacity-30 mix-blend-overlay`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
              <span className="px-2 py-0.5 rounded-full bg-muted/60">{club.category}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {club.members}</span>
            </div>
            <h3 className="font-display font-semibold text-lg truncate">{club.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{club.description}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:rotate-12 transition-transform" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/clubs/${club.id}`} className="glass glow-border rounded-2xl overflow-hidden block group hover:shadow-glow-soft transition-all">
        <div className="relative h-44 overflow-hidden">
          <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
          <div className={`absolute inset-0 bg-gradient-to-tr ${club.color} opacity-40 mix-blend-overlay`} />
          <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent" />
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full glass-strong">
            {club.category}
          </span>
          <span className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full glass-strong">
            <Users className="w-3 h-3" /> {club.members}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-xl mb-1">{club.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{club.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="gradient-text font-semibold">{club.tagline}</span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
