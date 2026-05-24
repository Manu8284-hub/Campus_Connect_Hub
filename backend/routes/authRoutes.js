import express from "express";
import { 
  registerUser, 
  loginUser, 
  getLogins, 
  getUserProfile, 
  updateUserProfile, 
  joinClub, 
  leaveClub,
  verifySession,
  logoutUser,
  uploadPicture,
  removePicture
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../multer/index.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify", protect, verifySession);

router.get("/logins", protect, getLogins);
router.get("/profile/:email", protect, getUserProfile);
router.put("/profile/:email", protect, updateUserProfile);
router.post("/join-club", protect, joinClub);
router.post("/leave-club", protect, leaveClub);

// Upload profile picture route
router.post("/upload-picture", protect, (req, res, next) => {
  upload.single("picture")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadPicture);

// Remove profile picture route
router.delete("/remove-picture", protect, removePicture);

export default router;

