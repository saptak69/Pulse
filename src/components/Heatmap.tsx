import { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays, getMonth, isSameMonth } from 'date-fns';

interface HeatmapProps {
  counts: Record<string, number>;
  color: string;
  isAggregated: boolean;
}

export default function Heatmap({ counts, color, isAggregated }: HeatmapProps) {
  const WEEKS = 53;
  const DAYS_IN_WEEK = 7;
  
  const today = new Date();
  
  // To match github, the grid ends on the current week.
  // The last column is the current week. The last cell is today (if we fill it normally), but actually Github always shows the full week column, and future days are just empty.
  // We'll calculate the grid from 52 weeks ago (starting on Sunday).
  
  const currentWeekStart = startOfWeek(today); // Sunday of current week
  const gridStartDate = subDays(currentWeekStart, (WEEKS - 1) * 7);

  const weeks = useMemo(() => {
    const w = [];
    let currentDate = gridStartDate;
    
    for (let i = 0; i < WEEKS; i++) {
      const week = [];
      for (let j = 0; j < DAYS_IN_WEEK; j++) {
        week.push(currentDate);
        currentDate = addDays(currentDate, 1);
      }
      w.push(week);
    }
    return w;
  }, [gridStartDate]);

  // Calculate month labels
  const monthLabels = useMemo(() => {
    const labels: { label: string, colIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, i) => {
      // Look at the first day of the week (Sunday) or Tuesday to decide month label
      const date = week[0];
      const month = getMonth(date);
      if (month !== lastMonth && i > 0) { // Don't put label on very first column if it's the end of a month
        labels.push({
          label: format(date, 'MMM'),
          colIndex: i
        });
        lastMonth = month;
      } else if (lastMonth === -1) {
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getCellColor = (count: number, date: Date) => {
    if (date > today) return 'rgba(255,255,255,0.02)'; // Future
    if (count === 0) return 'rgba(255,255,255,0.05)'; // Empty

    let intensity = 0;
    if (isAggregated) {
      if (count === 1) intensity = 0.3;
      else if (count === 2) intensity = 0.5;
      else if (count === 3) intensity = 0.7;
      else intensity = 1.0;
    } else {
      intensity = Math.min(0.4 + (count * 0.2), 1.0);
    }

    return hexToRgba(color, intensity);
  };

  return (
    <div className="flex flex-col select-none text-[12px] text-white/50">
      {/* Month Labels */}
      <div className="flex mb-2 ml-8 relative" style={{ width: `${WEEKS * 14}px`, height: '16px' }}>
        {monthLabels.map((m, i) => (
          <div 
            key={i} 
            className="absolute top-0 font-medium"
            style={{ left: `${m.colIndex * 14}px` }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Day Labels */}
        <div className="flex flex-col gap-[3px] mr-2 w-6 text-right font-medium">
          <div className="h-[11px]"></div>
          <div className="h-[11px] leading-[11px]">Mon</div>
          <div className="h-[11px]"></div>
          <div className="h-[11px] leading-[11px]">Wed</div>
          <div className="h-[11px]"></div>
          <div className="h-[11px] leading-[11px]">Fri</div>
          <div className="h-[11px]"></div>
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((date, dayIndex) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const count = counts[dateStr] || 0;
                
                return (
                  <div
                    key={dateStr}
                    className="w-[11px] h-[11px] rounded-[2px] relative group transition-colors duration-300"
                    style={{ backgroundColor: getCellColor(count, date) }}
                  >
                    {/* Tooltip */}
                    {date <= today && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 backdrop-blur-md text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl transition-opacity">
                        <span className="font-semibold text-white/90">{count} {count === 1 ? 'contribution' : 'contributions'}</span> on {format(date, 'MMM do, yyyy')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-4 text-[11px] gap-2">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((level) => {
            let intensity = 0;
            if (level === 0) intensity = 0.05; // Empty
            else if (level === 1) intensity = 0.3;
            else if (level === 2) intensity = 0.5;
            else if (level === 3) intensity = 0.7;
            else intensity = 1.0;

            const bg = level === 0 ? 'rgba(255,255,255,0.05)' : hexToRgba(color, intensity);

            return (
              <div
                key={level}
                className="w-[11px] h-[11px] rounded-[2px]"
                style={{ backgroundColor: bg }}
              />
            );
          })}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
