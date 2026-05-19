import { GraduationCap, Shield, Sparkles } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: "student" | "admin") => {
    localStorage.setItem("appRole", role);
    // Force a tiny delay so state catches up before navigation if needed, or just immediately fire
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background elements matching the 60-30-10 theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center smooth-in">
        <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm border border-border/50 text-foreground px-5 py-2.5 rounded-full mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold tracking-wide uppercase">
            Welcome to your campus community
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.1] text-foreground tracking-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            CampusHub
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-2xl leading-relaxed">
          The ultimate college club management system. Please tell us how you
          want to use the platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
          <button
            onClick={() => handleRoleSelection("student")}
            className="group relative p-8 rounded-3xl card-glass border border-border hover:border-primary/50 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                I am a Student
              </h2>
              <p className="text-muted-foreground">
                Join clubs, discover events, and connect with your peers across
                campus.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelection("admin")}
            className="group relative p-8 rounded-3xl card-glass border border-border hover:border-accent/50 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform">
                <Shield className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                I am an Admin
              </h2>
              <p className="text-muted-foreground">
                Create new clubs, manage events, and curate the campus
                community.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
