import { isMongoReady } from "../config/db.js";
import Event from "../models/Event.js";
import {
    getNextLocalId,
    loadLocalDb,
    removeMongooseMetadata,
    saveLocalDb,
} from "../utils/helpers.js";

export const getEvents = async (req, res) => {
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      return res.json({
        events: (db.events || []).sort((a, b) => b.id - a.id),
      });
    }

    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ events: events.map(removeMongooseMetadata) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      if (!db.events) db.events = [];

      const newEvent = {
        ...req.body,
        id: getNextLocalId(db.events),
        currentParticipants: 0,
        registrationOpen: true,
      };

      db.events.push(newEvent);
      await saveLocalDb(db);

      const io = req.app.get("io");
      if (io) {
        io.emit("eventCreated", {
          message: `New Event: ${newEvent.title}`,
          event: newEvent,
        });
      }
      return res.status(201).json({ event: newEvent });
    }

    const lastEvent = await Event.findOne().sort({ id: -1 });
    const nextId = lastEvent ? lastEvent.id + 1 : 1;

    const newEvent = new Event({
      ...req.body,
      id: nextId,
    });

    const savedEvent = await newEvent.save();
    const eventData = removeMongooseMetadata(savedEvent);

    // Emit real-time notification
    const io = req.app.get("io");
    if (io) {
      io.emit("eventCreated", {
        message: `New Event: ${eventData.title}`,
        event: eventData,
      });
    }

    res.status(201).json({ event: eventData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create event", error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const eventIndex = db.events.findIndex((e) => e.id === parseInt(id));
      const updatedEvent = {
        ...(eventIndex === -1 ? {} : db.events[eventIndex]),
        ...req.body,
        id: parseInt(id),
      };

      if (eventIndex === -1) {
        db.events.push(updatedEvent);
      } else {
        db.events[eventIndex] = updatedEvent;
      }

      await saveLocalDb(db);

      const io = req.app.get("io");
      if (io) {
        io.emit("eventUpdated", {
          message: `Event Updated: ${updatedEvent.title}`,
          event: updatedEvent,
        });
      }
      return res.json({ event: updatedEvent });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: { ...req.body, id: parseInt(id) } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    const eventData = removeMongooseMetadata(updatedEvent);

    // Emit real-time notification
    const io = req.app.get("io");
    if (io) {
      io.emit("eventUpdated", {
        message: `Event Updated: ${eventData.title}`,
        event: eventData,
      });
    }

    res.json({ event: eventData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update event", error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const eventIndex = db.events.findIndex((e) => e.id === parseInt(id));
      if (eventIndex === -1) {
        return res.status(404).json({ message: "Event not found" });
      }

      const [deletedEvent] = db.events.splice(eventIndex, 1);
      await saveLocalDb(db);

      const io = req.app.get("io");
      if (io) {
        io.emit("eventDeleted", {
          message: `Event Deleted: ${deletedEvent.title}`,
          id: parseInt(id),
        });
      }
      return res.json({ message: "Event deleted successfully" });
    }

    const deletedEvent = await Event.findOneAndDelete({ id: parseInt(id) });
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Emit real-time notification
    const io = req.app.get("io");
    if (io) {
      io.emit("eventDeleted", {
        message: `Event Deleted: ${deletedEvent.title}`,
        id: parseInt(id),
      });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: err.message });
  }
};

export const sendAnnouncement = async (req, res) => {
  const { title, message } = req.body || {};
  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required" });
  }

  const io = req.app.get("io");
  if (io) {
    io.emit("adminAnnouncement", { title, message });
  }

  res.json({ message: "Announcement sent successfully" });
};
