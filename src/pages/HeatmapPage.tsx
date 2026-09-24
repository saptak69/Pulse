import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import Heatmap from '../components/Heatmap';
import { motion } from 'framer-motion';
import { getIcon } from '../lib/utils';
import { Layers } from 'lucide-react';

export default function HeatmapPage() {
  const { hobbies, entries } = useStore();
  const [selectedHobby, setSelectedHobby] = useState<string | 'all'>('all');

  const filteredEntries = useMemo(() => {
    if (selectedHobby === 'all') return entries;
    return entries.filter(e => e.hobbyId === selectedHobby);
  }, [entries, selectedHobby]);

  const entryCountsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEntries.forEach(e => {
      counts[e.date] = (counts[e.date] || 0) + 1;
    });
    return counts;
  }, [filteredEntries]);

  // #2ea043 is classic Github green, but a bit brighter for dark mode: #39d353
  const activeColor = selectedHobby === 'all' 
    ? '#39d353' 
    : hobbies.find(h => h.id === selectedHobby)?.color || '#39d353';

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">History</h1>
        <p className="text-white/50 text-xl font-medium">Your contribution graph</p>
      </header>

      {/* Glass Segmented Control */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedHobby('all')}
          className="relative px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2"
        >
          {selectedHobby === 'all' ? (
            <motion.div
              layoutId="heatmap-tab"
              className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-2xl z-0"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          ) : (
            <div className="absolute inset-0 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl z-0 transition-colors" />
          )}
          <span className={`relative z-10 flex items-center gap-2 ${selectedHobby === 'all' ? 'text-black' : 'text-white/70'}`}>
            <Layers className="w-4 h-4" /> All Activity
          </span>
        </button>
        
        {hobbies.map(hobby => {
          const Icon = getIcon(hobby.icon);
          const isSelected = selectedHobby === hobby.id;
          
          return (
            <button
              key={hobby.id}
              onClick={() => setSelectedHobby(hobby.id)}
              className="relative px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2"
            >
              {isSelected ? (
                <motion.div
                  layoutId="heatmap-tab"
                  className="absolute inset-0 shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-2xl z-0"
                  style={{ backgroundColor: hobby.color }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl z-0 transition-colors" />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${isSelected ? 'text-white' : 'text-white/70'}`}>
                <Icon className="w-4 h-4" /> {hobby.name}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={selectedHobby}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass rounded-[2rem] p-6 md:p-8 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Total Contributions</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-white/90">{filteredEntries.length}</span>
              <span className="text-xl font-medium text-white/40">in the last year</span>
            </div>
          </div>
        </div>

        {/* Github grid needs horizontal scrolling on mobile */}
        <div className="overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 pb-4">
          <Heatmap
            counts={entryCountsByDate}
            color={activeColor}
            isAggregated={selectedHobby === 'all'}
          />
        </div>
      </motion.div>
    </div>
  );
}
