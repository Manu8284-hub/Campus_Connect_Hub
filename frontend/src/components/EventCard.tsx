import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Event } from "@/data/eventsData";
import { useAuth } from "@/context/AuthContext";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const registrationProgress = (event.currentParticipants / event.maxParticipants) * 100;
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isEventFull = spotsLeft === 0;

  return (
    <Card className="overflow-hidden group hover-lift h-full flex flex-col">
      <div className="relative overflow-hidden h-52 bg-gradient-to-br from-accent/20 to-primary/20">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 flex gap-2 z-10 flex-col items-end">
          <Badge className="bg-accent text-accent-foreground font-semibold shadow-lg">{event.category}</Badge>
          
          {event.status === "completed" && (
            <Badge className="bg-slate-700 text-white font-semibold shadow-lg">Completed</Badge>
          )}
          {event.status === "ongoing" && (
            <Badge className="bg-green-600 text-white font-semibold shadow-lg animate-pulse">Live Now</Badge>
          )}
          
          {event.status !== "completed" && event.registrationOpen && !isEventFull && (
            <Badge className="bg-primary text-primary-foreground font-semibold shadow-lg animate-pulse">Open</Badge>
          )}
          {event.status !== "completed" && isEventFull && (
            <Badge className="bg-red-600 text-white font-semibold shadow-lg">Full</Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="text-sm text-accent font-semibold">
          {event.club}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm bg-secondary/30 rounded-lg p-3">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm bg-secondary/30 rounded-lg p-3">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full flex-shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-medium">{event.time}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm bg-secondary/30 rounded-lg p-3">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-medium truncate">{event.venue}</span>
          </div>
        </div>

        {event.registrationOpen && (
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Users className="w-4 h-4 text-accent" />
                {event.currentParticipants}/{event.maxParticipants}
              </span>
              <span className={`text-sm font-semibold ${isEventFull ? 'text-red-600' : 'text-green-600'}`}>
                {isEventFull ? 'Event Full' : `${spotsLeft} spots`}
              </span>
            </div>
            <Progress value={registrationProgress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {isAdmin ? (
          <Button 
            onClick={() => navigate("/dashboard")}
            className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700"
          >
            Manage Event (Admin)
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        ) : event.status === "completed" ? (
          <Button variant="secondary" disabled className="w-full font-semibold">
            Event Completed
          </Button>
        ) : event.status === "ongoing" ? (
          <Button 
            variant="default"
            className="w-full font-semibold bg-green-600 hover:bg-green-700"
            onClick={() => navigate(`/events/${event.id}/register`)}
          >
            Join Live Event
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        ) : event.registrationOpen ? (
          <Button 
            onClick={() => navigate(`/events/${event.id}/register`)}
            className="w-full group/btn font-semibold"
            disabled={isEventFull}
            variant={isEventFull ? "secondary" : "default"}
          >
            {isEventFull ? "Event Full" : "Register Now"}
            {!isEventFull && <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
          </Button>
        ) : (
          <Button variant="secondary" disabled className="w-full font-semibold">
            Registration Closed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
