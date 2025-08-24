import React, { useState, useMemo, useEffect } from 'react';
import { RoutineEvent } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarViewProps {
  routines: RoutineEvent[];
  onSelectRoutine: (routine: RoutineEvent) => void;
}

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const CalendarView: React.FC<CalendarViewProps> = ({ routines, onSelectRoutine }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const weekStart = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
  
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  }, [weekStart]);
  
  const timeSlots = Array.from({ length: 17 }, (_, i) => `${(i + 6).toString().padStart(2, '0')}:00`);

  const changeDate = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      const increment = isMobileView ? offset : offset * 7;
      newDate.setDate(newDate.getDate() + increment);
      return newDate;
    });
  };

  const renderHeader = () => {
    const monthFormat = new Intl.DateTimeFormat('es-ES', { month: 'long' });
    const yearFormat = new Intl.DateTimeFormat('es-ES', { year: 'numeric' });
    let title = '';

    if (isMobileView) {
        title = `${currentDate.getDate()} de ${monthFormat.format(currentDate)}, ${yearFormat.format(currentDate)}`;
    } else {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const startText = `${weekStart.getDate()} de ${monthFormat.format(weekStart)}`;
        const endText = weekStart.getMonth() === weekEnd.getMonth()
            ? `${weekEnd.getDate()}`
            : `${weekEnd.getDate()} de ${monthFormat.format(weekEnd)}`;
        title = `${startText} - ${endText}, ${yearFormat.format(currentDate)}`;
    }

    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-lg md:text-2xl font-bold capitalize text-text-primary text-center">
          {title}
        </h2>
        <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    );
  };
  
  const getEventPositionAndHeight = (event: RoutineEvent) => {
      const [startHour, startMinute] = event.startTime.split(':').map(Number);
      const [endHour, endMinute] = event.endTime.split(':').map(Number);
      const calendarStartHour = 6;
      const topInMinutes = (startHour - calendarStartHour) * 60 + startMinute;
      const heightInMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      const remPerHour = 4;
      return {
          top: `${(topInMinutes / 60) * remPerHour}rem`,
          height: `${(heightInMinutes / 60) * remPerHour}rem`,
      }
  }

  const DaySelector = () => (
    <div className="flex justify-around mb-4 bg-secondary p-1 rounded-lg">
      {weekDays.map(day => (
        <button
          key={day.toISOString()}
          onClick={() => setCurrentDate(day)}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors w-full ${
            day.toDateString() === currentDate.toDateString()
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:bg-border-color'
          }`}
        >
          {new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(day).charAt(0)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      {renderHeader()}
      {isMobileView && <DaySelector />}
      <div className="flex-1 overflow-auto">
        <div 
          className="grid"
          style={{
            gridTemplateColumns: isMobileView ? '4rem 1fr' : '4rem repeat(7, minmax(0, 1fr))',
            gridTemplateRows: `auto repeat(${timeSlots.length}, 4rem)`,
          }}
        >
          {/* Top-left corner */}
          <div className="sticky top-0 bg-primary z-20 border-b border-r border-border-color"></div>

          {/* Day Headers */}
          {(isMobileView ? [currentDate] : weekDays).map((date, index) => (
            <div 
              key={date.toISOString()}
              className="sticky top-0 text-center py-2 bg-primary z-10 border-b border-r border-border-color"
              style={{ gridColumn: index + 2, gridRow: 1 }}
            >
              <p className="font-semibold text-text-secondary capitalize">{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date)}</p>
              <p className="text-xl md:text-2xl font-bold text-text-primary">{date.getDate()}</p>
            </div>
          ))}

          {/* Time Gutter */}
          <div className="col-start-1 col-end-2 row-start-2 row-end-[-1] grid" style={{gridTemplateRows: `repeat(${timeSlots.length}, 4rem)`}}>
            {timeSlots.map(time => (
                <div key={time} className="text-right pr-2 text-sm text-text-secondary border-r border-border-color h-16">
                     <span className="relative -top-2.5">{time}</span>
                </div>
            ))}
          </div>
          
          {/* Background columns */}
          {(isMobileView ? [currentDate] : weekDays).map((_, index) => (
             <div 
                key={index} 
                className="row-start-2 row-end-[-1] border-r border-border-color grid" 
                style={{ gridColumn: index + 2, gridTemplateRows: `repeat(${timeSlots.length}, 4rem)` }}
            >
                {timeSlots.map((_, i) => <div key={i} className="border-t border-border-color"></div>)}
            </div>
          ))}

          {/* Event Overlay */}
          <div className="col-start-2 col-end-[-1] row-start-2 row-end-[-1] relative grid" style={{gridTemplateColumns: `repeat(${isMobileView ? 1 : 7}, minmax(0, 1fr))`}}>
             {routines.map(routine => {
              const { top, height } = getEventPositionAndHeight(routine);
              const displayDays = isMobileView ? [currentDate] : weekDays;

              return routine.days.map(dayOfWeek => {
                const dayIndex = displayDays.findIndex(date => date.getDay() === dayOfWeek);
                if (dayIndex === -1) return null;
                const totalDays = isMobileView ? 1 : 7;

                return (
                  <div
                    key={`${routine.id}-${dayOfWeek}`}
                    onClick={() => onSelectRoutine(routine)}
                    className="absolute p-1.5 rounded-lg text-white cursor-pointer z-10 transition-all hover:opacity-90 overflow-hidden"
                    style={{
                      top, height, backgroundColor: routine.color,
                      left: `calc(${(dayIndex / totalDays) * 100}% + 4px)`,
                      width: `calc(${(1 / totalDays) * 100}% - 8px)`,
                    }}
                  >
                    <p className="font-bold text-sm truncate">{routine.title}</p>
                    <p className="text-xs">{routine.startTime} - {routine.endTime}</p>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;