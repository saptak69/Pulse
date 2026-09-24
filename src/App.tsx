import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, BarChart2, List } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './lib/utils';
import Today from './pages/Today';
import HeatmapPage from './pages/HeatmapPage';
import Stats from './pages/Stats';
import Hobbies from './pages/Hobbies';
import Auth from './pages/Auth';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/useAuthStore';

// ... (Sidebar and BottomNav remain unchanged)

const items = [
  { name: 'Today', path: '/', icon: Home },
  { name: 'Heatmap', path: '/heatmap', icon: Grid },
  { name: 'Stats', path: '/stats', icon: BarChart2 },
  { name: 'Hobbies', path: '/hobbies', icon: List },
];

function Sidebar() {
  const { signOut } = useAuthStore();
  
  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 p-6 glass-panel border-r border-white/5 z-40">
      <div className="mb-12 mt-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">Pulse.</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 z-10 transition-transform", isActive ? "" : "group-hover:scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium z-10">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <button 
        onClick={signOut}
        className="mt-auto flex items-center gap-4 px-4 py-3 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
      <div className="mx-auto max-w-md glass border border-white/10 shadow-2xl rounded-full p-2 flex justify-between items-center pointer-events-auto backdrop-blur-2xl bg-white/5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex-1 flex flex-col items-center justify-center p-3 rounded-full transition-colors duration-300",
                isActive ? "text-white" : "text-white/40 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/15 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 z-10" strokeWidth={isActive ? 2.5 : 2} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Today /></PageWrapper>} />
        <Route path="/heatmap" element={<PageWrapper><HeatmapPage /></PageWrapper>} />
        <Route path="/stats" element={<PageWrapper><Stats /></PageWrapper>} />
        <Route path="/hobbies" element={<PageWrapper><Hobbies /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pb-32 md:pb-12 px-4 md:px-12 pt-8 md:pt-16 max-w-5xl mx-auto w-full will-change-[opacity,transform] transform-gpu"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { session, setSession, setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser]);

  if (!session) {
    return <Auth />;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-transparent flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 w-full relative">
          <AnimatedRoutes />
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
