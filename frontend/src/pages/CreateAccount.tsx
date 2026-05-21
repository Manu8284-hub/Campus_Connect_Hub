import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Sparkles,
    User,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const { registerWithCredentials, loginWithCredentials } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.trim().length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter matching passwords.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithCredentials(name, email, password);
      await loginWithCredentials(email, password);

      toast({
        title: "Account created",
        description: "Welcome to Campus Connect Hub.",
      });

      navigate("/admin", { replace: true });
    } catch (error) {
      toast({
        title: "Account creation failed",
        description:
          error instanceof Error ? error.message : "Unable to create account.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col">
      <main className="relative flex-1 flex items-center justify-center px-4 py-20 pt-32 md:pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl">
            <CardHeader className="space-y-6 text-center pb-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-2xl shadow-sky-500/30">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              <div>
                <CardTitle className="text-4xl font-bold text-white">
                  Create Account
                </CardTitle>
                <CardDescription className="mt-3 text-slate-400 text-base">
                  Create your account to access the dashboard.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleCreateAccount} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your full name"
                      required
                      className="h-12 pl-12 bg-slate-900/70 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@college.edu"
                      required
                      className="h-12 pl-12 bg-slate-900/70 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="h-12 pl-12 pr-12 bg-slate-900/70 border-slate-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Re-enter your password"
                      required
                      className="h-12 pl-12 pr-12 bg-slate-900/70 border-slate-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Login here
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateAccount;
