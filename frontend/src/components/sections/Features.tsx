import { motion } from 'framer-motion';
import { Zap, Calendar, Users, Shield, BarChart3, Bell } from 'lucide-react';

const features = [
  { icon: Zap, title: 'One-tap discovery', desc: 'Personalized club recommendations powered by your interests and friends-of-friends graph.', color: 'from-neon-blue to-neon-cyan' },
  { icon: Calendar, title: 'Events that run themselves', desc: 'Capacity, waitlists, reminders, check-ins and post-event analytics on autopilot.', color: 'from-neon-purple to-neon-pink' },
  { icon: Users, title: 'Member CRM', desc: 'Know who is engaged, who needs a nudge, and who is your next leader.', color: 'from-neon-pink to-neon-blue' },
  { icon: Shield, title: 'Role-aware access', desc: 'Student, Club Head and Admin views with permissions you never have to think about.', color: 'from-neon-cyan to-neon-purple' },
  { icon: BarChart3, title: 'Live analytics', desc: 'Beautiful charts on attendance, growth, and engagement — exportable in one click.', color: 'from-neon-blue to-neon-purple' },
  { icon: Bell, title: 'Smart notifications', desc: 'Push, email and in-app — only when it matters. We block notification spam by default.', color: 'from-neon-purple to-neon-cyan' },
];

export default function Features() {
  return (
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm uppercase tracking-widest gradient-text font-semibold mb-2">Why CampusHub</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
          Everything a campus needs. <span className="gradient-text">Nothing it doesn't.</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="glass glow-border rounded-2xl p-7 group"
          >
            <div className={`w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br ${f.color} shadow-glow-soft mb-5 group-hover:scale-110 transition-transform`}>
              <f.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
