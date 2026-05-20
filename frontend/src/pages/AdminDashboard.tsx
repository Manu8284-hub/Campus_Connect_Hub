import { FormEvent, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Club } from "@/data/clubsData";
import { Event } from "@/data/eventsData";
import { Users, Calendar, TrendingUp, Plus, Settings, History, User, X, ShieldCheck, LayoutDashboard, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiUrl } from "@/lib/api";
import PageHeader from "@/components/PageHeader";

const AdminDashboard = () => {
  const { clubs, events, addClub, updateClub, deleteClub, addEvent, updateEvent, deleteEvent } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [logins, setLogins] = useState<any[]>([]);
  const [isLoadingLogins, setIsLoadingLogins] = useState(false);

  useEffect(() => {
    if (activeTab === "logins") {
      fetchLogins();
    }
  }, [activeTab]);

  const fetchLogins = async () => {
    setIsLoadingLogins(true);
    try {
      const response = await fetch(apiUrl("/auth/logins"), {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setLogins(data.logins || []);
      }
    } catch (error) {
      console.error("Failed to fetch logins:", error);
    } finally {
      setIsLoadingLogins(false);
    }
  };


  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

  const handleSendAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both the title and message of the announcement.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingAnnouncement(true);
    try {
      const response = await fetch(apiUrl("/api/events/announce"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: announcementForm.title.trim(),
          message: announcementForm.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send announcement");
      }

      toast({
        title: "Announcement Sent!",
        description: "Your notification has been broadcast to all users.",
      });

      setAnnouncementForm({ title: "", message: "" });
    } catch (error) {
      toast({
        title: "Broadcast failed",
        description: error instanceof Error ? error.message : "Unable to send announcement.",
        variant: "destructive",
      });
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  const [clubForm, setClubForm] = useState({
    name: "",
    description: "",
    category: "",
    coordinator: "",
    image: "",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    club: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: "",
    image: "",
    status: "upcoming",
  });

  const totalMembers = clubs.reduce((sum, club) => sum + club.members, 0);
  const openEvents = events.filter(e => e.registrationOpen && e.status !== "completed").length;

  const resetClubForm = () => {
    setClubForm({
      name: "",
      description: "",
      category: "",
      coordinator: "",
      image: "",
    });
    setEditingClubId(null);
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      club: "",
      category: "",
      date: "",
      time: "",
      venue: "",
      maxParticipants: "",
      image: "",
      status: "upcoming",
    });
    setEditingEventId(null);
  };

  const handleCreateClub = async (e: FormEvent) => {
    e.preventDefault();

    if (!clubForm.name.trim() || !clubForm.description.trim() || !clubForm.category || !clubForm.coordinator.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required club details before creating the club.",
        variant: "destructive",
      });
      return;
    }

    const sanitizedClub = {
      name: clubForm.name.trim(),
      description: clubForm.description.trim(),
      category: clubForm.category,
      coordinator: clubForm.coordinator.trim(),
      image: clubForm.image.trim() || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    };

    if (editingClubId !== null) {
      const existingClub = clubs.find(club => club.id === editingClubId);
      if (!existingClub) {
        toast({
          title: "Club not found",
          description: "Unable to update this club. Please try again.",
          variant: "destructive",
        });
        return;
      }

      try {
        await updateClub({
          ...existingClub,
          ...sanitizedClub,
        });

        toast({
          title: "Club Updated!",
          description: `${sanitizedClub.name} has been successfully updated.`,
        });
        resetClubForm();
      } catch (error) {
        toast({
          title: "Update failed",
          description: error instanceof Error ? error.message : "Unable to update club.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      await addClub({
        id: 0,
        name: sanitizedClub.name,
        description: sanitizedClub.description,
        category: sanitizedClub.category,
        members: 0,
        coordinator: sanitizedClub.coordinator,
        image: sanitizedClub.image,
      });
      toast({
        title: "Club Created!",
        description: `${sanitizedClub.name} has been successfully created.`,
      });
      resetClubForm();
    } catch (error) {
      toast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Unable to create club.",
        variant: "destructive",
      });
    }
  };

  const handleEditClub = (club: Club) => {
    setEditingClubId(club.id);
    setClubForm({
      name: club.name,
      description: club.description,
      category: club.category,
      coordinator: club.coordinator,
      image: club.image,
    });
  };

  const handleDeleteClub = async (club: Club) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${club.name}?`);
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteClub(club.id);

      if (editingClubId === club.id) {
        resetClubForm();
      }

      toast({
        title: "Club Deleted",
        description: `${club.name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete club.",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault();

    const maxParticipants = Number(eventForm.maxParticipants);

    if (
      !eventForm.title.trim() ||
      !eventForm.description.trim() ||
      !eventForm.club ||
      !eventForm.category ||
      !eventForm.date ||
      !eventForm.time.trim() ||
      !eventForm.venue.trim() ||
      !Number.isInteger(maxParticipants) ||
      maxParticipants < 1
    ) {
      toast({
        title: "Missing or invalid fields",
        description: "Please complete all required event details with a valid max participants value.",
        variant: "destructive",
      });
      return;
    }

    const sanitizedEvent = {
      title: eventForm.title.trim(),
      description: eventForm.description.trim(),
      club: eventForm.club,
      category: eventForm.category,
      date: eventForm.date,
      time: eventForm.time.trim(),
      venue: eventForm.venue.trim(),
      maxParticipants,
      image: eventForm.image.trim() || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      status: eventForm.status as "upcoming" | "ongoing" | "completed",
      registrationOpen: eventForm.status !== "completed",
    };

    if (editingEventId !== null) {
      const existingEvent = events.find(event => event.id === editingEventId);
      if (!existingEvent) {
        toast({
          title: "Event not found",
          description: "Unable to update this event. Please try again.",
          variant: "destructive",
        });
        return;
      }

      try {
        await updateEvent({
          ...existingEvent,
          ...sanitizedEvent,
        });

        toast({
          title: "Event Updated!",
          description: `${sanitizedEvent.title} has been successfully updated.`,
        });
        resetEventForm();
      } catch (error) {
        toast({
          title: "Update failed",
          description: error instanceof Error ? error.message : "Unable to update event.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      await addEvent({
        id: 0,
        title: sanitizedEvent.title,
        description: sanitizedEvent.description,
        club: sanitizedEvent.club,
        category: sanitizedEvent.category,
        date: sanitizedEvent.date,
        time: sanitizedEvent.time,
        venue: sanitizedEvent.venue,
        registrationOpen: true,
        currentParticipants: 0,
        maxParticipants: sanitizedEvent.maxParticipants,
        image: sanitizedEvent.image,
        status: sanitizedEvent.status,
      });
      toast({
        title: "Event Created!",
        description: `${sanitizedEvent.title} has been successfully created.`,
      });
      resetEventForm();
    } catch (error) {
      toast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Unable to create event.",
        variant: "destructive",
      });
    }
  };


  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      club: event.club,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      maxParticipants: String(event.maxParticipants),
      image: event.image,
      status: event.status || "upcoming",
    });
  };

  const handleDeleteEvent = async (event: Event) => {
    const isConfirmed = window.confirm(`Are you sure you want to cancel ${event.title}?`);
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteEvent(event.id);

      if (editingEventId === event.id) {
        resetEventForm();
      }

      toast({
        title: "Event Deleted",
        description: `${event.title} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete event.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <PageHeader 
        title="Admin Dashboard" 
        description="Manage clubs, events, and members across the entire Campus Connect platform."
        icon={LayoutDashboard}
        variant="indigo"
      />

      <div className="container mx-auto px-4 py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clubs">Manage Clubs</TabsTrigger>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="announcements">Send Announcement</TabsTrigger>
            <TabsTrigger value="logins">Login History</TabsTrigger>
          </TabsList>


          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clubs.length}</div>
                  <p className="text-xs text-muted-foreground">Active clubs on campus</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMembers}</div>
                  <p className="text-xs text-muted-foreground">Students participating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{openEvents}</div>
                  <p className="text-xs text-muted-foreground">Currently accepting registrations</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New member joined Coding Club", time: "2 hours ago" },
                    { action: "HackFest 2024 registration opened", time: "5 hours ago" },
                    { action: "Drama Society event completed", time: "1 day ago" },
                    { action: "Photography Club created new album", time: "2 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <p className="text-sm">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clubs Management Tab */}
          <TabsContent value="clubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingClubId !== null ? "Edit Club" : "Create New Club"}
                </CardTitle>
                <CardDescription>
                  {editingClubId !== null ? "Update selected club details" : "Add a new club to the system"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateClub} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clubName">Club Name *</Label>
                    <Input
                      id="clubName"
                      required
                      value={clubForm.name}
                      onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                      placeholder="Enter club name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubDescription">Description *</Label>
                    <Textarea
                      id="clubDescription"
                      required
                      value={clubForm.description}
                      onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                      placeholder="Enter club description"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clubCategory">Category *</Label>
                      <Select
                        value={clubForm.category}
                        onValueChange={(value) => setClubForm({ ...clubForm, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Academic">Academic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clubCoordinator">Coordinator *</Label>
                      <Input
                        id="clubCoordinator"
                        required
                        value={clubForm.coordinator}
                        onChange={(e) => setClubForm({ ...clubForm, coordinator: e.target.value })}
                        placeholder="Coordinator name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubImage">Image URL (Optional)</Label>
                    <Input
                      id="clubImage"
                      value={clubForm.image}
                      onChange={(e) => setClubForm({ ...clubForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button type="submit" className="w-full">
                      {editingClubId !== null ? "Update Club" : "Create Club"}
                    </Button>
                    {editingClubId !== null && (
                      <Button type="button" variant="outline" className="w-full" onClick={resetClubForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Clubs</CardTitle>
                <CardDescription>Manage and edit clubs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...clubs].slice(-5).reverse().map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="font-medium">{club.name}</p>
                        <p className="text-sm text-muted-foreground">{club.members} members</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" type="button" onClick={() => handleEditClub(club)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" type="button" onClick={() => handleDeleteClub(club)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Management Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingEventId !== null ? "Edit Event" : "Create New Event"}
                </CardTitle>
                <CardDescription>
                  {editingEventId !== null ? "Update selected event details" : "Schedule a new event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTitle">Event Title *</Label>
                    <Input
                      id="eventTitle"
                      required
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDescription">Description *</Label>
                    <Textarea
                      id="eventDescription"
                      required
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventClub">Organizing Club *</Label>
                      <Select
                        value={eventForm.club}
                        onValueChange={(value) => setEventForm({ ...eventForm, club: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select club" />
                        </SelectTrigger>
                        <SelectContent>
                          {clubs.map((club) => (
                            <SelectItem key={club.id} value={club.name}>
                              {club.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventCategory">Category *</Label>
                      <Select
                        value={eventForm.category}
                        onValueChange={(value) => setEventForm({ ...eventForm, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Competition">Competition</SelectItem>
                          <SelectItem value="Seminar">Seminar</SelectItem>
                          <SelectItem value="Cultural">Cultural</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventTime">Time *</Label>
                      <Input
                        id="eventTime"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        placeholder="e.g., 2:00 PM - 5:00 PM"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventVenue">Venue *</Label>
                      <Input
                        id="eventVenue"
                        required
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventMaxParticipants">Max Participants *</Label>
                      <Input
                        id="eventMaxParticipants"
                        type="number"
                        required
                        min="1"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm({ ...eventForm, maxParticipants: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventImage">Image URL (Optional)</Label>
                    <Input
                      id="eventImage"
                      value={eventForm.image}
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventStatus">Event Status *</Label>
                    <Select
                      value={eventForm.status}
                      onValueChange={(value) => setEventForm({ ...eventForm, status: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button type="submit" className="w-full">
                      {editingEventId !== null ? "Update Event" : "Create Event"}
                    </Button>
                    {editingEventId !== null && (
                      <Button type="button" variant="outline" className="w-full" onClick={resetEventForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...events].slice(-5).reverse().map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:bg-secondary/30 transition-all gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-lg">{event.title}</p>
                          <Badge variant="outline" className={`
                            ${event.status === 'completed' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 
                              event.status === 'ongoing' ? 'bg-green-500/10 text-green-400 border-green-500/20 animate-pulse' : 
                              'bg-primary/10 text-primary border-primary/20'}
                           uppercase text-[10px] tracking-wider font-bold`}>
                            {event.status || 'upcoming'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.club}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Select
                          value={event.status || 'upcoming'}
                          onValueChange={async (value) => {
                            try {
                              const updatedStatus = value as "upcoming" | "ongoing" | "completed";
                              await updateEvent({ 
                                ...event, 
                                status: updatedStatus,
                                registrationOpen: updatedStatus === "completed" ? false : event.registrationOpen
                              });
                              toast({ title: "Status Updated", description: `${event.title} is now ${value}.` });
                            } catch (error) {
                              toast({
                                title: "Update failed",
                                description: "Failed to update event status.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="w-[130px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEditEvent(event)} className="h-9 w-9">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteEvent(event)} className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Announcement Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card className="border-purple-500/20 bg-slate-900/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Bell className="w-5 h-5 text-purple-400 animate-pulse" />
                  Broadcast Live Announcement
                </CardTitle>
                <CardDescription>
                  Send a push notification in real-time to all connected users on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendAnnouncement} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="announceTitle">Announcement Title *</Label>
                    <Input
                      id="announceTitle"
                      required
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      placeholder="e.g. Server Maintenance or New Coding Contest!"
                      className="border-purple-500/20 focus-visible:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announceMessage">Message Content *</Label>
                    <Textarea
                      id="announceMessage"
                      required
                      value={announcementForm.message}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                      placeholder="Type the message you want to broadcast..."
                      rows={5}
                      className="border-purple-500/20 focus-visible:ring-purple-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-600/25 h-11"
                    disabled={isSendingAnnouncement}
                  >
                    {isSendingAnnouncement ? "Broadcasting..." : "Send Real-Time Notification"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Login History Tab */}
          <TabsContent value="logins" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      User Login History
                    </CardTitle>
                    <CardDescription>
                      Monitor recent authentication activity across the platform
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchLogins}
                    disabled={isLoadingLogins}
                  >
                    {isLoadingLogins ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-semibold">User</th>
                          <th className="px-6 py-4 font-semibold">Provider</th>
                          <th className="px-6 py-4 font-semibold">Date</th>
                          <th className="px-6 py-4 font-semibold">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {logins.length > 0 ? (
                          logins.map((login) => (
                            <tr key={login.id} className="hover:bg-white/5 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">{login.user?.name || "Unknown"}</p>
                                    <p className="text-xs text-slate-500">{login.user?.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  login.provider === 'google' 
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                }`}>
                                  {login.provider}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-300">
                                {new Date(login.at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-300">
                                {new Date(login.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                              {isLoadingLogins ? "Loading login records..." : "No login records found."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


      <Footer />
    </div>
  );
};

export default AdminDashboard;
