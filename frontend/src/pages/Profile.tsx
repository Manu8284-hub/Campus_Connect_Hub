import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarClock,
  Download,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Save,
  ShieldCheck,
  Ticket,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
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
  if (!name) return "Campus User";

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

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Profile = () => {
  const { user, isAdmin } = useAuth();
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

  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    portfolio: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);

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

  const saveProfile = () => {
    updateUserProfile({
      bio,
      interests,
      socialLinks,
    });
    toast({
      title: "Profile updated",
      description: "Your dashboard details are now saved for this account.",
    });
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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      <main className="relative px-4 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/4 top-8 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl space-y-8">
          <Card className="border-border bg-card/40 backdrop-blur-2xl shadow-2xl rounded-3xl">
            <CardHeader className="border-b border-border pb-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-5">
                  <Avatar className="h-24 w-24 ring-4 ring-sky-500/20">
                    <AvatarImage src={user?.picture} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-600 text-2xl font-bold text-white">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle className="text-3xl font-bold text-foreground">
                      {formatName(user?.name)}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                      Your student dashboard and activity center
                    </CardDescription>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
                        <BadgeCheck className="h-4 w-4" />
                        {isAdmin ? "Admin Account" : "Student Account"}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                        <Trophy className="h-4 w-4" />
                        {badges.length} Badge{badges.length === 1 ? "" : "s"} earned
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/">
                    <Button variant="outline" className="w-full rounded-xl border-border bg-card/60 text-foreground hover:bg-secondary sm:w-auto">
                      Back to Home
                    </Button>
                  </Link>
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

            <CardContent className="grid gap-6 p-6 md:grid-cols-4 md:p-8">
              <div className="rounded-2xl border border-border bg-card/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Clubs</p>
                    <p className="font-semibold text-foreground">{joinedClubs.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registered Events</p>
                    <p className="font-semibold text-foreground">{registeredEvents.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance Score</p>
                    <p className="font-semibold text-foreground">{attendanceScore}%</p>
                  </div>
                </div>
                <Progress value={attendanceScore} className="h-2 bg-white/10" />
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Badges</p>
                    <p className="font-semibold text-foreground">{badges.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-8">
              <Card className="border-border bg-card/40 backdrop-blur-2xl rounded-3xl">
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
                          <div key={club.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-4">
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
                          <div key={registration.ticketCode} className="rounded-2xl border border-border bg-card/50 p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{registration.event.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(registration.event.date)} at {registration.event.venue}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-300">
                                  Ticket {registration.ticketCode}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <Button
                                  variant="outline"
                                  className="rounded-xl border-border bg-background/40 text-foreground hover:bg-card"
                                  onClick={() =>
                                    setActiveTicketId(
                                      activeTicketId === registration.eventId
                                        ? null
                                        : registration.eventId
                                    )
                                  }
                                >
                                  <Ticket className="mr-2 h-4 w-4" />
                                  View Ticket
                                </Button>
                                {!registration.attendanceConfirmed && (
                                  <Button
                                    className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600"
                                    onClick={() => markEventAttendance(registration.eventId)}
                                  >
                                    Mark Attendance
                                  </Button>
                                )}
                              </div>
                            </div>

                            {activeTicketId === registration.eventId && (
                              <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Event Club</p>
                                    <p className="mt-1 font-medium text-foreground">{registration.event.club}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Registration Date</p>
                                    <p className="mt-1 font-medium text-foreground">{formatDate(registration.registeredAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Time</p>
                                    <p className="mt-1 font-medium text-foreground">{registration.event.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Attendance</p>
                                    <p className="mt-1 font-medium text-foreground">
                                      {registration.attendanceConfirmed ? "Confirmed" : "Awaiting check-in"}
                                    </p>
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

              <Card className="border-border bg-card/40 backdrop-blur-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-foreground">Skills & Interests</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your interest tags power the recommendation engine on Home.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {interestOptions.map((interest) => {
                      const active = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active
                              ? "border-sky-400 bg-sky-500/15 text-sky-300"
                              : "border-border bg-card/60 text-muted-foreground hover:border-sky-400/50"
                            }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">About Me</label>
                    <Textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      placeholder="Write a sharp student bio, your role, your goals, or what kind of teams you love working with."
                      rows={5}
                      className="border-border bg-card/60 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                      <Input
                        value={socialLinks.github}
                        onChange={(event) =>
                          setSocialLinks((prev) => ({ ...prev, github: event.target.value }))
                        }
                        placeholder="https://github.com/username"
                        className="border-border bg-card/60 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(event) =>
                          setSocialLinks((prev) => ({ ...prev, linkedin: event.target.value }))
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="border-border bg-card/60 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Portfolio</label>
                      <Input
                        value={socialLinks.portfolio}
                        onChange={(event) =>
                          setSocialLinks((prev) => ({ ...prev, portfolio: event.target.value }))
                        }
                        placeholder="https://yourportfolio.com"
                        className="border-border bg-card/60 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={saveProfile}
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Dashboard Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-border bg-card/40 backdrop-blur-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-foreground">Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card/50 p-4">
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

                  <div className="rounded-2xl border border-border bg-card/50 p-4">
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
                    <div className="rounded-2xl border border-border bg-card/50 p-4">
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
                        className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4 text-foreground"
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
                        className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4 text-foreground"
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
                        className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4 text-foreground"
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

              <Card className="border-border bg-card/40 backdrop-blur-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-foreground">Achievements & Badges</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Earned from your real activity on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {badges.length ? (
                    badges.map((badge) => (
                      <div key={badge.id} className="rounded-2xl border border-border bg-card/50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                            <Trophy className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{badge.label}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Start joining clubs and events to unlock your first badges.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card/40 backdrop-blur-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-foreground">Certificates</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Download certificates for events where attendance is confirmed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {certificates.length ? (
                    certificates.map((registration) => (
                      <div key={registration.ticketCode} className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4">
                        <div>
                          <p className="font-semibold text-foreground">{registration.event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Issued on {formatDate(registration.certificateIssuedAt!)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-border bg-background/40 text-foreground"
                          onClick={() =>
                            downloadCertificate(
                              registration.event.title,
                              registration.certificateIssuedAt!
                            )
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
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

              <Card className="border-border bg-card/40 backdrop-blur-2xl rounded-3xl">
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
                        className="block rounded-2xl border border-border bg-card/50 p-4 transition hover:border-sky-400/40"
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
