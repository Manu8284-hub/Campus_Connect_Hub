import Club from "../models/Club.js";
import ClubMembership from "../models/ClubMembership.js";
import { isMongoReady } from "../config/db.js";
import { getNextId, loadLocalDb, saveLocalDb, getNextLocalId, removeMongooseMetadata } from "../utils/helpers.js";

export const getClubs = async (req, res) => {
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      return res.json({ clubs: db.clubs.sort((a, b) => a.id - b.id) });
    }

    const clubs = await Club.find().sort({ id: 1 });
    res.json({ clubs: clubs.map(removeMongooseMetadata) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch clubs", error: error.message });
  }
};

export const createClub = async (req, res) => {
  try {
    const { name, description, category, coordinator, image, featured } = req.body || {};

    if (!name || !description || !category || !coordinator) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const createdClub = {
        id: getNextLocalId(db.clubs),
        name: String(name).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        members: 0,
        coordinator: String(coordinator).trim(),
        image: image ? String(image).trim() : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
        featured: Boolean(featured),
      };

      db.clubs.push(createdClub);
      await saveLocalDb(db);

      const io = req.app.get("io");
      if (io) {
        io.emit("clubCreated", {
          message: `New Club Created: ${createdClub.name}`,
          club: createdClub
        });
      }

      return res.status(201).json({ message: "Club created", club: createdClub });
    }

    const id = await getNextId(Club);
    const createdClub = new Club({
      id,
      name: String(name).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      members: 0,
      coordinator: String(coordinator).trim(),
      image: image ? String(image).trim() : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      featured: Boolean(featured),
    });

    await createdClub.save();
    const clubData = removeMongooseMetadata(createdClub);

    const io = req.app.get("io");
    if (io) {
      io.emit("clubCreated", {
        message: `New Club Created: ${clubData.name}`,
        club: clubData
      });
    }

    res.status(201).json({ message: "Club created", club: clubData });
  } catch (error) {
    res.status(500).json({ message: "Failed to create club", error: error.message });
  }
};

export const updateClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const clubIndex = db.clubs.findIndex((club) => club.id === clubId);
      if (clubIndex === -1) {
        return res.status(404).json({ message: "Club not found" });
      }

      const updatedClub = {
        ...db.clubs[clubIndex],
        ...Object.fromEntries(
          Object.entries(req.body || {}).filter(([key]) => key !== "id" && key !== "_id")
        ),
      };

      if (Number.isInteger(req.body?.members)) {
        updatedClub.members = req.body.members;
      }

      db.clubs[clubIndex] = updatedClub;
      await saveLocalDb(db);

      const io = req.app.get("io");
      if (io) {
        io.emit("clubUpdated", {
          message: `Club Updated: ${updatedClub.name}`,
          club: updatedClub
        });
      }

      return res.json({ message: "Club updated", club: updatedClub });
    }

    const existingClub = await Club.findOne({ id: clubId });
    if (!existingClub) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    Object.keys(req.body).forEach(key => {
        if(key !== 'id' && key !== '_id') {
            existingClub[key] = req.body[key];
        }
    })
    
    if (Number.isInteger(req.body?.members)) {
        existingClub.members = req.body.members;
    }

    await existingClub.save();
    const clubData = removeMongooseMetadata(existingClub);

    const io = req.app.get("io");
    if (io) {
      io.emit("clubUpdated", {
        message: `Club Updated: ${clubData.name}`,
        club: clubData
      });
    }

    res.json({ message: "Club updated", club: clubData });
  } catch (error) {
    res.status(500).json({ message: "Failed to update club", error: error.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const clubIndex = db.clubs.findIndex((club) => club.id === clubId);
      if (clubIndex === -1) {
        return res.status(404).json({ message: "Club not found" });
      }

      const [removedClub] = db.clubs.splice(clubIndex, 1);
      await saveLocalDb(db);

      const io = req.app.get("io");
      if (io) {
        io.emit("clubDeleted", {
          message: `Club Deleted: ${removedClub.name}`,
          id: clubId
        });
      }

      return res.json({ message: "Club deleted", club: removedClub });
    }

    const removedClub = await Club.findOneAndDelete({ id: clubId });

    if (!removedClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("clubDeleted", {
        message: `Club Deleted: ${removedClub.name}`,
        id: clubId
      });
    }

    res.json({ message: "Club deleted", club: removeMongooseMetadata(removedClub) });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete club", error: error.message });
  }
};

export const joinClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const club = db.clubs.find((entry) => entry.id === clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }

      club.members += 1;
      await saveLocalDb(db);
      return res.json({ message: "Club member count updated", club });
    }

    const club = await Club.findOne({ id: clubId });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    club.members += 1;
    await club.save();
    res.json({ message: "Club member count updated", club: removeMongooseMetadata(club) });
  } catch (error) {
    res.status(500).json({ message: "Failed to join club", error: error.message });
  }
};

export const submitClubApplication = async (req, res) => {
  try {
    const clubId = Number(req.params.id);
    const { name, email, rollNumber, reason, clubName } = req.body;

    if (!name || !email || !rollNumber || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      if (!db.memberships) db.memberships = [];
      
      const newMembership = {
        id: getNextLocalId(db.memberships),
        clubId,
        clubName,
        userName: name,
        userEmail: email,
        rollNumber,
        reason,
        status: "approved"
      };
      
      db.memberships.push(newMembership);
      
      const clubIndex = db.clubs.findIndex(c => c.id === clubId);
      if (clubIndex !== -1) {
        db.clubs[clubIndex].members = (db.clubs[clubIndex].members || 0) + 1;
      }
      
      await saveLocalDb(db);
      return res.status(201).json({ message: "Application submitted and joined successfully", membership: newMembership });
    }

    const membershipId = await getNextId(ClubMembership);
    const newMembership = new ClubMembership({
      id: membershipId,
      clubId,
      clubName,
      userName: name,
      userEmail: email,
      rollNumber,
      reason,
      status: "approved"
    });

    await newMembership.save();

    // Also increment club member count
    const club = await Club.findOne({ id: clubId });
    if (club) {
      club.members += 1;
      await club.save();
    }

    res.status(201).json({ message: "Application submitted and joined successfully", membership: removeMongooseMetadata(newMembership) });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
};
