import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Code2,
  Palette,
  Server,
  Sparkles,
  Heart,
  Rocket,
  GraduationCap,
  Users,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "Jatin Kumar",
    role: "Full Stack Developer & Team Lead",
    image: "/jatin.png",
    bio: "Architected the entire CampusHub platform from ground up — backend APIs, real-time socket infrastructure, authentication system, and the admin dashboard.",
    skills: ["React", "Node.js", "MongoDB", "Socket.io", "TypeScript"],
    icon: <Code2 className="w-5 h-5" />,
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    glowColor: "blue",
    github: "https://github.com/JatinxKumar",
    linkedin: "https://www.linkedin.com/in/jatinxkumar/",
  },
  {
    name: "Madhav",
    role: "Frontend Developer & UI/UX Designer",
    image: "/madhav.png",
    bio: "Crafted the stunning visual identity of CampusHub — the futuristic dark theme, glassmorphism components, micro-animations, and responsive layouts.",
    skills: ["React", "Tailwind CSS", "Framer Motion", "Figma", "UI/UX"],
    icon: <Palette className="w-5 h-5" />,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    glowColor: "purple",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Manu",
    role: "Backend Developer & Database Engineer",
    image: "/manu.png",
    bio: "Engineered the robust backend infrastructure — RESTful APIs, database schema design, authentication middleware, and deployment pipeline.",
    skills: ["Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
    icon: <Server className="w-5 h-5" />,
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    glowColor: "cyan",
    github: "#",
    linkedin: "#",
  },
];

const projectStats = [
  { label: "Lines of Code", value: "15,000+", icon: <Code2 className="w-5 h-5" /> },
  { label: "Components Built", value: "50+", icon: <Sparkles className="w-5 h-5" /> },
  { label: "API Endpoints", value: "25+", icon: <Server className="w-5 h-5" /> },
  { label: "Cups of Coffee", value: "∞", icon: <Heart className="w-5 h-5" /> },
];

const techStack = [
  { name: "React 18", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Node.js", category: "Runtime" },
  { name: "Express.js", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "Socket.io", category: "Real-time" },
  { name: "JWT", category: "Auth" },
  { name: "Vite", category: "Build" },
  { name: "ShadCN UI", category: "Components" },
  { name: "Vercel", category: "Deploy" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--neon-purple)/0.15)] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-blue)/0.12)] rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--neon-pink)/0.08)] rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border/60 bg-card/40 backdrop-blur-md text-sm font-medium text-muted-foreground mb-8">
              <Users className="w-4 h-4 text-primary" />
              Meet the Builders
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Built with{" "}
              <span className="gradient-text">Passion</span>
              <br />
              by Students, for Students
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CampusHub was designed and developed as a passion project by a team of three
              dedicated developers from{" "}
              <span className="text-primary font-semibold">Chitkara University</span>,
              driven by the vision to revolutionize campus engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {projectStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass rounded-2xl p-6 text-center group hover:border-primary/40 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The <span className="gradient-text">Dream Team</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three developers, one vision — building the future of campus community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative"
              >
                {/* Card */}
                <div className="relative glass rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500 h-full flex flex-col">
                  {/* Gradient Top Accent */}
                  <div className={`h-1.5 bg-gradient-to-r ${member.gradient}`} />

                  {/* Profile Image */}
                  <div className="relative px-8 pt-8 pb-4 flex justify-center">
                    <div className="relative">
                      {/* Glow Ring */}
                      <div
                        className={`absolute -inset-2 bg-gradient-to-br ${member.gradient} rounded-full opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500`}
                      />
                      <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-border/60 group-hover:ring-primary/40 transition-all duration-500">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      {/* Role Icon Badge */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        {member.icon}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-8 pb-6 flex-1 flex flex-col">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className={`text-sm font-medium bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                        {member.role}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground text-center leading-relaxed mb-5 flex-1">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-5">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-xs font-medium rounded-full border border-border/60 bg-card/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl border border-border/60 bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl border border-border/60 bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powered by <span className="gradient-text">Modern Tech</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built with the latest and greatest technologies in the web ecosystem.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group"
              >
                <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 cursor-default">
                  <Sparkles className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tech.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tech.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[hsl(var(--neon-blue)/0.15)] rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[hsl(var(--neon-purple)/0.15)] rounded-full blur-[80px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-6 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="gradient-text">Mission</span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                We believe every student deserves a seamless, connected campus experience.
                CampusHub bridges the gap between students and campus life — making it
                effortless to discover clubs, register for events, and build meaningful
                connections that last a lifetime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/clubs" className="neon-button text-sm py-3 px-8">
                  <Rocket className="w-4 h-4" />
                  Explore Clubs
                </Link>
                <Link to="/events" className="ghost-button text-sm py-3 px-8">
                  <Trophy className="w-4 h-4" />
                  View Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground text-lg mb-6">
              Ready to join the campus revolution?
            </p>
            <Link
              to="/login"
              className="neon-button text-base py-4 px-10 inline-flex"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
