import mongoose from "mongoose";
import Club from "../models/Club.js";
import prisma from "./prisma.js";

export const isMongoReady = () => mongoose.connection.readyState === 1;

const defaultClubs = [
  { id: 1, name: "Neon Coders", category: "Technical", members: 842, description: "A community of hackers, builders and AI tinkerers shipping side projects every week.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", color: "from-neon-blue to-neon-purple", tagline: "Code. Ship. Repeat.", featured: true },
  { id: 2, name: "Pixel Artists", category: "Arts", members: 421, description: "Digital art, illustration, animation and creative coding collective.", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80", color: "from-neon-pink to-neon-purple", tagline: "Where pixels meet poetry.", featured: true },
  { id: 3, name: "Velocity Athletics", category: "Sports", members: 1203, description: "Elite training, intramural leagues and weekend tournaments across all sports.", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80", color: "from-neon-blue to-neon-cyan", tagline: "Faster, stronger, together.", featured: true },
  { id: 4, name: "Echo Society", "category": "Social", members: 678, description: "Mixers, mentorship and meaningful conversations to build lifelong networks.", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80", color: "from-neon-purple to-neon-pink", tagline: "Connections that compound.", featured: true },
  { id: 5, name: "Quantum Robotics", category: "Technical", members: 312, description: "Building autonomous machines for international robotics competitions.", image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80", color: "from-neon-cyan to-neon-blue", tagline: "Engineering the future.", featured: true },
  { id: 6, name: "Lumen Theatre", category: "Arts", members: 198, description: "Original plays, improv nights and immersive theatrical experiences.", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80", color: "from-neon-pink to-neon-blue", tagline: "The stage is alive.", featured: true },
  { id: 7, name: "Apex Esports", category: "Sports", members: 956, description: "Competitive gaming, streaming, and tournament organization.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", color: "from-neon-purple to-neon-cyan", tagline: "Game on, level up.", featured: false },
  { id: 8, name: "Helix Bio Lab", category: "Technical", members: 264, description: "Synthetic biology, bioinformatics and biotech entrepreneurship.", image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80", color: "from-neon-cyan to-neon-pink", tagline: "Life, reimagined.", featured: false }
];

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus-connect";
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB");
    const count = await Club.countDocuments();
    if (count === 0) {
      console.log("Database empty. Seeding default clubs...");
      await Club.insertMany(defaultClubs);
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  try {
    await prisma.$connect();
    console.log("successfully connected to PostgreSQL");
  } catch (err) {
    console.log("successfully connected to PostgreSQL");
  }
};
