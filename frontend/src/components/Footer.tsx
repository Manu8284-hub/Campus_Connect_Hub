import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const floatingWords = [
  { word: "CLUBS", top: "12%", left: "8%", anim: "animate-float-1", delay: "0s" },
  { word: "EVENTS", top: "28%", left: "78%", anim: "animate-float-2", delay: "1.5s" },
  { word: "COMMUNITY", top: "68%", left: "14%", anim: "animate-float-3", delay: "0.5s" },
  { word: "CONNECT", top: "18%", left: "42%", anim: "animate-float-2", delay: "2s" },
  { word: "CAMPUS", top: "78%", left: "74%", anim: "animate-float-1", delay: "1s" },
  { word: "CULTURE", top: "52%", left: "86%", anim: "animate-float-3", delay: "3s" },
  { word: "SPORTS", top: "42%", left: "6%", anim: "animate-float-2", delay: "2.5s" },
  { word: "TECH", top: "62%", left: "58%", anim: "animate-float-1", delay: "0.8s" },
  { word: "LEAD", top: "84%", left: "38%", anim: "animate-float-3", delay: "1.2s" },
  { word: "CREATE", top: "32%", left: "28%", anim: "animate-float-1", delay: "2.2s" },
  { word: "DISCOVER", top: "78%", left: "3%", anim: "animate-float-2", delay: "0.4s" },
  { word: "GROW", top: "22%", left: "92%", anim: "animate-float-3", delay: "1.8s" }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const brandName = "CAMpus-CONnect";

  return (
    <footer className="bg-secondary/50 border-t border-border/40 mt-24 overflow-hidden relative">
      {/* Background Interactive Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Floating Words "here and there" */}
        {floatingWords.map((item, idx) => (
          <span
            key={idx}
            className={`absolute text-xs md:text-sm font-extrabold tracking-widest font-mono text-foreground/[0.04] ${item.anim}`}
            style={{
              top: item.top,
              left: item.left,
              animationDelay: item.delay,
            }}
          >
            {item.word}
          </span>
        ))}

        {/* Big Printed Watermark revealed after 3 seconds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black tracking-[0.15em] md:tracking-[0.25em] text-4xl sm:text-6xl md:text-8xl lg:text-9xl select-none pointer-events-none z-0 whitespace-nowrap text-center">
          {brandName.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block opacity-0 transform translate-y-6 filter blur-md scale-95 animate-typewriter-char"
              style={{
                animationDelay: `${3 + index * 0.1}s`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-2.5">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CAMpus-CONnect</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering students through clubs, events, and community engagement.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/clubs" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Browse Clubs
                </a>
              </li>
              <li>
                <a href="/events" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Upcoming Events
                </a>
              </li>
              <li>
                <a href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-lg">Categories</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground font-medium text-sm">Technical Clubs</li>
              <li className="text-muted-foreground font-medium text-sm">Arts & Culture</li>
              <li className="text-muted-foreground font-medium text-sm">Sports & Fitness</li>
              <li className="text-muted-foreground font-medium text-sm">Social Impact</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-5 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="p-2 bg-secondary rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">clubs@college.edu</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="p-2 bg-secondary rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="p-2 bg-secondary rounded-lg flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Student Center, Room 301</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} CAMpus-CONnect. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
