import 'dotenv/config';
import prisma from "./config/prisma.js";
import { loadLocalDb } from "./utils/helpers.js";

async function main() {
  try {
    const db = await loadLocalDb();
    const clubs = db.clubs || [];
    
    console.log(`Found ${clubs.length} clubs in backend-db.json. Seeding into PostgreSQL...`);
    
    // Clear existing clubs in postgres
    await prisma.club.deleteMany({});
    
    // Insert new clubs
    for (const club of clubs) {
      await prisma.club.create({
        data: {
          id: Number(club.id),
          name: club.name,
          description: club.description,
          category: club.category,
          members: Number(club.members) || 0,
          coordinator: club.coordinator,
          image: club.image,
          featured: Boolean(club.featured),
        }
      });
      console.log(`Seeded club: ${club.name}`);
    }
    
    console.log("Successfully seeded past clubs into PostgreSQL database!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

main();
