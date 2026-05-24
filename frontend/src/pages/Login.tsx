import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Chrome,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: "outline" | "filled_blue" | "filled_black";
              size: "large" | "medium" | "small";
              width?: string;
              text?: string;
            }
          ) => void;
        };
      };
    };
  }
}

const Login = () => {
  const { loginWithGoogle, loginWithCredentials, isAuthenticated, user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } } | undefined)?.from
      ?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from === "/login" ? "/dashboard" : from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const handleGoogleLogin = () => {
    if (!googleClientId) {
      toast({
        title: "Google Client ID Missing",
        description: "Add VITE_GOOGLE_CLIENT_ID in .env to enable Google sign in.",
        variant: "destructive",
      });
      return;
    }

    if (!isGoogleReady) {
      toast({
        title: "Google Sign In Loading",
        description: "Google authentication is still initializing. Try again in a moment.",
      });
      return;
    }

    const googleButton = googleButtonRef.current?.querySelector("div[role='button']") as
      | HTMLDivElement
      | undefined;

    if (!googleButton) {
      toast({
        title: "Google Sign In Unavailable",
        description: "The Google sign in button could not be prepared. Refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    googleButton.click();
  };

  const handleCredentialLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitLoading(true);

    try {
      const isValid = await loginWithCredentials(email, password);

      if (!isValid) {
        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome Back!",
        description: "Successfully signed in.",
      });

      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated || !googleClientId) return;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            const success = await loginWithGoogle(
              response.credential || ""
            );

            if (!success) {
              toast({
                title: "Google Login Failed",
                description: "Unable to authenticate.",
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Logged In Successfully",
              description: "Welcome to CampusHub.",
            });

            navigate(from, { replace: true });
          } catch (error) {
            toast({
              title: "Authentication Error",
              description:
                error instanceof Error
                  ? error.message
                  : "Google authentication failed.",
              variant: "destructive",
            });
          }
        },
      });

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "filled_black",
          size: "large",
          width: "380",
          text: "continue_with",
        }
      );

      setIsGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      setIsGoogleReady(false);
      toast({
        title: "Google Sign In Failed",
        description: "Google authentication script could not be loaded.",
        variant: "destructive",
      });
    };

    document.body.appendChild(script);

    return () => {
      setIsGoogleReady(false);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [
    from,
    googleClientId,
    isAuthenticated,
    loginWithGoogle,
    navigate,
    toast,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      <main className="relative flex-1 flex items-center justify-center px-4 py-20">
        {/* Background */}
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
                  Welcome Back
                </CardTitle>
                <CardDescription className="mt-3 text-slate-400 text-base">
                  Access your clubs, events, and campus community.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {isAuthenticated ? (
                <div className="space-y-4 text-center">
                  <p className="text-slate-300">
                    Signed in as
                    <span className="ml-2 font-semibold text-sky-400">
                      {user?.name}
                    </span>
                  </p>

                  <Link to="/">
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600">
                      Go to Home
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <form
                    onSubmit={handleCredentialLogin}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Your Email Address"
                          className="h-12 pl-12 bg-slate-900/70 border-slate-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="h-12 pl-12 pr-12 bg-slate-900/70 border-slate-700 text-white"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitLoading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25"
                    >
                      {isSubmitLoading ? "Signing In..." : "Sign In"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>

                  {/* Google Sign In Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-800" />
                    </div>

                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onClick={() => void handleGoogleLogin()}
                        className="group inline-flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-8 py-4 text-slate-200 shadow-lg transition-all duration-300 hover:border-sky-500 hover:bg-slate-900 hover:shadow-sky-500/20"
                      >
                        {/* Google Logo */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          className="h-7 w-7"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.233 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                          />
                          <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.141 35.091 26.715 36 24 36c-5.211 0-9.617-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303c-.793 2.237-2.231 4.166-4.084 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                          />
                        </svg>

                        <span className="text-base font-semibold tracking-wide">
                          Continue with Google
                        </span>
                      </button>
                    </div>
                  </div>

                  <div ref={googleButtonRef} className="hidden" aria-hidden="true" />

                  <p className="text-center text-sm text-slate-400">
                    New here?{' '}
                    <Link
                      to="/create-account"
                      className="font-semibold text-sky-400 hover:text-sky-300"
                    >
                      Create Account
                    </Link>
                  </p>

                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
