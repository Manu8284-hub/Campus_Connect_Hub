import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border/40 mt-24">
      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-2.5">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CampusHub</span>
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
              &copy; {currentYear} CampusHub. All rights reserved.
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
