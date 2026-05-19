import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, CheckCircle2 } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="container py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-sm uppercase tracking-widest gradient-text font-semibold mb-3">The dashboard</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-balance mb-6">
            A control room <span className="gradient-text">for every role</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you are a curious freshman, a club head juggling 12 events, or the dean with a campus to oversee — your view is tailored, focused and beautiful.
          </p>
          <ul className="space-y-3">
            {[
              'Real-time attendance and registration tracking',
              'Member engagement scores and risk alerts',
              'Drag-and-drop event creation in under 60 seconds',
              'Exportable reports for funding committees',
            ].map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                <span className="text-foreground/90">{t}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="absolute inset-0 -m-6 bg-gradient-primary opacity-25 blur-3xl rounded-[3rem]" />
          <div className="glass-strong relative rounded-3xl p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, label: 'Members', value: '842', trend: '+12%' },
                { icon: Calendar, label: 'Events', value: '24', trend: '+4' },
                { icon: TrendingUp, label: 'Engagement', value: '87%', trend: '+9%' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="glass rounded-xl p-4">
                  <s.icon className="w-4 h-4 text-neon-purple mb-2" />
                  <p className="text-2xl font-display font-bold">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <p className="text-xs text-neon-cyan mt-1">{s.trend}</p>
                </motion.div>
              ))}
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="font-display font-semibold">Weekly engagement</p>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.6 }}
                    className="flex-1 rounded-t-lg gradient-bg opacity-90"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {['HackOverflow registrations open', 'Neon Nights at 94% capacity', 'New leader onboarding ready'].map((m, i) => (
                <motion.div key={m} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 + i * 0.1 }} className="glass rounded-lg px-4 py-3 flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                  {m}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
