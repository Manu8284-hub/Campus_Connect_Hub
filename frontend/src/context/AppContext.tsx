import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Club, clubs as initialClubs } from "@/data/clubsData";
import { Event, events as initialEvents } from "@/data/eventsData";
import { apiUrl, parseApiError } from "@/lib/api";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
}

interface EventRegistrationRecord {
  eventId: number;
  ticketCode: string;
  registeredAt: string;
  attendanceConfirmed: boolean;
  certificateIssuedAt?: string;
}

export interface UserActivityProfile {
  email: string;
  displayName: string;
  bio: string;
  interests: string[];
  socialLinks: SocialLinks;
  joinedClubIds: number[];
  eventRegistrations: EventRegistrationRecord[];
}

export interface RegisteredEventActivity extends EventRegistrationRecord {
  event: Event;
}

interface AppContextType {
  clubs: Club[];
  events: Event[];
  userProfile: UserActivityProfile | null;
  joinedClubs: Club[];
  registeredEvents: RegisteredEventActivity[];
  attendanceScore: number;
  recommendedClubs: Club[];
  addClub: (club: Club) => Promise<void>;
  updateClub: (club: Club) => Promise<void>;
  deleteClub: (clubId: number) => Promise<void>;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;
  registerForEvent: (eventId: number) => Promise<void>;
  joinClub: (clubId: number) => Promise<void>;
  leaveClub: (clubId: number) => Promise<void>;
  submitClubApplication: (clubId: number, formData: any) => Promise<void>;
  updateUserProfile: (updates: Partial<UserActivityProfile>) => void;
  markEventAttendance: (eventId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const PROFILE_STORAGE_KEY = "campus-connect-user-profiles";

const getNextId = (items: { id: number }[]) => {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
};

const getStoredProfiles = () => {
  if (typeof window === "undefined") {
    return {} as Record<string, UserActivityProfile>;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return {} as Record<string, UserActivityProfile>;
    }

    return JSON.parse(raw) as Record<string, UserActivityProfile>;
  } catch {
    return {} as Record<string, UserActivityProfile>;
  }
};

const createDefaultProfile = (
  email: string,
  displayName?: string,
): UserActivityProfile => ({
  email,
  displayName: displayName || "Campus User",
  bio: "",
  interests: [],
  socialLinks: {
    github: "",
    linkedin: "",
    portfolio: "",
  },
  joinedClubIds: [],
  eventRegistrations: [],
});

const createTicketCode = (eventId: number) =>
  `CCH-${eventId}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const normalizeProfile = (
  profile: Partial<UserActivityProfile> & { name?: string },
): UserActivityProfile => ({
  email: profile.email || "",
  displayName: profile.displayName || profile.name || "Campus User",
  bio: profile.bio || "",
  interests: Array.isArray(profile.interests) ? profile.interests : [],
  socialLinks: {
    github: profile.socialLinks?.github || "",
    linkedin: profile.socialLinks?.linkedin || "",
    portfolio: profile.socialLinks?.portfolio || "",
  },
  joinedClubIds: Array.isArray(profile.joinedClubIds)
    ? profile.joinedClubIds
    : [],
  eventRegistrations: Array.isArray(profile.eventRegistrations)
    ? profile.eventRegistrations
    : [],
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [profilesByEmail, setProfilesByEmail] = useState<
    Record<string, UserActivityProfile>
  >({});
  const { user } = useAuth();

  const currentEmail = user?.email?.trim().toLowerCase() || "";
  const userProfile = currentEmail
    ? profilesByEmail[currentEmail] || null
    : null;

  const joinedClubs = useMemo(() => {
    return (userProfile?.joinedClubIds || [])
      .map((clubId) => clubs.find((club) => club.id === clubId))
      .filter((club): club is Club => Boolean(club));
  }, [userProfile?.joinedClubIds, clubs]);

  const registeredEvents = useMemo(() => {
    return (userProfile?.eventRegistrations || [])
      .map((registration) => {
        const event = events.find((entry) => entry.id === registration.eventId);
        return event ? { ...registration, event } : null;
      })
      .filter((registration): registration is RegisteredEventActivity =>
        Boolean(registration),
      );
  }, [userProfile?.eventRegistrations, events]);

  const attendanceScore = useMemo(() => {
    return registeredEvents.length
      ? Math.round(
          (registeredEvents.filter(
            (registration) => registration.attendanceConfirmed,
          ).length /
            registeredEvents.length) *
            100,
        )
      : 0;
  }, [registeredEvents]);

  const recommendedClubs = useMemo(() => {
    return clubs
      .filter(
        (club) => !joinedClubs.some((joinedClub) => joinedClub.id === club.id),
      )
      .map((club) => {
        const interestMatches = (userProfile?.interests || []).filter(
          (interest) => {
            const normalizedInterest = interest.toLowerCase();
            return (
              club.category.toLowerCase().includes(normalizedInterest) ||
              club.name.toLowerCase().includes(normalizedInterest) ||
              club.description.toLowerCase().includes(normalizedInterest)
            );
          },
        ).length;

        return { club, score: interestMatches + (club.featured ? 1 : 0) };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.club);
  }, [clubs, joinedClubs, userProfile?.interests]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(apiUrl("/api/clubs"), {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.clubs) && data.clubs.length > 0) {
          setClubs(data.clubs);
        }
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(apiUrl("/api/events"), {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    void fetchClubs();
    void fetchEvents();
  }, []);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleEventCreated = (data: { event: Event }) => {
      setEvents((prev) => {
        if (prev.some((e) => e.id === data.event.id)) return prev;
        return [data.event, ...prev];
      });
    };

    const handleEventUpdated = (data: { event: Event }) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === data.event.id ? data.event : e)),
      );
    };

    const handleEventDeleted = (data: { id: number }) => {
      setEvents((prev) => prev.filter((e) => e.id !== data.id));
    };

    const handleClubCreated = (data: { club: Club }) => {
      setClubs((prev) => {
        if (prev.some((c) => c.id === data.club.id)) return prev;
        return [...prev, data.club];
      });
    };

    const handleClubUpdated = (data: { club: Club }) => {
      setClubs((prev) =>
        prev.map((c) => (c.id === data.club.id ? data.club : c)),
      );
    };

    const handleClubDeleted = (data: { id: number }) => {
      setClubs((prev) => prev.filter((c) => c.id !== data.id));
    };

    socket.on("eventCreated", handleEventCreated);
    socket.on("eventUpdated", handleEventUpdated);
    socket.on("eventDeleted", handleEventDeleted);
    socket.on("clubCreated", handleClubCreated);
    socket.on("clubUpdated", handleClubUpdated);
    socket.on("clubDeleted", handleClubDeleted);

    return () => {
      socket.off("eventCreated", handleEventCreated);
      socket.off("eventUpdated", handleEventUpdated);
      socket.off("eventDeleted", handleEventDeleted);
      socket.off("clubCreated", handleClubCreated);
      socket.off("clubUpdated", handleClubUpdated);
      socket.off("clubDeleted", handleClubDeleted);
    };
  }, [socket]);

  useEffect(() => {
    if (!currentEmail) {
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(apiUrl(`/auth/profile/${currentEmail}`), {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setProfilesByEmail((prev) => ({
              ...prev,
              [currentEmail]: normalizeProfile(data.profile),
            }));
          }
        } else {
          setProfilesByEmail((prev) => ({
            ...prev,
            [currentEmail]: createDefaultProfile(currentEmail, user?.name),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [currentEmail, user?.name]);

  const updateCurrentProfile = async (
    updater: (profile: UserActivityProfile) => UserActivityProfile,
  ) => {
    if (!currentEmail) {
      return;
    }

    const baseProfile = normalizeProfile(
      profilesByEmail[currentEmail] ||
        createDefaultProfile(currentEmail, user?.name),
    );
    const updatedProfile = normalizeProfile(updater(baseProfile));

    setProfilesByEmail((prev) => ({
      ...prev,
      [currentEmail]: updatedProfile,
    }));

    try {
      await fetch(apiUrl(`/auth/profile/${currentEmail}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
      });
    } catch (error) {
      console.error("Failed to sync profile with backend:", error);
    }
  };

  const addClub = async (club: Club) => {
    const response = await fetch(apiUrl("/api/clubs"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(club),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      throw new Error("Club creation failed");
    }

    setClubs((prev) => [...prev, payload.club as Club]);
  };

  const updateClub = async (updatedClub: Club) => {
    const response = await fetch(apiUrl(`/api/clubs/${updatedClub.id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedClub),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { club?: Club };
    if (!payload.club) {
      throw new Error("Club update failed");
    }

    setClubs((prev) =>
      prev.map((club) => (club.id === payload.club!.id ? payload.club! : club)),
    );
  };

  const deleteClub = async (clubId: number) => {
    const response = await fetch(apiUrl(`/api/clubs/${clubId}`), {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    setClubs((prev) => prev.filter((club) => club.id !== clubId));
  };

  const addEvent = async (event: Event) => {
    const response = await fetch(apiUrl("/api/events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { event?: Event };
    if (!payload.event) {
      throw new Error("Event creation failed");
    }

    setEvents((prev) => [...prev, payload.event as Event]);
  };

  const updateEvent = async (updatedEvent: Event) => {
    const response = await fetch(apiUrl(`/api/events/${updatedEvent.id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { event?: Event };
    if (!payload.event) {
      throw new Error("Event update failed");
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === payload.event!.id ? payload.event! : event,
      ),
    );
  };

  const deleteEvent = async (eventId: number) => {
    const response = await fetch(apiUrl(`/api/events/${eventId}`), {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const joinClub = async (clubId: number) => {
    if (!currentEmail) return;
    try {
      const response = await fetch(apiUrl("/auth/join-club"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: currentEmail, clubId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfilesByEmail((prev) => ({
            ...prev,
            [currentEmail]: normalizeProfile(data.profile),
          }));
        }
      }
    } catch (err) {
      console.error("Failed to join club:", err);
    }
  };

  const leaveClub = async (clubId: number) => {
    if (!currentEmail) return;
    try {
      const response = await fetch(apiUrl("/auth/leave-club"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: currentEmail, clubId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfilesByEmail((prev) => ({
            ...prev,
            [currentEmail]: normalizeProfile(data.profile),
          }));
        }
      }
    } catch (err) {
      console.error("Failed to leave club:", err);
    }
  };

  const submitClubApplication = async (clubId: number, formData: any) => {
    try {
      const response = await fetch(apiUrl(`/api/clubs/${clubId}/apply`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          clubName: clubs.find((c) => c.id === clubId)?.name,
        }),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      await joinClub(clubId);
    } catch (err) {
      console.error("Failed to submit application:", err);
      throw err;
    }
  };

  const registerForEvent = async (eventId: number) => {
    const existingRegistration = (userProfile?.eventRegistrations || []).some(
      (registration) => registration.eventId === eventId,
    );
    if (existingRegistration) {
      throw new Error("You are already registered for this event.");
    }

    const eventToRegister = events.find((e) => e.id === eventId);
    if (
      !eventToRegister ||
      eventToRegister.currentParticipants >= eventToRegister.maxParticipants
    ) {
      throw new Error("Event is full or not found.");
    }

    const updatedEvent = {
      ...eventToRegister,
      currentParticipants: eventToRegister.currentParticipants + 1,
    };

    await updateEvent(updatedEvent);

    updateCurrentProfile((profile) => ({
      ...profile,
      eventRegistrations: [
        {
          eventId,
          ticketCode: createTicketCode(eventId),
          registeredAt: new Date().toISOString(),
          attendanceConfirmed: false,
        },
        ...profile.eventRegistrations,
      ],
    }));
  };

  const updateUserProfile = (updates: Partial<UserActivityProfile>) => {
    updateCurrentProfile((profile) => ({
      ...profile,
      ...updates,
      displayName: updates.displayName ?? profile.displayName,
      bio: updates.bio ?? profile.bio,
      interests: updates.interests ?? profile.interests,
      joinedClubIds: updates.joinedClubIds ?? profile.joinedClubIds,
      eventRegistrations:
        updates.eventRegistrations ?? profile.eventRegistrations,
      socialLinks: {
        ...profile.socialLinks,
        ...updates.socialLinks,
      },
    }));
  };

  const markEventAttendance = (eventId: number) => {
    updateCurrentProfile((profile) => ({
      ...profile,
      eventRegistrations: (profile.eventRegistrations || []).map(
        (registration) =>
          registration.eventId === eventId
            ? {
                ...registration,
                attendanceConfirmed: true,
                certificateIssuedAt:
                  registration.certificateIssuedAt || new Date().toISOString(),
              }
            : registration,
      ),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        clubs,
        events,
        userProfile,
        joinedClubs,
        registeredEvents,
        attendanceScore,
        recommendedClubs,
        addClub,
        updateClub,
        deleteClub,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        joinClub,
        leaveClub,
        submitClubApplication,
        updateUserProfile,
        markEventAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
