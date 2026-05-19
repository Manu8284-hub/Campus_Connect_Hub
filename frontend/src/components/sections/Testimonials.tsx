import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Aria Chen', role: 'Computer Science - Junior', quote: 'CampusHub turned scattered club updates into one workflow we actually use.', avatar: 'https://i.pravatar.cc/120?img=47' },
  { name: 'Marcus Patel', role: 'Club Head - Quantum Robotics', quote: 'The dashboards save our team hours every week and keep registrations visible.', avatar: 'https://i.pravatar.cc/120?img=12' },
  { name: 'Sofia Reyes', role: 'Student Affairs - Dean', quote: 'It feels modern, accountable, and much easier for students to adopt.', avatar: 'https://i.pravatar.cc/120?img=32' },
];

export default function Testimonials() {
  return (
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm uppercase tracking-widest gradient-text font-semibold mb-2">Loved on campus</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
          The students <span className="gradient-text">already shipping</span> with CampusHub
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass glow-border rounded-2xl p-7"
          >
            <Quote className="w-7 h-7 text-neon-purple mb-4" />
            <p className="text-foreground/90 mb-6 text-balance">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-neon-purple/40" />
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
