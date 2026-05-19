const clubKey = (userId: string) => `CampusHub_joined_clubs_${userId}`;
const eventKey = (userId: string) => `CampusHub_registered_events_${userId}`;

function read(key: string) {
  const raw = localStorage.getItem(key);
  if (!raw) return [] as string[];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getJoinedClubs(userId: string) {
  return read(clubKey(userId));
}

export function joinClubForUser(userId: string, clubId: string) {
  const ids = new Set(read(clubKey(userId)));
  ids.add(clubId);
  write(clubKey(userId), [...ids]);
}

export function leaveClubForUser(userId: string, clubId: string) {
  write(clubKey(userId), read(clubKey(userId)).filter((id) => id !== clubId));
}

export function getRegisteredEvents(userId: string) {
  return read(eventKey(userId));
}

export function registerEventForUser(userId: string, eventId: string) {
  const ids = new Set(read(eventKey(userId)));
  ids.add(eventId);
  write(eventKey(userId), [...ids]);
}

export function cancelEventForUser(userId: string, eventId: string) {
  write(eventKey(userId), read(eventKey(userId)).filter((id) => id !== eventId));
}
