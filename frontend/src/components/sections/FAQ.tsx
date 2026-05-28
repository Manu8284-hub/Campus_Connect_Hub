import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'Is CAMpus-CONnect free for students?', a: 'Yes. Every student gets a full CAMpus-CONnect account at no cost.' },
  { q: 'Can I run multiple clubs from one account?', a: 'Yes. Role-based dashboards support students, club heads, and admins.' },
  { q: 'How do registrations and waitlists work?', a: 'Each event has a capacity. Once full, the API marks new signups as waitlisted.' },
  { q: 'Is the backend real?', a: 'Yes. Clubs, events, registrations, users, and notifications are stored in MongoDB through Express MVC APIs.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm uppercase tracking-widest gradient-text font-semibold mb-2">Questions</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
          Everything you wanted <span className="gradient-text">to ask</span>
        </h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass glow-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display font-semibold">{f.q}</span>
                <span className="grid place-items-center w-8 h-8 rounded-full glass flex-shrink-0">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-muted-foreground">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
