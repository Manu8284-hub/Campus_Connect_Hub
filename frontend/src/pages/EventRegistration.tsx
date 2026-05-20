import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, registerForEvent } = useAppContext();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    phone: "",
  });

  const event = events.find(e => e.id === Number(id));

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in before registering for an event.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: { pathname: `/events/${id}/register` } } });
    } else if (isAdmin) {
      toast({
        title: "Admin Action Restricted",
        description: "Administrators cannot register for events.",
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
    if (!event) {
      toast({
        title: "Event Not Found",
        description: "The event you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/events");
    } else if (!event.registrationOpen) {
      toast({
        title: "Registration Closed",
        description: "Registration for this event is closed.",
        variant: "destructive",
      });
      navigate("/events");
    } else if (event.currentParticipants >= event.maxParticipants) {
      toast({
        title: "Event Full",
        description: "This event has reached maximum capacity.",
        variant: "destructive",
      });
      navigate("/events");
    }
  }, [event, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      await registerForEvent(event.id);
      toast({
        title: "Registration Successful!",
        description: `You're registered for ${event.title}. Check your email for details.`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unable to register for this event.",
        variant: "destructive",
      });
    }
  };

  if (!event) return null;

  const spotsLeft = event.maxParticipants - event.currentParticipants;

  return (
    <div className="min-h-screen flex flex-col">
      
      <section className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Register for {event.title}</h1>
          <p className="text-lg text-accent-foreground/90 max-w-2xl">
            Secure your spot for this exciting event
          </p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>By {event.club}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-muted-foreground">{event.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
                  </div>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    ⚡ Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
                <CardDescription>Fill in your details</CardDescription>
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">Confirm Registration</Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/events")}>
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

export default EventRegistration;
