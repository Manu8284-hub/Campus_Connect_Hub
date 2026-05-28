# 🚀 CAMpus-CONnect

CAMpus-CONnect (formerly ClubHub) is a premium, full-stack student engagement platform designed to bridge the gap between students, clubs, and campus events. Built with a modern tech stack, the platform has been redesigned around a stark, high-contrast, minimalist **monochromatic black-and-white theme** with custom interactive animations, trailing cursors, and real-time database statistics.

---

## ✨ Key Highlights

- **🎯 Stark Monochrome Aesthetic**: Sleek black-and-white theme built with a pure HSL color utility design system. High contrast, clean outlines, and beautiful typography.
- **🖥️ Pure CSS Hero Mockup**: Replaced traditional static media with a floating, pure CSS interactive system dashboard showing real-time statistics (active clubs, upcoming events) synced directly to the database.
- **✨ Custom Coordinated Cursor**: Dynamic dual-layer pointer (central solid tracking dot + outer trailing ring) that expands on hover when hovering over buttons, cards, and interactive elements.
- **🎭 Background Ticker & Typewriter Reveal**:
  - The footer background features 12 themed words floating randomly across coordinate bounds using non-linear easing animations.
  - A giant background watermark of `CAMpus-CONnect` is automatically printed letter-by-letter using a staggered typewriter reveal starting after a 3-second delay.
- **🛡️ Secure Access**: Integrated Google Sign-In and secure JWT-based authentication with HttpOnly cookies.
- **📡 Real-time Sync**: Instant event notifications and updates powered by Socket.io.
- **📊 Admin Dashboard**: Comprehensive command center to manage events, registrations, and club configurations.
- **👤 Student Hub**: Personalized workspace to join clubs, track attendance scores, and earn gamified badges.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla HSL CSS Tokens
- **Components**: Shadcn UI & Radix UI
- **Real-time**: Socket.io Client
- **Animations**: CSS Keyframes & Easing Animations
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Primary) & Prisma Client
- **Real-time**: Socket.io
- **Security**: JWT, Bcrypt Hashing, Cookie-Parser

---

## 🚀 Main Features

### 🔐 Advanced Security & Identity
- **JWT & HttpOnly Cookies**: Secure session management protecting against XSS and CSRF.
- **Bcrypt Hashing**: Secure password encryption for credential-based logins.
- **Session Persistence**: Initial session verification on load to keep users logged in securely.
- **Role-based access control**: Distinct dashboards for Admins and Students.

### 🏛️ Club & Event Management
- **Real-time Notifications**: Instant toast notifications for new or updated events via Socket.io.
- **Discovery**: Advanced search and category-based filtering for clubs and events.
- **Participation**: One-click club joining and event registration.
- **Admin Tools**: Full CRUD (Create, Read, Update, Delete) for events with auto-sync to the database.
- **Status Tracking**: Intelligent event status management (Upcoming, Ongoing, Completed).

### 📈 Gamification & Rewards
- **Badge System**: Unlock achievements based on campus activity.
- **Attendance Tracking**: Real-time attendance scoring.
- **Certificates**: Generate and download participation certificates for completed events.

---

## ⚙️ Environment Setup

Create a `.env` file in the **backend** directory:

```env
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Create a `.env` file in the **frontend** directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🛠️ Installation & Usage

1. **Install Dependencies**:
   ```bash
   # Backend directory
   cd backend
   npm install

   # Frontend directory
   cd frontend
   npm install
   ```

2. **Run Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🗺️ Project Structure

- `/` — Dynamic Landing Page with Floating Dashboard Mockup
- `/clubs` — Interactive Club Explorer
- `/events` — Campus Events Calendar
- `/dashboard` — Personal Student Activity Hub
- `/admin` — Protected Administrator Dashboard
- `/login` & `/create-account` — Onboarding Flow

---

## 🚀 Roadmap & Future Improvements

- [x] **Secure Session Management**: JWT tokens and HttpOnly cookies implemented.
- [x] **Real-time Notifications**: Socket.io integration complete.
- [x] **Minimalist Design System**: Stark monochrome light theme complete.
- [x] **Interactive Footer Animations**: Floating background words and delayed typewriter watermark.
- [ ] **PDF Certificates**: High-quality PDF generation for event participation.
- [ ] **Enhanced Analytics**: Advanced data visualization for admin reporting.

---

*Developed BY CHILL GUYS......*
