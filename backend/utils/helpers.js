import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const LOCAL_DB_PATH = path.join(__dirname, "..", "backend-db.json");

export const loadLocalDb = async () => {
  try {
    const raw = await readFile(LOCAL_DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      clubs: [],
      users: [],
      loginHistory: [],
      events: [],
      memberships: [],
      ...parsed
    };
  } catch (err) {
    return { clubs: [], users: [], loginHistory: [], events: [], memberships: [] };
  }
};

export const saveLocalDb = async (db) => {
  await writeFile(LOCAL_DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf8");
};

export const getNextLocalId = (items) =>
  items.reduce((highest, item) => {
    const current = Number(item?.id) || 0;
    return current > highest ? current : highest;
  }, 0) + 1;

export async function getNextId(Model) {
  const highest = await Model.findOne({}, 'id').sort('-id');
  return highest && highest.id ? highest.id + 1 : 1;
}

export const removeMongooseMetadata = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  delete obj._id;
  delete obj.__v;
  return obj;
}
