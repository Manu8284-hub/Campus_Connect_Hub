import prisma from "../config/prisma.js";
import { loadLocalDb, saveLocalDb, getNextLocalId } from "../utils/helpers.js";

const usePostgres = () => !!process.env.DATABASE_URL;

export const getClubs = async (req, res) => {
  try {
    if (usePostgres()) {
      const clubs = await prisma.club.findMany({ orderBy: { id: 'asc' } });
      return res.json({ clubs });
    }

    const db = await loadLocalDb();
    return res.json({ clubs: db.clubs.sort((a, b) => a.id - b.id) });
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

    if (usePostgres()) {
      const createdClub = await prisma.club.create({
        data: {
          name: String(name).trim(),
          description: String(description).trim(),
          category: String(category).trim(),
          coordinator: String(coordinator).trim(),
          image: image ? String(image).trim() : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
          featured: Boolean(featured),
        }
      });

      const io = req.app.get("io");
      if (io) {
        io.emit("clubCreated", {
          message: `New Club Created: ${createdClub.name}`,
          club: createdClub
        });
      }

      return res.status(201).json({ message: "Club created", club: createdClub });
    }

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
      io.emit("clubCreated", { message: `New Club Created: ${createdClub.name}`, club: createdClub });
    }
    return res.status(201).json({ message: "Club created", club: createdClub });
  } catch (error) {
    res.status(500).json({ message: "Failed to create club", error: error.message });
  }
};

export const updateClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (usePostgres()) {
      const updatedClub = await prisma.club.update({
        where: { id: clubId },
        data: {
          ...Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => key !== "id"))
        }
      });

      const io = req.app.get("io");
      if (io) {
        io.emit("clubUpdated", { message: `Club Updated: ${updatedClub.name}`, club: updatedClub });
      }
      return res.json({ message: "Club updated", club: updatedClub });
    }

    const db = await loadLocalDb();
    const clubIndex = db.clubs.findIndex((club) => club.id === clubId);
    if (clubIndex === -1) return res.status(404).json({ message: "Club not found" });

    const updatedClub = {
      ...db.clubs[clubIndex],
      ...Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => key !== "id" && key !== "_id")),
    };
    if (Number.isInteger(req.body?.members)) updatedClub.members = req.body.members;
    db.clubs[clubIndex] = updatedClub;
    await saveLocalDb(db);

    const io = req.app.get("io");
    if (io) io.emit("clubUpdated", { message: `Club Updated: ${updatedClub.name}`, club: updatedClub });
    return res.json({ message: "Club updated", club: updatedClub });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: "Club not found" });
    res.status(500).json({ message: "Failed to update club", error: error.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (usePostgres()) {
      const removedClub = await prisma.club.delete({ where: { id: clubId } });
      const io = req.app.get("io");
      if (io) io.emit("clubDeleted", { message: `Club Deleted: ${removedClub.name}`, id: clubId });
      return res.json({ message: "Club deleted", club: removedClub });
    }

    const db = await loadLocalDb();
    const clubIndex = db.clubs.findIndex((club) => club.id === clubId);
    if (clubIndex === -1) return res.status(404).json({ message: "Club not found" });

    const [removedClub] = db.clubs.splice(clubIndex, 1);
    await saveLocalDb(db);

    const io = req.app.get("io");
    if (io) io.emit("clubDeleted", { message: `Club Deleted: ${removedClub.name}`, id: clubId });
    return res.json({ message: "Club deleted", club: removedClub });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: "Club not found" });
    res.status(500).json({ message: "Failed to delete club", error: error.message });
  }
};

export const joinClub = async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (usePostgres()) {
      const club = await prisma.club.update({
        where: { id: clubId },
        data: { members: { increment: 1 } }
      });
      return res.json({ message: "Club member count updated", club });
    }

    const db = await loadLocalDb();
    const club = db.clubs.find((entry) => entry.id === clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    club.members += 1;
    await saveLocalDb(db);
    return res.json({ message: "Club member count updated", club });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: "Club not found" });
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

    if (usePostgres()) {
      const newMembership = await prisma.clubMembership.create({
        data: {
          clubId,
          clubName: clubName || "Unknown Club",
          userName: name,
          userEmail: email,
          rollNumber,
          reason,
          status: "approved"
        }
      });

      const club = await prisma.club.update({
        where: { id: clubId },
        data: { members: { increment: 1 } }
      });

      return res.status(201).json({ message: "Application submitted", membership: newMembership });
    }

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
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
};
