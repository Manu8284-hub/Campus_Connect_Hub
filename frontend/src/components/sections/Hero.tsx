import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, Users, CalendarDays, Radio } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Hero() {
  const { clubs, events } = useAppContext();

  const totalClubs = clubs.length;
  const totalEvents = events.length;
  const totalMembers = clubs.reduce((acc, club) => acc + (club.members || 0), 0);

  const floatingCards = [
    {
      icon: Users,
      label: `${totalClubs} Clubs`,
      sub: 'Active communities',
      pos: 'top-4 -left-4 md:top-8 md:-left-10',
      delay: 0.7,
      float: { y: [0, -12, 0] },
    },
    {
      icon: CalendarDays,
      label: `${totalMembers} Members`,
      sub: 'Engaged students',
      pos: 'bottom-12 -left-2 md:bottom-20 md:-left-6',
      delay: 0.9,
      float: { y: [0, 10, 0] },
    },
    {
      icon: Radio,
      label: `${totalEvents} Events`,
      sub: 'Scheduled now',
      pos: 'top-1/3 -right-2 md:-right-8',
      delay: 1.1,
      float: { y: [0, -8, 0] },
    },
  ];
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

          {/* Right: mock dashboard UI */}
          <div className="relative h-[420px] sm:h-[520px] lg:h-[620px] flex items-center justify-center lg:-mr-12 xl:-mr-20 w-full max-w-[550px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { duration: 1, delay: 0.3 },
                scale: { duration: 1.2, delay: 0.3, ease: 'easeOut' },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
              }}
              className="relative z-10 w-full aspect-[4/3] rounded-3xl border border-border bg-card p-6 shadow-2xl flex flex-col justify-between"
            >
              {/* Mock Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-foreground" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/15" />
                </div>
                <span className="text-xs font-mono tracking-widest text-muted-foreground">CAMPUS-CONNECT.SYS</span>
              </div>

              {/* Mock Window Content */}
              <div className="flex-1 py-6 flex flex-col justify-center space-y-5">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">Campus Stats</span>
                  <div className="text-2xl font-bold font-display tracking-tight text-foreground">Real-time Overview</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex flex-col justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Total Clubs</span>
                    <span className="text-3xl font-bold mt-2 font-display">{totalClubs}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex flex-col justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Total Events</span>
                    <span className="text-3xl font-bold mt-2 font-display">{totalEvents}</span>
                  </div>
                </div>
              </div>

              {/* Mock Window Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between text-[10px] font-mono tracking-wider text-muted-foreground">
                <span>VER 4.2.0</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-foreground animate-ping" />
                  LIVE CONNECTIONS
                </span>
              </div>
            </motion.div>

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
