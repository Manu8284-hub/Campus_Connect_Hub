import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  CalendarClock,
  Camera,
  Clock,
  Download,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  UserRound,
  Users,
  Activity,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { apiUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const interestOptions = [
  "Coding",
  "Public Speaking",
  "Photography",
  "Robotics",
  "Music",
  "Sports",
  "Debate",
  "Sustainability",
];

const formatName = (name?: string) => {
  if (!name) return "Jatu Sharma";

  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getInitials = (name?: string) => {
  if (!name) return "CU";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

const formatDate = (value: string) => {
  if (!value) return "";
  const cleanValue = value.replace("20026", "2026");
  const dateObj = new Date(cleanValue);
  if (isNaN(dateObj.getTime())) {
    return value;
  }
  if (dateObj.getFullYear() > 2100) {
    dateObj.setFullYear(2026);
  }
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const cleanGithub = (val: string) => {
  return val ? val.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "") : "";
};

const cleanLinkedin = (val: string) => {
  return val ? val.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, "") : "";
};

const cleanPortfolio = (val: string) => {
  return val ? val.replace(/^(https?:\/\/)?(www\.)?/i, "") : "";
};

const getBadgeStyles = (id: string) => {
  switch (id) {
    case "event-pioneer":
      return {
        bg: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400",
        shadow: "shadow-sky-500/10",
        icon: BadgeCheck,
      };
    case "community-builder":
      return {
        bg: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
        shadow: "shadow-purple-500/10",
        icon: Users,
      };
    case "top-contributor":
      return {
        bg: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
        shadow: "shadow-emerald-500/10",
        icon: Trophy,
      };
    case "club-leader":
      return {
        bg: "from-amber-500/20 to-rose-500/10 border-amber-500/30 text-amber-400",
        shadow: "shadow-amber-500/10",
        icon: Award,
      };
    default:
      return {
        bg: "from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400",
        shadow: "shadow-slate-500/10",
        icon: Trophy,
      };
  }
};

const Profile = () => {
  const { user, isAdmin, checkSession } = useAuth();
  const {
    userProfile,
    joinedClubs,
    registeredEvents,
    attendanceScore,
    recommendedClubs,
    updateUserProfile,
    markEventAttendance,
  } = useAppContext();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    portfolio: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("picture", file);

    setIsUploading(true);

    try {
      const response = await fetch(apiUrl("/auth/upload-picture"), {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload photo");
      }

      const data = await response.json();
      toast({
        title: "Profile photo updated",
        description: "Your new profile picture has been saved successfully.",
      });

      // Refresh authentication session to update the user picture everywhere
      await checkSession();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong while uploading your profile photo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);

    try {
      const response = await fetch(apiUrl("/auth/remove-picture"), {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove photo");
      }

      toast({
        title: "Profile photo removed",
        description: "Your profile picture has been removed successfully.",
      });

      // Refresh authentication session to update the user picture everywhere
      await checkSession();
    } catch (error: any) {
      toast({
        title: "Removal failed",
        description: error.message || "Something went wrong while removing your profile photo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setBio(userProfile?.bio || "");
    setSocialLinks(
      userProfile?.socialLinks || {
        github: "",
        linkedin: "",
        portfolio: "",
      }
    );
    setInterests(userProfile?.interests || []);
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmailInput(user.email || "");
    }
  }, [user]);

  const badges = useMemo(() => {
    const earnedBadges = [];

    if (registeredEvents.length >= 1) {
      earnedBadges.push({
        id: "event-pioneer",
        label: "Event Pioneer",
        description: "Registered for the first campus event.",
      });
    }

    if (joinedClubs.length >= 2) {
      earnedBadges.push({
        id: "community-builder",
        label: "Community Builder",
        description: "Joined multiple campus communities.",
      });
    }

    if (attendanceScore >= 70) {
      earnedBadges.push({
        id: "top-contributor",
        label: "Top Contributor",
        description: "Consistently shows up for registered events.",
      });
    }

    if (isAdmin) {
      earnedBadges.push({
        id: "club-leader",
        label: "Club Leader",
        description: "Has elevated access across the platform.",
      });
    }

    return earnedBadges;
  }, [attendanceScore, isAdmin, joinedClubs.length, registeredEvents.length]);

  const certificates = registeredEvents.filter(
    (registration) => registration.certificateIssuedAt
  );

  const monthlyScores = useMemo(() => {
    return [0, 1, 2, 3, 4].map((monthIndex) => {
      // monthIndex: 0 = Jan, 1 = Feb, 2 = Mar, 3 = Apr, 4 = May
      const limitDate = new Date(2026, monthIndex + 1, 0, 23, 59, 59);

      const registeredCount = (userProfile?.eventRegistrations || []).filter((reg) => {
        const regDate = new Date(reg.registeredAt);
        return regDate <= limitDate;
      }).length;

      const attendedCount = (userProfile?.eventRegistrations || []).filter((reg) => {
        if (!reg.attendanceConfirmed) return false;
        const confirmDate = reg.certificateIssuedAt
          ? new Date(reg.certificateIssuedAt)
          : new Date(reg.registeredAt);
        return confirmDate <= limitDate;
      }).length;

      // Distribute joined clubs across the months to simulate progress
      let clubsJoinedUpToMonth = 0;
      joinedClubs.forEach((_, index) => {
        if (index === 0 && monthIndex >= 0) clubsJoinedUpToMonth++;
        else if (index === 1 && monthIndex >= 2) clubsJoinedUpToMonth++;
        else if (index >= 2 && monthIndex >= 4) clubsJoinedUpToMonth++;
      });

      const clubsContribution = Math.min(clubsJoinedUpToMonth * 15, 45);
      const registrationsContribution = Math.min(registeredCount * 15, 30);
      const attendanceContribution = Math.min(attendedCount * 25, 25);

      return Math.min(10 + clubsContribution + registrationsContribution + attendanceContribution, 100);
    });
  }, [userProfile?.eventRegistrations, joinedClubs]);

  const [scoreJan, scoreFeb, scoreMar, scoreApr, scoreMay] = monthlyScores;

  const yJan = 130 - scoreJan * 1.1;
  const yFeb = 130 - scoreFeb * 1.1;
  const yMar = 130 - scoreMar * 1.1;
  const yApr = 130 - scoreApr * 1.1;
  const yMay = 130 - scoreMay * 1.1;

  const chartPath = `M 50 ${yJan} C 100 ${yJan}, 100 ${yFeb}, 150 ${yFeb} C 200 ${yFeb}, 200 ${yMar}, 250 ${yMar} C 300 ${yMar}, 300 ${yApr}, 350 ${yApr} C 400 ${yApr}, 400 ${yMay}, 450 ${yMay}`;

  const saveProfile = async () => {
    try {
      const githubUrl = socialLinks.github ? `https://github.com/${cleanGithub(socialLinks.github)}` : "";
      const linkedinUrl = socialLinks.linkedin ? `https://linkedin.com/in/${cleanLinkedin(socialLinks.linkedin)}` : "";
      const portfolioUrl = socialLinks.portfolio ? `https://${cleanPortfolio(socialLinks.portfolio)}` : "";

      await updateUserProfile({
        displayName: name,
        email: emailInput,
        bio,
        interests,
        socialLinks: {
          github: githubUrl,
          linkedin: linkedinUrl,
          portfolio: portfolioUrl,
        },
      });
      await checkSession();
      toast({
        title: "Profile updated",
        description: "Your dashboard details are now saved for this account.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile details.",
        variant: "destructive",
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((entry) => entry !== interest)
        : [...prev, interest]
    );
  };

  const downloadCertificate = (eventTitle: string, issuedAt: string) => {
    if (typeof window === "undefined" || !user?.name) {
      return;
    }

    const certificateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Certificate - ${eventTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 40px; }
    .card { max-width: 840px; margin: 0 auto; border: 1px solid rgba(255,255,255,.15); border-radius: 24px; padding: 48px; background: linear-gradient(135deg, #0f172a, #1e293b); }
    .eyebrow { color: #7dd3fc; font-size: 14px; letter-spacing: .18em; text-transform: uppercase; }
    h1 { font-size: 44px; margin: 18px 0 10px; }
    p { color: #cbd5e1; line-height: 1.6; font-size: 18px; }
    .name { color: #fff; font-size: 30px; font-weight: bold; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="eyebrow">CampusHub Certificate</div>
    <h1>Certificate of Participation</h1>
    <p>This certifies that</p>
    <div class="name">${formatName(user.name)}</div>
    <p>successfully completed participation in <strong>${eventTitle}</strong>.</p>
    <p>Issued on ${formatDate(issuedAt)} for active contribution to the campus community.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([certificateHtml], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventTitle.replace(/\s+/g, "-").toLowerCase()}-certificate.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadQRCode = async (ticketCode: string, eventTitle: string) => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticketCode}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${eventTitle.replace(/\s+/g, "-").toLowerCase()}-${ticketCode}-qr.png`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "QR Code Downloaded",
        description: "Show this code at the event entrance for quick check-in.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      <main className="relative px-4 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/4 top-8 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl space-y-8">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </Link>
          </div>

          <Card className="border-white/10 bg-slate-950/25 backdrop-blur-2xl shadow-2xl rounded-3xl">
            <CardHeader className="border-b border-white/10 pb-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-24 w-24 ring-4 ring-sky-500/20 transition-all duration-300 group-hover:ring-sky-500/50">
                        <AvatarImage src={user?.picture} alt={user?.name || "User"} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-600 text-2xl font-bold text-white">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Hover Overlay */}
                      <div 
                        onClick={() => document.getElementById("profile-photo-input")?.click()}
                        className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Camera className="h-6 w-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium">Change Photo</span>
                      </div>

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center">
                          <span className="text-xs text-sky-400 font-semibold animate-pulse">Uploading...</span>
                        </div>
                      )}
                    </div>

                    {user?.picture && (
                      <button
                        onClick={handleRemovePhoto}
                        disabled={isUploading}
                        className="text-xs text-rose-400 hover:text-rose-300 hover:underline transition-colors mt-0.5"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profile-photo-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />

                  <div>
                    <CardTitle className="text-3xl font-bold text-foreground">
                      {formatName(user?.name)}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                      Your student dashboard and activity center
                    </CardDescription>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
                        <GraduationCap className="h-4 w-4" />
                        Computer Science & Engineering
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
                        <CalendarClock className="h-4 w-4" />
                        Semester 4
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-500/10 px-4 py-1.5 text-sm text-pink-300">
                        <UserRound className="h-4 w-4" />
                        Roll: 2410991234
                      </div>
                      {isAdmin && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-1.5 text-sm text-red-300">
                          <ShieldCheck className="h-4 w-4" />
                          Admin Account
                        </div>
                      )}
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                        <Trophy className="h-4 w-4" />
                        {badges.length} Badge{badges.length === 1 ? "" : "s"} earned
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {isAdmin && (
                    <Link to="/dashboard">
                      <Button className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 sm:w-auto">
                        Admin Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-6 p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
              <div className="rounded-2xl border border-white/10 bg-slate-950/20 backdrop-blur-xl p-6 hover:border-sky-500/30 transition-all duration-300 h-44 flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Joined Clubs</p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">{joinedClubs.length}</p>
                  </div>
                  <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-400">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex -space-x-2 overflow-hidden">
                    {joinedClubs.slice(0, 3).map((club) => (
                      <Avatar key={club.id} className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950">
                        <AvatarImage src={club.image} alt={club.name} className="object-cover" />
                        <AvatarFallback className="text-[9px] bg-sky-500 text-white font-bold">
                          {getInitials(club.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {joinedClubs.length > 3 && (
                      <div className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-slate-950 bg-slate-900 text-[9px] font-bold text-sky-400">
                        +{joinedClubs.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-sky-400/80 font-medium">Clubs joined</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/20 backdrop-blur-xl p-6 hover:border-indigo-500/30 transition-all duration-300 h-44 flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Registered Events</p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">{registeredEvents.length}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex gap-1 items-center">
                    {registeredEvents.slice(0, 3).map((reg, idx) => (
                      <div 
                        key={idx} 
                        title={reg.event.title}
                        className={`h-5 w-8 rounded-sm border ${
                          reg.attendanceConfirmed 
                            ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-400" 
                            : "bg-indigo-500/20 border-indigo-400/30 text-indigo-400"
                        } flex items-center justify-center text-[7px] font-mono font-bold relative overflow-hidden`}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-1.5 h-1.5 rounded-full bg-slate-950/90" />
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-slate-950/90" />
                        Pass
                      </div>
                    ))}
                    {registeredEvents.length > 3 && (
                      <span className="text-[9px] text-muted-foreground ml-1">+{registeredEvents.length - 3}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-indigo-400/80 font-medium">Tickets active</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/20 backdrop-blur-xl p-6 hover:border-emerald-500/30 transition-all duration-300 h-44 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attendance Score</p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">{attendanceScore}%</p>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle
                         cx="28"
                         cy="28"
                         r="22"
                         className="text-white/5"
                         strokeWidth="3.5"
                         stroke="currentColor"
                         fill="transparent"
                      />
                      <circle
                         cx="28"
                         cy="28"
                         r="22"
                         className="text-emerald-400 transition-all duration-1000 ease-out"
                         strokeWidth="3.5"
                         strokeDasharray={2 * Math.PI * 22}
                         strokeDashoffset={2 * Math.PI * 22 * (1 - attendanceScore / 100)}
                         strokeLinecap="round"
                         stroke="currentColor"
                         fill="transparent"
                         style={{ filter: "drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-foreground">{attendanceScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-400/80 font-medium">
                  <span>Semester Standing</span>
                  <span>{attendanceScore >= 75 ? "Excellent" : "Average"}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/20 backdrop-blur-xl p-6 hover:border-pink-500/30 transition-all duration-300 h-44 flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Badges</p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">{badges.length}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {badges.map((badge) => {
                      const styles = getBadgeStyles(badge.id);
                      const BadgeIcon = styles.icon;
                      return (
                        <div 
                          key={badge.id}
                          title={badge.label}
                          className={`rounded-xl bg-gradient-to-br ${styles.bg} p-2 border border-white/10 shadow-glow-soft transition-transform hover:scale-110`}
                        >
                          <BadgeIcon className="h-5 w-5" />
                        </div>
                      );
                    })}
                    {!badges.length && (
                      <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
                        <Award className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-pink-400/80 font-medium">
                  <span>Platform Achievements</span>
                  <span>{badges.length ? "Unlocked" : "Locked"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-8">
              <Card className="border border-white/10 bg-slate-950/20 backdrop-blur-xl rounded-3xl hover:border-sky-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-foreground">Activity Overview</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your current clubs, event registrations, and live participation trail.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Joined Clubs</h3>
                      <span className="text-sm text-muted-foreground">{joinedClubs.length} active</span>
                    </div>
                    {joinedClubs.length ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {joinedClubs.map((club) => (
                          <div key={club.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4 hover:border-sky-500/20 transition-all duration-300">
                            <img
                              src={club.image}
                              alt={club.name}
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground">{club.name}</p>
                              <p className="text-sm text-muted-foreground">{club.category}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                Coordinator: {club.coordinator}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Join a club to start building your campus footprint.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Registered Events</h3>
                      <span className="text-sm text-muted-foreground">{registeredEvents.length} tickets</span>
                    </div>
                    {registeredEvents.length ? (
                      <div className="space-y-4">
                        {registeredEvents.map((registration) => (
                          <div key={registration.ticketCode} className="rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4 hover:border-indigo-500/20 transition-all duration-300">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{registration.event.title}</p>
                                 <p className="text-sm text-muted-foreground">
                                   {formatDate(registration.event.date)} • {registration.event.time} | {registration.event.venue}
                                 </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-300 font-mono">
                                  Ticket {registration.ticketCode}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <Button
                                  variant="outline"
                                  className="rounded-xl border-white/10 bg-slate-950/60 text-foreground hover:bg-slate-900"
                                  onClick={() =>
                                    setActiveTicketId(
                                      activeTicketId === registration.eventId
                                        ? null
                                        : registration.eventId
                                    )
                                  }
                                >
                                  <Ticket className="mr-2 h-4 w-4 text-sky-400" />
                                  View Ticket
                                </Button>
                                {!registration.attendanceConfirmed && (
                                  <Button
                                    className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90"
                                    onClick={() => markEventAttendance(registration.eventId)}
                                  >
                                    Mark Attendance
                                  </Button>
                                )}
                              </div>
                            </div>

                            {activeTicketId === registration.eventId && (
                              <div className="mt-6 flex justify-center animate-fade-in-down">
                                <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
                                  {/* Top Event Header */}
                                  <div className="bg-gradient-to-r from-sky-500/20 to-indigo-500/20 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Ticket className="h-5 w-5 text-sky-400" />
                                      <span className="text-xs uppercase tracking-widest text-sky-300 font-semibold font-mono">
                                        EVENT PASS
                                      </span>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">{registration.ticketCode}</span>
                                  </div>
                                  
                                  {/* Ticket Info */}
                                  <div className="p-6 space-y-6">
                                    <div>
                                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Event Title</span>
                                      <h4 className="text-lg font-bold text-white mt-0.5">{registration.event.title}</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Organizer</span>
                                        <p className="text-sm font-semibold text-white mt-0.5">{registration.event.club}</p>
                                      </div>
                                      <div>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</span>
                                        <p className="text-sm font-semibold text-white mt-0.5">{formatDate(registration.event.date)}</p>
                                      </div>
                                      <div>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</span>
                                        <p className="text-sm font-semibold text-white mt-0.5">{registration.event.time}</p>
                                      </div>
                                      <div>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</span>
                                        <p className="text-sm font-semibold text-white mt-0.5 truncate">{registration.event.venue}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Tear Line Section (Stub separator) */}
                                  <div className="relative flex items-center my-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-950 border-r border-white/10 -ml-3 absolute left-0 z-10" />
                                    <div className="w-full border-t border-dashed border-white/20 mx-4" />
                                    <div className="w-6 h-6 rounded-full bg-slate-950 border-l border-white/10 -mr-3 absolute right-0 z-10" />
                                  </div>

                                  {/* Bottom Section: QR Code & Status */}
                                  <div className="p-6 flex flex-col items-center justify-center bg-slate-950/40">
                                    <div className="bg-white p-3 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
                                      <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${registration.ticketCode}`}
                                        alt="Ticket QR Code"
                                        className="h-32 w-32 object-contain"
                                      />
                                    </div>
                                    <div className="mt-4 text-center">
                                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                                        Scan for Entry Verification
                                      </p>
                                      <div className="mt-2 flex items-center gap-2 justify-center">
                                        <span className={`h-2 w-2 rounded-full ${registration.attendanceConfirmed ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                                        <span className="text-sm font-semibold text-white">
                                          {registration.attendanceConfirmed ? "Attendance Confirmed" : "Awaiting Scan"}
                                        </span>
                                      </div>
                                    </div>

                                    <Button
                                      onClick={() => downloadQRCode(registration.ticketCode, registration.event.title)}
                                      variant="outline"
                                      size="sm"
                                      className="mt-5 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 w-full"
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      Download Ticket QR
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Register for an event and your ticket stack will appear here.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Semester Participation Growth graph card */}
              <Card className="border-white/10 bg-slate-950/40 backdrop-blur-xl rounded-3xl hover:border-sky-500/30 transition-all duration-500 hover:shadow-sky-500/5 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Activity className="h-5 w-5 text-sky-400" />
                      Semester Participation Growth
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Monthly analysis of your engagement and event attendance
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-sky-400/20 bg-sky-500/10 text-sky-300">
                    Active
                  </Badge>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-48 w-full flex items-end mt-4 relative">
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                          <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="47.5" x2="500" y2="47.5" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="102.5" x2="500" y2="102.5" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
                      <path
                        d={chartPath}
                        fill="none"
                        stroke="url(#chartGradient)"
                        strokeWidth="24"
                        opacity="0.15"
                        strokeLinecap="round"
                      />
                      <path
                        d={chartPath}
                        fill="none"
                        stroke="url(#chartGradient)"
                        strokeWidth="8"
                        opacity="0.3"
                        strokeLinecap="round"
                      />
                      <path
                        d={chartPath}
                        fill="none"
                        className="text-sky-400"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))" }}
                      />
                      <path
                        d={`${chartPath} L 450 150 L 50 150 Z`}
                        fill="url(#chartGradient)"
                      />
                      <circle cx="50" cy={yJan} r="4.5" className="fill-sky-400 stroke-slate-950 stroke-[2px]" />
                      <circle cx="150" cy={yFeb} r="4.5" className="fill-sky-300 stroke-slate-950 stroke-[2px]" />
                      <circle cx="250" cy={yMar} r="4.5" className="fill-indigo-400 stroke-slate-950 stroke-[2px]" />
                      <circle cx="350" cy={yApr} r="4.5" className="fill-indigo-300 stroke-slate-950 stroke-[2px]" />
                      <circle cx="450" cy={yMay} r="6" className="fill-emerald-400 stroke-slate-950 stroke-[2px] animate-pulse" />
                    </svg>
                  </div>
                  <div className="mt-4 grid grid-cols-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground font-semibold">Jan</span>
                      <span className="text-xs font-bold text-foreground">{scoreJan}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground font-semibold">Feb</span>
                      <span className="text-xs font-bold text-foreground">{scoreFeb}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground font-semibold">Mar</span>
                      <span className="text-xs font-bold text-foreground">{scoreMar}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground font-semibold">Apr</span>
                      <span className="text-xs font-bold text-foreground">{scoreApr}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 animate-pulse" /> May
                      </span>
                      <span className="text-xs font-bold text-emerald-300">{scoreMay}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile & Account Settings Card */}
              <Card className="border border-white/10 bg-slate-950/20 backdrop-blur-xl rounded-3xl hover:border-sky-500/20 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-foreground">Profile & Account Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Update your account identity, student bio, social details, and interest tags.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Account Identity Settings */}
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-400">Identity Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                        <Input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Full Name"
                          className="border-white/10 bg-slate-950/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Email Address (Login ID)</label>
                        <Input
                          value={emailInput}
                          onChange={(event) => setEmailInput(event.target.value)}
                          placeholder="Email Address"
                          className="border-white/10 bg-slate-950/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-sky-500"
                        />
                        <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-medium">
                          <ShieldAlert className="h-3.5 w-3.5 animate-pulse" /> Updating email changes your future login credential.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Skills & Interests (Tags)</label>
                    <div className="flex flex-wrap gap-2.5">
                      {interestOptions.map((interest) => {
                        const active = interests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                              active
                                ? "border-sky-400 bg-sky-500/20 backdrop-blur-md text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                                : "border-white/10 bg-white/5 backdrop-blur-md text-muted-foreground hover:border-sky-400/30 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <span>{interest}</span>
                            {active && (
                              <X className="h-3 w-3 text-sky-300 hover:text-sky-100 transition-colors" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">About Me</label>
                    <Textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      placeholder="Write a sharp student bio, your role, your goals, or what kind of teams you love working with."
                      rows={5}
                      className="border-white/10 bg-slate-950/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-sky-500"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                      <div className="flex rounded-xl border border-white/10 bg-slate-950/40 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500 overflow-hidden items-center">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/10 bg-white/5 text-muted-foreground text-xs select-none h-10">
                          <Github className="h-4 w-4 text-sky-400" />
                          <span>github.com/</span>
                        </div>
                        <input
                          type="text"
                          value={cleanGithub(socialLinks.github)}
                          onChange={(event) =>
                            setSocialLinks((prev) => ({ ...prev, github: cleanGithub(event.target.value) }))
                          }
                          placeholder="username"
                          className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent px-3 py-2 h-10 text-sm text-foreground placeholder:text-muted-foreground w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                      <div className="flex rounded-xl border border-white/10 bg-slate-950/40 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500 overflow-hidden items-center">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/10 bg-white/5 text-muted-foreground text-xs select-none h-10">
                          <Linkedin className="h-4 w-4 text-sky-400" />
                          <span>linkedin.com/in/</span>
                        </div>
                        <input
                          type="text"
                          value={cleanLinkedin(socialLinks.linkedin)}
                          onChange={(event) =>
                            setSocialLinks((prev) => ({ ...prev, linkedin: cleanLinkedin(event.target.value) }))
                          }
                          placeholder="username"
                          className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent px-3 py-2 h-10 text-sm text-foreground placeholder:text-muted-foreground w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Portfolio</label>
                      <div className="flex rounded-xl border border-white/10 bg-slate-950/40 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500 overflow-hidden items-center">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-r border-white/10 bg-white/5 text-muted-foreground text-xs select-none h-10">
                          <Globe className="h-4 w-4 text-sky-400" />
                          <span>https://</span>
                        </div>
                        <input
                          type="text"
                          value={cleanPortfolio(socialLinks.portfolio)}
                          onChange={(event) =>
                            setSocialLinks((prev) => ({ ...prev, portfolio: cleanPortfolio(event.target.value) }))
                          }
                          placeholder="yourportfolio.com"
                          className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent px-3 py-2 h-10 text-sm text-foreground placeholder:text-muted-foreground w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={saveProfile}
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 shadow-lg shadow-sky-500/20"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Dashboard Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border border-white/10 bg-slate-950/20 backdrop-blur-xl rounded-3xl hover:border-sky-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-foreground">Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-semibold text-foreground">{formatName(user?.name)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="truncate font-semibold text-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {(bio || userProfile?.bio) && (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4">
                      <p className="text-sm text-muted-foreground">Bio</p>
                      <p className="mt-2 text-sm leading-6 text-foreground">{bio || userProfile?.bio}</p>
                    </div>
                  )}

                  <div className="grid gap-3">
                    {socialLinks.github && (
                      <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4 text-foreground hover:border-sky-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Github className="h-5 w-5" />
                          <span>GitHub</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                    {socialLinks.linkedin && (
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4 text-foreground hover:border-sky-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Linkedin className="h-5 w-5" />
                          <span>LinkedIn</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                    {socialLinks.portfolio && (
                      <a
                        href={socialLinks.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4 text-foreground hover:border-sky-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5" />
                          <span>Portfolio</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-white/10 bg-slate-950/20 backdrop-blur-xl rounded-3xl hover:border-amber-500/20 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Achievements & Badges
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Earned from your real activity on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {badges.length ? (
                    <div className="grid gap-4">
                      {badges.map((badge) => {
                        const styles = getBadgeStyles(badge.id);
                        const BadgeIcon = styles.icon;
                        return (
                          <div
                            key={badge.id}
                            className={`rounded-2xl border ${styles.bg} bg-gradient-to-br p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${styles.shadow} flex items-center gap-4`}
                          >
                            <div className="rounded-xl bg-slate-900/60 p-2.5 border border-white/5">
                              <BadgeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm tracking-wide">{badge.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{badge.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Start joining clubs and events to unlock your first badges.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-white/10 bg-slate-950/20 backdrop-blur-xl rounded-3xl hover:border-emerald-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-foreground">Certificates</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Download certificates for events where attendance is confirmed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {certificates.length ? (
                    certificates.map((registration) => (
                      <div key={registration.ticketCode} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4">
                        <div>
                          <p className="font-semibold text-foreground">{registration.event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Issued on {formatDate(registration.certificateIssuedAt!)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/10 bg-slate-950/60 text-foreground hover:bg-slate-900"
                          onClick={() =>
                            downloadCertificate(
                              registration.event.title,
                              registration.certificateIssuedAt!
                            )
                          }
                        >
                          <Download className="mr-2 h-4 w-4 text-emerald-400" />
                          Download
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Certificates will appear here after you confirm attendance on registered events.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-white/10 bg-slate-950/20 backdrop-blur-xl rounded-3xl hover:border-pink-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-foreground">Suggested For You</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Matched using your selected interests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendedClubs.length ? (
                    recommendedClubs.map((club) => (
                      <Link
                        key={club.id}
                        to={`/clubs?category=${encodeURIComponent(club.category)}`}
                        className="block rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md p-4 transition hover:border-sky-400/40"
                      >
                        <p className="font-semibold text-foreground">{club.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {club.category} match based on your interest stack
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Add interests above to unlock smarter club suggestions.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
