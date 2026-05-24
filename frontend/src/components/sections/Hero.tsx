import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, Users, CalendarDays, Radio } from 'lucide-react';
import clubHubImage from '@/assets/hero-orb.png';

const floatingCards = [
  {
    icon: Users,
    label: '120+ Clubs',
    sub: 'Active communities',
    pos: 'top-4 -left-4 md:top-8 md:-left-10',
    delay: 0.7,
    float: { y: [0, -12, 0] },
  },
  {
    icon: CalendarDays,
    label: '5000+ Students',
    sub: 'Engaged members',
    pos: 'bottom-12 -left-2 md:bottom-20 md:-left-6',
    delay: 0.9,
    float: { y: [0, 10, 0] },
  },
  {
    icon: Radio,
    label: 'Live Events',
    sub: '24 happening now',
    pos: 'top-1/3 -right-2 md:-right-8',
    delay: 1.1,
    float: { y: [0, -8, 0] },
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-primary opacity-20 blur-3xl pointer-events-none" />

      <div className="container relative pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-xs font-medium mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
              <span>The new operating system for college clubs</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-6xl xl:text-7xl tracking-tight text-balance mb-6"
            >
              Innovate. <span className="gradient-text animate-gradient">Connect.</span><br />Lead.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-muted-foreground text-balance mb-10"
            >
              One luminous home for every club, every event, every student. Discover communities that match your spark and run them with software that finally feels like 2026.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center"
            >
              <Link to="/clubs" className="neon-button">
                Explore Clubs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="ghost-button">
                <Play className="w-4 h-4" /> See Dashboard
              </Link>
            </motion.div>
          </div>

          {/* Right: orb */}
          <div className="relative h-[420px] sm:h-[520px] lg:h-[620px] flex items-center justify-center lg:-mr-12 xl:-mr-20">
            {/* radial depth */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--neon-purple) / 0.35), transparent 60%)' }} />
            {/* glow halos */}
            <div className="absolute w-[80%] aspect-square rounded-full bg-neon-blue/30 blur-3xl pointer-events-none" />
            <div className="absolute w-[70%] aspect-square rounded-full bg-neon-pink/25 blur-3xl translate-x-10 translate-y-10 pointer-events-none" />
            <div className="absolute w-[60%] aspect-square rounded-full bg-neon-purple/30 blur-3xl -translate-x-8 -translate-y-8 pointer-events-none" />

            <motion.img
              src={clubHubImage}
              alt="College Club and Event Management Hub"
              width={1024}
              height={1024}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
              transition={{
                opacity: { duration: 1, delay: 0.3 },
                scale: { duration: 1.2, delay: 0.3, ease: 'easeOut' },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
              }}
              className="relative z-10 w-[95%] max-w-[620px] object-contain rounded-[2rem] overflow-hidden drop-shadow-[0_0_80px_hsl(var(--neon-purple)/0.6)]"
            />

            {/* Floating glass cards */}
            {floatingCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: c.delay }}
                  className={`absolute ${c.pos} z-20`}
                >
                  <motion.div
                    animate={c.float}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                    className="glass-strong glow-border rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[160px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-soft">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{c.label}</div>
                      <div className="text-[11px] text-muted-foreground">{c.sub}</div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
