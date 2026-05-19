export type Club = {
  id: string;
  name: string;
  category: 'technical' | 'arts' | 'sports' | 'social';
  members: number;
  description: string;
  image: string;
  color: string;
  tagline: string;
  founded?: number;
  awards?: number;
};

export type EventItem = {
  id: string;
  title: string;
  club: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  capacity: number;
  registered: number;
  image: string;
  description: string;
  isPast?: boolean;
};

export const clubs: Club[] = [
  { id: 'c1', name: 'Neon Coders', category: 'technical', members: 842, description: 'A community of hackers, builders and AI tinkerers shipping side projects every week.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-blue to-neon-purple', tagline: 'Code. Ship. Repeat.', founded: 2018, awards: 7 },
  { id: 'c2', name: 'Pixel Artists', category: 'arts', members: 421, description: 'Digital art, illustration, animation and creative coding collective.', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-pink to-neon-purple', tagline: 'Where pixels meet poetry.', founded: 2019, awards: 4 },
  { id: 'c3', name: 'Velocity Athletics', category: 'sports', members: 1203, description: 'Elite training, intramural leagues and weekend tournaments across all sports.', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-blue to-neon-cyan', tagline: 'Faster, stronger, together.', founded: 2017, awards: 11 },
  { id: 'c4', name: 'Echo Society', category: 'social', members: 678, description: 'Mixers, mentorship and meaningful conversations to build lifelong networks.', image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-purple to-neon-pink', tagline: 'Connections that compound.', founded: 2020, awards: 3 },
  { id: 'c5', name: 'Quantum Robotics', category: 'technical', members: 312, description: 'Building autonomous machines for international robotics competitions.', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-cyan to-neon-blue', tagline: 'Engineering the future.', founded: 2018, awards: 9 },
  { id: 'c6', name: 'Lumen Theatre', category: 'arts', members: 198, description: 'Original plays, improv nights and immersive theatrical experiences.', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-pink to-neon-blue', tagline: 'The stage is alive.', founded: 2016, awards: 5 },
  { id: 'c7', name: 'Apex Esports', category: 'sports', members: 956, description: 'Competitive gaming, streaming, and tournament organization.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-purple to-neon-cyan', tagline: 'Game on, level up.', founded: 2021, awards: 6 },
  { id: 'c8', name: 'Helix Bio Lab', category: 'technical', members: 264, description: 'Synthetic biology, bioinformatics and biotech entrepreneurship.', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80', color: 'from-neon-cyan to-neon-pink', tagline: 'Life, reimagined.', founded: 2019, awards: 2 },
];

export const events: EventItem[] = [
  { id: 'e1', title: 'HackOverflow 2026', club: 'Neon Coders', date: 'May 14, 2026', time: '09:00', venue: 'Innovation Hub', category: 'technical', capacity: 500, registered: 412, image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80', description: '36-hour flagship hackathon with prizes, mentors, and unlimited cold brew.' },
  { id: 'e2', title: 'Neon Nights Gallery', club: 'Pixel Artists', date: 'May 19, 2026', time: '19:00', venue: 'Arts Pavilion', category: 'arts', capacity: 200, registered: 187, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', description: 'An immersive after-dark exhibition featuring student artists.' },
  { id: 'e3', title: 'Inter-College Sprint', club: 'Velocity Athletics', date: 'May 22, 2026', time: '06:30', venue: 'Olympic Track', category: 'sports', capacity: 300, registered: 124, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80', description: 'Annual track meet against partner colleges.' },
  { id: 'e4', title: 'Founders Mixer', club: 'Echo Society', date: 'May 25, 2026', time: '18:30', venue: 'Skyline Lounge', category: 'social', capacity: 150, registered: 142, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', description: 'A curated networking evening with alumni founders.' },
  { id: 'e5', title: 'Robotics Open House', club: 'Quantum Robotics', date: 'May 18, 2026', time: '14:00', venue: 'Engineering Atrium', category: 'technical', capacity: 250, registered: 78, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', description: 'See competition bots in action and tour the workshop.' },
  { id: 'e6', title: 'Improv Marathon', club: 'Lumen Theatre', date: 'Apr 24, 2026', time: '20:00', venue: 'Black Box Theatre', category: 'arts', capacity: 120, registered: 120, image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80', description: 'Six hours of long-form improv from rotating troupes.', isPast: true },
  { id: 'e7', title: 'Apex Invitational', club: 'Apex Esports', date: 'Apr 12, 2026', time: '12:00', venue: 'Esports Arena', category: 'sports', capacity: 400, registered: 400, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80', description: 'Regional tournament across major titles.', isPast: true },
  { id: 'e8', title: 'BioHack Symposium', club: 'Helix Bio Lab', date: 'Jun 02, 2026', time: '10:00', venue: 'Life Sciences Hall', category: 'technical', capacity: 180, registered: 56, image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80', description: 'Talks on CRISPR, AI-driven drug discovery, and a hands-on workshop.' },
];
