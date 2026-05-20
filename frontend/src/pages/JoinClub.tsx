import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Users, UserCircle } from "lucide-react";

const JoinClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clubs, submitClubApplication } = useAppContext();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    reason: "",
  });

  const club = clubs.find(c => c.id === Number(id));

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in before joining a club.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: { pathname: `/clubs/${id}/join` } } });
    } else if (isAdmin) {
      toast({
        title: "Admin Action Restricted",
        description: "Administrators cannot join clubs.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [id, isAuthenticated, isAdmin, navigate, toast]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
    }));
  }, [user?.email, user?.name]);

  useEffect(() => {
    if (!club) {
      toast({
        title: "Club Not Found",
        description: "The club you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/clubs");
    }
  }, [club, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) return;

    try {
      await submitClubApplication(club.id, formData);
      toast({
        title: "Successfully Joined!",
        description: `Welcome to ${club.name}! Your details have been stored and the coordinator will contact you soon.`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Join failed",
        description: error instanceof Error ? error.message : "Unable to join this club.",
        variant: "destructive",
      });
    }
  };

  if (!club) return null;

  return (
    <div className="min-h-screen flex flex-col">
      
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join {club.name}</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Fill out the form below to become a member
          </p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Club Information</CardTitle>
                <CardDescription>About {club.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <img 
                  src={club.image} 
                  alt={club.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-muted-foreground">{club.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{club.members} Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-primary" />
                    <span>Coordinator: {club.coordinator}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Form</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@college.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number *</Label>
                    <Input
                      id="rollNumber"
                      required
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="Enter your roll number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Why do you want to join? *</Label>
                    <Textarea
                      id="reason"
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Tell us why you're interested..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">Submit Application</Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/clubs")}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinClub;
