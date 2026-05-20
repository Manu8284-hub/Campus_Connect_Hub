import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import { isMongoReady } from "../config/db.js";
import { getNextId, loadLocalDb, saveLocalDb, getNextLocalId, removeMongooseMetadata } from "../utils/helpers.js";
import { generateToken, clearToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

const DISABLED_DEMO_EMAIL = "admin@campusconnect.demo";
const DISABLED_DEMO_PASSWORD = "admin123";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    console.log(`Registration attempt for: ${email}`);

    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword = typeof password === "string" ? password.trim() : "";

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!isMongoReady()) {
      console.log("MongoDB not ready, using local DB for registration");
      const db = await loadLocalDb();
      const existingUser = db.users.find((user) => user.email === normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(normalizedPassword, salt);

      const createdUser = {
        id: getNextLocalId(db.users),
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        provider: "credentials",
        createdAt: new Date().toISOString(),
      };

      db.users.push(createdUser);
      await saveLocalDb(db);

      generateToken(res, createdUser.id);

      return res.status(201).json({
        message: "Account created successfully",
        user: { name: createdUser.name, email: createdUser.email, id: createdUser.id },
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log(`Registration failed: ${email} already exists`);
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const id = await getNextId(User);
    const createdUser = new User({
      id,
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      provider: "credentials"
    });
    
    await createdUser.save();
    console.log(`User registered in MongoDB: ${email}`);

    generateToken(res, createdUser.id);

    res.status(201).json({
      message: "Account created successfully",
      user: { name: createdUser.name, email: createdUser.email, id: createdUser.id },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, name, provider } = req.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedProvider = provider === "google" ? "google" : "credentials";

    console.log(`Login attempt: ${normalizedEmail} via ${normalizedProvider}`);

    // EMERGENCY FALLBACK FOR DEMO
    if (normalizedProvider === "credentials" && normalizedEmail === "admin@gmail.com" && password === "admin@123") {
      console.log("Emergency fallback triggered for admin user");
      
      let adminUser;
      if (!isMongoReady()) {
        const db = await loadLocalDb();
        adminUser = db.users.find(u => u.email === normalizedEmail);
        if (!adminUser) {
          adminUser = {
            id: 9999,
            name: "Admin User",
            email: "admin@gmail.com",
            password: "", // Handled by emergency fallback
            provider: "credentials",
            createdAt: new Date().toISOString()
          };
          db.users.push(adminUser);
          await saveLocalDb(db);
        }
      } else {
        adminUser = await User.findOne({ email: normalizedEmail });
        if (!adminUser) {
           const id = await getNextId(User);
           adminUser = new User({
             id,
             name: "Admin User",
             email: "admin@gmail.com",
             password: "bypass",
             provider: "credentials"
           });
           await adminUser.save();
        }
      }
      
      generateToken(res, adminUser.id);
      const userDetail = { name: adminUser.name, email: adminUser.email, id: adminUser.id };

      if (!isMongoReady()) {
        const db = await loadLocalDb();
        db.loginHistory.unshift({
          id: getNextLocalId(db.loginHistory),
          user: { name: userDetail.name, email: userDetail.email },
          provider: normalizedProvider,
          at: new Date().toISOString(),
        });
        await saveLocalDb(db);
      } else {
        const historyId = await getNextId(LoginHistory);
        await new LoginHistory({
          id: historyId,
          user: { name: userDetail.name, email: userDetail.email },
          provider: normalizedProvider
        }).save();
      }

      return res.json({ 
        message: "Login successful (Admin)", 
        user: userDetail
      });
    }

    if (!isMongoReady()) {
      console.log("MongoDB not ready, using local DB for login");
      const db = await loadLocalDb();

      if (normalizedProvider === "credentials") {
        const foundUser = db.users.find((user) => user.email === normalizedEmail);
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
          console.log(`Login failed for ${normalizedEmail}: Invalid credentials`);
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const userDetail = { name: foundUser.name, email: foundUser.email, id: foundUser.id };
        generateToken(res, foundUser.id);

        db.loginHistory.unshift({
          id: getNextLocalId(db.loginHistory),
          user: { name: userDetail.name, email: userDetail.email },
          provider: normalizedProvider,
          at: new Date().toISOString(),
        });
        await saveLocalDb(db);

        return res.json({ message: "Login successful", user: userDetail });
      }

      let existingGoogleUser = db.users.find((user) => user.email === normalizedEmail);
      if (!existingGoogleUser) {
        const safeName = typeof name === "string" ? name.trim() : "Google User";
        existingGoogleUser = {
          id: getNextLocalId(db.users),
          name: safeName,
          email: normalizedEmail,
          password: "",
          provider: "google",
          createdAt: new Date().toISOString(),
        };
        db.users.push(existingGoogleUser);
        await saveLocalDb(db);
      }

      generateToken(res, existingGoogleUser.id);
      const userDetail = { name: existingGoogleUser.name, email: existingGoogleUser.email, id: existingGoogleUser.id };
      return res.json({ message: "Login successful", user: userDetail });
    }

    if (normalizedProvider === "credentials") {
      const foundUser = await User.findOne({ email: normalizedEmail });
      if (!foundUser) {
        console.log(`Login failed: User ${normalizedEmail} not found`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await foundUser.matchPassword(password);
      if (!isMatch) {
        console.log(`Login failed for ${normalizedEmail}: Password mismatch`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const userDetail = { name: foundUser.name, email: foundUser.email, id: foundUser.id };
      generateToken(res, foundUser.id);

      const historyId = await getNextId(LoginHistory);
      await new LoginHistory({
        id: historyId,
        user: { name: foundUser.name, email: foundUser.email },
        provider: normalizedProvider
      }).save();

      console.log(`Login successful: ${normalizedEmail}`);
      return res.json({ message: "Login successful", user: userDetail });
    }

    if (normalizedProvider === "google") {
      if (!normalizedEmail || !name) {
        return res.status(400).json({ message: "Google login requires email and name" });
      }

      let existingGoogleUser = await User.findOne({ email: normalizedEmail });
      if (!existingGoogleUser) {
        console.log(`Creating new Google user: ${normalizedEmail}`);
        const id = await getNextId(User);
        const safeName = typeof name === "string" ? name.trim() : "Google User";
        existingGoogleUser = new User({
          id,
          name: safeName,
          email: normalizedEmail,
          password: "",
          provider: "google"
        });
        await existingGoogleUser.save();
      }

      generateToken(res, existingGoogleUser.id);
      const userDetail = { name: existingGoogleUser.name, email: existingGoogleUser.email, id: existingGoogleUser.id };
      
      const historyId = await getNextId(LoginHistory);
      await new LoginHistory({
        id: historyId,
        user: { name: userDetail.name, email: userDetail.email },
        provider: normalizedProvider
      }).save();

      console.log(`Google login successful: ${normalizedEmail}`);
      return res.json({ message: "Login successful", user: userDetail });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};



export const logoutUser = (req, res) => {
  clearToken(res);
  res.status(200).json({ message: "Logged out successfully" });
};

export const verifySession = async (req, res) => {
  try {
    if (req.user) {
      res.json({ user: removeMongooseMetadata(req.user) });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Session verification failed", error: error.message });
  }
};

export const getLogins = async (req, res) => {
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      return res.json({ logins: db.loginHistory });
    }

    const logins = await LoginHistory.find().sort({ at: -1 });
    res.json({ logins: logins.map(removeMongooseMetadata) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logins", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { email } = req.params;
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const user = db.users.find(u => u.email === email);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ profile: removeMongooseMetadata(user) });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ profile: removeMongooseMetadata(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email } = req.params;
  const updates = req.body;
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const userIndex = db.users.findIndex(u => u.email === email);
      if (userIndex === -1) return res.status(404).json({ message: "User not found" });
      
      db.users[userIndex] = { ...db.users[userIndex], ...updates };
      await saveLocalDb(db);
      return res.json({ profile: removeMongooseMetadata(db.users[userIndex]) });
    }

    const user = await User.findOneAndUpdate({ email }, { $set: updates }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ profile: removeMongooseMetadata(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinClub = async (req, res) => {
  const { email, clubId } = req.body;
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const userIndex = db.users.findIndex(u => u.email === email);
      if (userIndex === -1) return res.status(404).json({ message: "User not found" });
      
      const user = db.users[userIndex];
      if (!user.joinedClubIds) user.joinedClubIds = [];
      if (!user.joinedClubIds.includes(parseInt(clubId))) {
        user.joinedClubIds.push(parseInt(clubId));
        await saveLocalDb(db);
      }
      return res.json({ profile: removeMongooseMetadata(user) });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { joinedClubIds: parseInt(clubId) } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ profile: removeMongooseMetadata(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const leaveClub = async (req, res) => {
  const { email, clubId } = req.body;
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const userIndex = db.users.findIndex(u => u.email === email);
      if (userIndex === -1) return res.status(404).json({ message: "User not found" });
      
      const user = db.users[userIndex];
      if (user.joinedClubIds) {
        user.joinedClubIds = user.joinedClubIds.filter(id => id !== parseInt(clubId));
        await saveLocalDb(db);
      }
      return res.json({ profile: removeMongooseMetadata(user) });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { joinedClubIds: parseInt(clubId) } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ profile: removeMongooseMetadata(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

