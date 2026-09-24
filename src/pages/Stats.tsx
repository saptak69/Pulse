import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format, subDays, startOfToday } from 'date-fns';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Target } from 'lucide-react';
import { getIcon } from '../lib/utils';

export default function Stats() {
  const { hobbies, entries } = useStore();
  const today = startOfToday();

  const stats = useMemo(() => {
    let totalEntries = entries.length;
    
    // Most active hobby
    const hobbyCounts: Record<string, number> = {};
    entries.forEach(e => {
      hobbyCounts[e.hobbyId] = (hobbyCounts[e.hobbyId] || 0) + 1;
    });
    
    let topHobbyId = '';
    let maxCount = 0;
    Object.entries(hobbyCounts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topHobbyId = id;
      }
    });

    const topHobby = hobbies.find(h => h.id === topHobbyId);

    // Calculate a rough "current streak" across all hobbies (days in a row with at least one entry)
    let streak = 0;
    let checkDate = today;
    
    // Check if there's an entry today
    const hasToday = entries.some(e => e.date === format(today, 'yyyy-MM-dd'));
    if (!hasToday) {
      checkDate = subDays(today, 1);
    }

    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (entries.some(e => e.date === dateStr)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    return {
      totalEntries,
      topHobby,
      streak
    };
  }, [entries, hobbies, today]);

  const statCards = [
    {
      title: 'Current Streak',
      value: `${stats.streak} days`,
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20'
    },
    {
      title: 'Total Logs',
      value: stats.totalEntries,
      icon: Target,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      title: 'Most Consistent',
      value: stats.topHobby ? stats.topHobby.name : 'None',
      icon: Trophy,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      CustomIcon: stats.topHobby ? getIcon(stats.topHobby.icon) : null
    },
    {
      title: 'Active Days',
      value: new Set(entries.map(e => e.date)).size,
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">Stats</h1>
        <p className="text-white/50 text-xl font-medium">Your progress at a glance</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 30 }}
            className="glass rounded-[2rem] p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 hover:bg-white/10 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
              {stat.CustomIcon ? <stat.CustomIcon className="w-6 h-6" /> : <stat.icon className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold text-white/50 mb-1 uppercase tracking-wider">{stat.title}</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-white/90">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
