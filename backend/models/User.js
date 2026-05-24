import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "credentials" },
  picture: { type: String, default: "" },
  bio: { type: String, default: "" },
  interests: { type: [String], default: [] },
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
  },
  joinedClubIds: { type: [Number], default: [] },
  eventRegistrations: [{
    eventId: { type: Number, required: true },
    ticketCode: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    attendanceConfirmed: { type: Boolean, default: false },
    certificateIssuedAt: { type: Date }
  }],
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);

