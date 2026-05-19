import { Users, UserCircle, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Club } from "@/data/clubsData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface ClubCardProps {
  club: Club;
}

const ClubCard = ({ club }: ClubCardProps) => {
  const navigate = useNavigate();
  const { userProfile, joinClub, leaveClub } = useAppContext();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isJoined = userProfile?.joinedClubIds?.includes(club.id);

  const handleClubAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      navigate("/dashboard");
      return;
    }

    setIsActionLoading(true);
    try {
      if (isJoined) {
        await leaveClub(club.id);
      } else {
        navigate(`/clubs/${club.id}/join`);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden group hover-lift h-full flex flex-col border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="relative overflow-hidden h-52">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Badge className="bg-primary/90 text-primary-foreground font-semibold shadow-xl border-none backdrop-blur-md">{club.category}</Badge>
          {isJoined && (
            <Badge className="bg-green-500 text-white font-semibold shadow-xl border-none backdrop-blur-md flex gap-1 items-center">
              <CheckCircle2 className="w-3 h-3" />
              Member
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3 flex-grow">
         <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors line-clamp-1">{club.name}</CardTitle>
        <CardDescription className="text-muted-foreground/80 line-clamp-2 mt-2 leading-relaxed">{club.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 text-xs bg-secondary/20 rounded-xl p-2.5 border border-border/20">
            <div className="flex items-center justify-center w-7 h-7 bg-primary/10 rounded-full">
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-foreground/90 font-medium">{club.members}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs bg-secondary/20 rounded-xl p-2.5 border border-border/20">
            <div className="flex items-center justify-center w-7 h-7 bg-accent/10 rounded-full">
              <UserCircle className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-foreground/90 font-medium truncate">{club.coordinator}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {isAdmin ? (
          <Button 
            onClick={handleClubAction}
            className="w-full group/btn font-bold rounded-xl h-11 transition-all shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700"
          >
            Manage Club (Admin)
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button 
            onClick={handleClubAction}
            disabled={isActionLoading}
            variant={isJoined ? "outline" : "default"}
            className={`w-full group/btn font-bold rounded-xl h-11 transition-all ${
              isJoined ? 'border-red-500/50 hover:bg-red-500/10 hover:text-red-500' : 'shadow-lg shadow-primary/20'
            }`}
          >
            {isJoined ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Leave Club
              </>
            ) : (
              <>
                Join Club
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClubCard;
