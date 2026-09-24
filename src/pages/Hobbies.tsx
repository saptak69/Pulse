import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { getIcon } from '../lib/utils';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'];
const ICONS = ['BookOpen', 'Music', 'Dumbbell', 'Palette', 'Laptop', 'Smile', 'Coffee', 'PenTool', 'Leaf', 'Camera'];

export default function Hobbies() {
  const { hobbies, addHobby, deleteHobby } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addHobby({ name, icon, color });
      setIsAdding(false);
      setName('');
      setIcon(ICONS[0]);
      setColor(COLORS[0]);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">Hobbies</h1>
          <p className="text-white/50 text-xl font-medium">Manage your habits</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="w-14 h-14 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </header>

      <div className="space-y-4">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-[2rem] space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-2xl text-white/90">New Hobby</h3>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white/80 p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Hobby Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-white/30 transition-all font-medium text-lg shadow-inner"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Icon</p>
                  <div className="flex flex-wrap gap-3">
                    {ICONS.map(i => {
                      const IconComponent = getIcon(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setIcon(i)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${icon === i ? 'bg-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Color</p>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-full transition-all duration-300 ${color === c ? 'scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#0a0a0a]' : 'hover:scale-110 border border-white/20'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-white/90 text-black font-bold rounded-2xl py-4 text-lg active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] mt-4"
                >
                  Create Hobby
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hobbies.map(hobby => {
            const IconComponent = getIcon(hobby.icon);
            return (
              <motion.div
                key={hobby.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-5 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-colors group will-change-[transform,opacity] transform-gpu"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center shadow-lg border border-white/10"
                  style={{ backgroundColor: `${hobby.color}30`, color: hobby.color }}
                >
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="flex-1 font-bold text-xl text-white/90">{hobby.name}</div>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${hobby.name}? This will remove all its history.`)) {
                      deleteHobby(hobby.id);
                    }
                  }}
                  className="text-white/30 hover:text-red-400 transition-colors p-3 rounded-full hover:bg-red-500/10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
