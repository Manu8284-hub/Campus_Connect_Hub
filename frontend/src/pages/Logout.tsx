import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully.",
    });
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Logout</CardTitle>
            <CardDescription>
              {isAuthenticated
                ? "Are you sure you want to logout?"
                : "You are already logged out."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAuthenticated ? (
              <>
                <Button className="w-full" onClick={handleLogout}>Confirm Logout</Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/admin")}>Back to Admin</Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => navigate("/login")}>Go to Login</Button>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Logout;
