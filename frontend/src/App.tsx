// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { AppProvider } from "./context/AppContext";
// import { AuthProvider } from "./context/AuthContext";
// import AdminDashboard from "./pages/AdminDashboard";
// import Clubs from "./pages/Clubs";
// import CreateAccount from "./pages/CreateAccount";
// import EventRegistration from "./pages/EventRegistration";
// import Events from "./pages/Events";
// import Home from "./pages/Home";
// import JoinClub from "./pages/JoinClub";
// import Login from "./pages/Login";
// import Logout from "./pages/Logout";
// import NotFound from "./pages/NotFound";
// import Profile from "./pages/Profile";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <AppProvider>
//         <TooltipProvider>
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/" element={<Home />} />
//               <Route path="/clubs" element={<Clubs />} />
//               <Route path="/clubs/:id/join" element={<JoinClub />} />
//               <Route path="/events" element={<Events />} />
//               <Route
//                 path="/events/:id/register"
//                 element={<EventRegistration />}
//               />
//               <Route path="/login" element={<Login />} />
//               <Route path="/create-account" element={<CreateAccount />} />
//               <Route path="/logout" element={<Logout />} />
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/admin"
//                 element={
//                   <ProtectedRoute>
//                     <AdminDashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </BrowserRouter>
//         </TooltipProvider>
//       </AppProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotificationHandler from "./components/NotificationHandler";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import Clubs from "./pages/Clubs";
import CreateAccount from "./pages/CreateAccount";
import EventRegistration from "./pages/EventRegistration";
import Events from "./pages/Events";
import Home from "./pages/Home";
import JoinClub from "./pages/JoinClub";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

import { useAuth } from "./context/AuthContext";

const DashboardRouter = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <Profile />;
};

// Global Query Client for data fetching
const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <AppProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <NotificationHandler />
                <BrowserRouter>
                  <ScrollToTop />
                  <Navbar />
                  <Routes>
                    {/* Main Landing Page */}
                    <Route path="/" element={<Home />} />

                    <Route path="/home" element={<Navigate to="/" replace />} />

                    {/* Public Routes */}
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/clubs/:id/join" element={<JoinClub />} />
                    <Route path="/events" element={<Events />} />
                    <Route
                      path="/events/:id/register"
                      element={<EventRegistration />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected Routes */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <DashboardRouter />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardRouter />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={<Navigate to="/dashboard" replace />}
                    />

                    {/* 404 Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </AppProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
