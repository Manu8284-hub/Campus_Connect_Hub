import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { EventItem } from '@/lib/api';

export default function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const pct = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -6 }}
    >
      <Link to="/events" className="glass glow-border rounded-2xl overflow-hidden block group hover:shadow-glow-soft transition-all">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute top-3 left-3 glass-strong rounded-xl px-3 py-1.5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Date</p>
            <p className="text-sm font-display font-bold leading-tight">{event.date}</p>
          </div>
          {event.isPast && (
            <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-muted/80 backdrop-blur-md">
              Past
            </span>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{event.club}</p>
            <h3 className="font-display font-bold text-xl text-balance leading-tight">{event.title}</h3>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.venue}</span>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Registrations</span>
              <span className="font-semibold">{event.registered} / {event.capacity}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full gradient-bg"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
