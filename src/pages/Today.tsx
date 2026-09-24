import { useState } from 'react';
import { format, startOfToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Plus, Check } from 'lucide-react';
import { cn, getIcon } from '../lib/utils';

export default function Today() {
  const { hobbies, entries, addEntry } = useStore();
  const today = startOfToday();
  const todayStr = format(today, 'yyyy-MM-dd');

  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleLog = (hobbyId: string) => {
    try {
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } catch(e) {}
    
    setAnimatingId(hobbyId);
    setTimeout(() => {
      addEntry({
        hobbyId,
        date: todayStr,
      });
      setAnimatingId(null);
    }, 600);
  };

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">Today</h1>
        <p className="text-white/50 text-xl font-medium">{format(today, 'EEEE, MMMM do')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {hobbies.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 px-4 rounded-3xl border border-dashed border-white/20 glass"
            >
              <p className="text-white/50 mb-4 text-lg">No hobbies added yet. Add one from the Hobbies tab.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {hobbies.map(hobby => {
          const isDone = entries.some(e => e.hobbyId === hobby.id && e.date === todayStr);
          const isAnimating = animatingId === hobby.id;
          const Icon = getIcon(hobby.icon);
          
          return (
            <motion.div
              key={hobby.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-3xl glass p-5 flex items-center gap-5 transition-all hover:bg-white/10 group will-change-[transform,opacity] transform-gpu"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex flex-shrink-0 items-center justify-center text-3xl shadow-lg border border-white/10"
                style={{ backgroundColor: `${hobby.color}30`, color: hobby.color }}
              >
                <Icon className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-xl text-white/90">{hobby.name}</h3>
                <p className="text-sm font-medium mt-1 text-white/40">
                  {isDone ? 'Completed today' : 'Not started'}
                </p>
              </div>

              <button
                disabled={isDone || isAnimating}
                onClick={() => handleLog(hobby.id)}
                className={cn(
                  "relative w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-500",
                  isDone 
                    ? "bg-white/5 text-white/30 border border-white/5" 
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                )}
                style={isDone ? { color: hobby.color, borderColor: `${hobby.color}30`, backgroundColor: `${hobby.color}15` } : {}}
              >
                <AnimatePresence mode="wait">
                  {isAnimating || isDone ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <Check className="w-7 h-7" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plus"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <Plus className="w-7 h-7" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Background fill animation */}
              <AnimatePresence>
                {isAnimating && (
                  <motion.div
                    initial={{ clipPath: 'circle(0% at 90% 50%)', opacity: 0.8 }}
                    animate={{ clipPath: 'circle(150% at 90% 50%)', opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ backgroundColor: hobby.color }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
