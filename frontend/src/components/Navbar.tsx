// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   GraduationCap,
//   Sun,
//   Moon,
//   ArrowLeftRight,
//   ChevronDown,
//   LogOut,
//   ShieldCheck,
// } from "lucide-react";
// import { Button } from "./ui/button";
// import { useAuth } from "@/context/AuthContext";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isAuthenticated, user, logout, isAdmin } = useAuth();
//   const [isDark, setIsDark] = useState(false);

//   // Read role from local storage. Default to student if not set.
//   const rawRole = typeof window !== "undefined" ? localStorage.getItem("appRole") : null;
//   const appRole = rawRole === "admin" ? "admin" : "student";

//   const handleSwitchRole = () => {
//     localStorage.removeItem("appRole");
//     navigate("/");
//   };

//   const handleLogout = () => {
//     logout();
//     setIsOpen(false);
//     navigate("/login", { replace: true });
//   };

//   useEffect(() => {
//     setIsDark(document.documentElement.classList.contains("dark"));
//   }, []);

//   const toggleTheme = () => {
//     const root = document.documentElement;
//     if (isDark) {
//       root.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setIsDark(false);
//     } else {
//       root.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setIsDark(true);
//     }
//   };

//   const formatName = (name: string) => {
//     return name
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(' ');
//   };

//   const getInitials = (name?: string) => {
//     if (!name) {
//       return "CU";
//     }

//     return name
//       .split(" ")
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((word) => word.charAt(0).toUpperCase())
//       .join("");
//   };

//   const baseNavItems = [
//     { path: "/home", label: "Home" },
//     { path: "/clubs", label: "Clubs" },
//     { path: "/events", label: "Events" },
//     { path: "https://www.chitkara.edu.in/", label: "About", external: true },
//   ];

//   const adminItems = appRole === "admin" ? [
//     { path: "/admin", label: "Admin" },
//     ...(isAuthenticated ? [] : [{ path: "/create-account", label: "Create Account" }])
//   ] : [];

//   const navItems = [
//     ...baseNavItems,
//     ...adminItems,
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="sticky top-0 z-50 bg-secondary/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           <Link to="/home" className="flex items-center gap-2 group">
//             <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-2.5 transition-transform group-hover:scale-110 shadow-lg">
//               <GraduationCap className="w-6 h-6 text-primary-foreground" />
//             </div>
//             <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CampusHub</span>
//           </Link>

//           <div className="flex items-center gap-2 lg:gap-4">
//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-2 lg:gap-4">
//               {navItems.map((item) => (
//                 item.external ? (
//                   <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer">
//                     <Button variant="ghost" className="transition-all font-medium hover:text-primary">
//                       {item.label}
//                     </Button>
//                   </a>
//                 ) : (
//                   <Link key={item.path} to={item.path}>
//                     <Button
//                       variant={isActive(item.path) ? "default" : "ghost"}
//                       className="transition-all font-medium"
//                     >
//                       {item.label}
//                     </Button>
//                   </Link>
//                 )
//               ))}

//               {isAuthenticated ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <button className="group flex h-11 items-center gap-3 rounded-full border border-border/60 bg-background/80 px-2 py-1 text-left shadow-sm transition-all hover:border-primary/40 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
//                       <Avatar className="h-8 w-8 ring-1 ring-border/70">
//                         <AvatarImage src={user?.picture} alt={user?.name || "User"} />
//                         <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
//                           {getInitials(user?.name)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="max-w-[160px] leading-tight">
//                         <p className="truncate text-sm font-semibold text-foreground">
//                           {formatName(user?.name || "Campus User")}
//                         </p>
//                         <p className="truncate text-xs text-muted-foreground">
//                           {user?.email}
//                         </p>
//                       </div>
//                       <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
//                     <DropdownMenuLabel className="px-3 py-2">
//                       <div className="space-y-1">
//                         <p className="text-sm font-semibold text-foreground">
//                           {formatName(user?.name || "Campus User")}
//                         </p>
//                         <p className="text-xs font-normal text-muted-foreground">
//                           {user?.email}
//                         </p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     {isAdmin && (
//                       <DropdownMenuItem
//                         className="rounded-xl px-3 py-2"
//                         onClick={() => navigate("/admin")}
//                       >
//                         <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
//                         Dashboard
//                       </DropdownMenuItem>
//                     )}
//                     <DropdownMenuItem
//                       className="rounded-xl px-3 py-2 text-destructive focus:text-destructive"
//                       onClick={handleLogout}
//                     >
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link to="/login">
//                   <Button
//                     variant={isActive("/login") ? "default" : "ghost"}
//                     className="transition-all font-medium"
//                   >
//                     Login
//                   </Button>
//                 </Link>
//               )}
//             </div>


//             {/* Theme Toggle Button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               aria-label="Toggle theme"
//               className="rounded-full"
//             >
//               {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </Button>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors hover:bg-secondary/80"
//               onClick={() => setIsOpen(!isOpen)}
//               aria-label="Toggle menu"
//             >
//               {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2 border-t border-border/40">
//             {navItems.map((item) => (
//               item.external ? (
//                 <a key={item.path} href={item.path} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">
//                   <Button variant="ghost" className="w-full justify-start font-medium hover:text-primary transition-all">
//                     {item.label}
//                   </Button>
//                 </a>
//               ) : (
//                 <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
//                   <Button
//                     variant={isActive(item.path) ? "default" : "ghost"}
//                     className="w-full justify-start font-medium transition-all"
//                   >
//                     {item.label}
//                   </Button>
//                 </Link>
//               )
//             ))}

//             {isAuthenticated ? (
//               <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-10 w-10 ring-1 ring-border/70">
//                     <AvatarImage src={user?.picture} alt={user?.name || "User"} />
//                     <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
//                       {getInitials(user?.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold text-foreground">
//                       {formatName(user?.name || "Campus User")}
//                     </p>
//                     <p className="truncate text-xs text-muted-foreground">
//                       {user?.email}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-3 space-y-2">
//                   {isAdmin && (
//                     <Button
//                       variant="ghost"
//                       onClick={() => {
//                         setIsOpen(false);
//                         navigate("/admin");
//                       }}
//                       className="w-full justify-start font-medium transition-all"
//                     >
//                       <ShieldCheck className="mr-2 h-4 w-4" />
//                       Dashboard
//                     </Button>
//                   )}
//                   <Button
//                     variant="ghost"
//                     onClick={handleLogout}
//                     className="w-full justify-start font-medium text-destructive transition-all hover:text-destructive"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Logout
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <Link to="/login" onClick={() => setIsOpen(false)}>
//                 <Button
//                   variant={isActive("/login") ? "default" : "ghost"}
//                   className="w-full justify-start font-medium transition-all"
//                 >
//                   Login
//                 </Button>
//               </Link>
//             )}

//             {/* Mobile Switch Role Button */}
//             <Button
//               variant="outline"
//               onClick={handleSwitchRole}
//               className="w-full justify-start font-medium transition-all mt-2 border-border"
//             >
//               <ArrowLeftRight className="mr-2 h-4 w-4" />
//               Switch Role
//             </Button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  GraduationCap,
  Sun,
  Moon,
  ArrowLeftRight,
  ChevronDown,
  LogOut,
  ShieldCheck,
  User,
  Bell,
  Compass,
  LayoutDashboard,
  CalendarClock,
} from "lucide-react";

import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { theme, setTheme, isDark } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { clubs, events } = useAppContext();

  const rawRole =
    typeof window !== "undefined"
      ? localStorage.getItem("appRole")
      : null;

  const appRole = rawRole === "admin" ? "admin" : "student";

  // ------------------------
  // Utility Functions
  // ------------------------
  const formatName = (name?: string) => {
    if (!name) return "Campus User";

    return name
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const getInitials = (name?: string) => {
    if (!name) return "CU";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  const isActive = (path: string) => location.pathname === path;
  const clubCategories = [...new Set(clubs.map((club) => club.category))].slice(0, 6);
  
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    if (notif.actionPath) {
      navigate(notif.actionPath);
    }
    setIsOpen(false);
  };

  // ------------------------
  // Handlers
  // ------------------------
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsLogoutDialogOpen(false);
    navigate("/login", { replace: true });
  };

  const handleSwitchRole = () => {
    localStorage.removeItem("appRole");
    navigate("/");
  };

  const handleExploreCategory = (category: string) => {
    navigate(`/clubs?category=${encodeURIComponent(category)}`);
    setIsOpen(false);
  };

  // ------------------------
  // Navigation Items
  // ------------------------
  const baseNavItems = [
    ...(isAuthenticated ? [{ path: "/dashboard", label: "Dashboard" }] : []),
    { path: "/", label: "Home" },
    { path: "/clubs", label: "Clubs" },
    { path: "/events", label: "Events" },
    {
      path: "/about",
      label: "About",
    },
  ];

  const navItems = baseNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="container mx-auto mt-4 px-2 sm:px-4 pointer-events-auto">
        <nav className="glass-strong rounded-full px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <span className="relative grid place-items-center w-10 h-10 rounded-xl gradient-bg shadow-glow-soft transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight">
              Campus<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2"
                >
                  <Compass className="h-4 w-4" />
                  Explore
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="px-3 py-2">
                  Categories
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {clubCategories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    className="rounded-xl cursor-pointer"
                    onClick={() => handleExploreCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* User Section */}
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:border-primary/40 hover:shadow-md transition-all">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <>
                          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount}
                          </span>
                        </>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
                    <DropdownMenuLabel className="px-3 py-2 flex justify-between items-center">
                      <span>Notifications</span>
                      {notifications.length > 0 && (
                        <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">Clear All</button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">No new notifications</div>
                    ) : (
                      notifications.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          className={`cursor-pointer rounded-xl px-3 py-3 ${!item.read ? 'bg-primary/5' : ''}`}
                          onClick={() => handleNotificationClick(item)}
                        >
                          <div className="space-y-1">
                            <p className={`text-sm ${!item.read ? 'font-bold' : 'font-semibold'} text-foreground`}>
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarImage
                          src={user?.picture}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary text-white font-semibold">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-left max-w-[180px]">
                        <p className="text-sm font-semibold truncate">
                          {formatName(user?.name)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Logged In
                        </p>
                      </div>

                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-72 rounded-2xl p-2"
                  >
                    <DropdownMenuLabel className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user?.picture}
                            alt={user?.name || "User"}
                          />
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {formatName(user?.name)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="rounded-xl cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/events")}
                      className="rounded-xl cursor-pointer"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Upcoming Events
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => setIsLogoutDialogOpen(true)}
                      className="rounded-xl cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2">
                  Login
                </Link>
                <Link to="/create-account" className="neon-button text-sm py-2 px-5">
                  Get Started
                </Link>
              </div>
            )}



            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2 animate-in slide-in-from-top-2">
            <div className="rounded-2xl border p-3">
              <p className="mb-3 text-sm font-semibold">Explore Categories</p>
              <div className="flex flex-wrap gap-2">
                {clubCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleExploreCategory(category)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            )}

            {isAuthenticated ? (
              <div className="mt-4 rounded-2xl border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.picture} />
                    <AvatarFallback>
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">
                      {formatName(user?.name)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>



                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">Notifications</p>
                    </div>
                    {notifications.length > 0 && (
                      <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-2 text-center text-xs text-muted-foreground">No new notifications</div>
                    ) : (
                      notifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNotificationClick(item)}
                          className={`w-full rounded-xl border border-border/60 ${!item.read ? 'bg-primary/5' : 'bg-background'} px-3 py-2 text-left`}
                        >
                          <p className={`text-sm ${!item.read ? 'font-bold' : 'font-medium'}`}>{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-600"
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full neon-button">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full justify-start mt-2"
              onClick={handleSwitchRole}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Switch Role
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent className="max-w-md rounded-2xl border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout from CampusHub?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out from this session and returned to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Confirm Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;
