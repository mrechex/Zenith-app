import React, { useMemo } from 'react';
import { PomodoroLog, PomodoroSessionType } from '../types';

interface PomodoroHistoryLogProps {
  history: PomodoroLog[];
}

const isToday = (timestamp: number) => {
  const today = new Date();
  const date = new Date(timestamp);
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
}

const PomodoroHistoryLog: React.FC<PomodoroHistoryLogProps> = ({ history }) => {
  const todaysHistory = useMemo(() => history.filter(log => isToday(log.timestamp)), [history]);
  
  const totalFocusTime = useMemo(() => {
    return todaysHistory
      .filter(log => log.type === PomodoroSessionType.POMODORO)
      .reduce((total, log) => total + log.duration, 0);
  }, [todaysHistory]);

  const sessionTypeDetails: Record<PomodoroSessionType, { icon: string, color: string }> = {
    [PomodoroSessionType.POMODORO]: { icon: '🧠', color: 'text-accent' },
    [PomodoroSessionType.SHORT_BREAK]: { icon: '☕️', color: 'text-green-400' },
    [PomodoroSessionType.LONG_BREAK]: { icon: '🧘', color: 'text-blue-400' },
  };

  return (
    <div className="h-full flex flex-col">
        <h3 className="text-xl font-bold text-text-primary mb-2">Historial del Día</h3>
        <div className="bg-primary p-4 rounded-md mb-4 border border-border-color">
            <p className="text-sm text-text-secondary">Tiempo total de enfoque hoy</p>
            <p className="text-2xl font-bold text-accent">{formatDuration(totalFocusTime)}</p>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
            {todaysHistory.length > 0 ? (
                <ul className="space-y-3">
                    {todaysHistory.map(log => {
                        const details = sessionTypeDetails[log.type];
                        return (
                            <li key={log.id} className="flex items-start gap-3 text-sm p-2 rounded-md hover:bg-primary">
                                <span className="text-lg">{details.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-semibold ${details.color}`}>{log.type}</p>
                                    {log.linkedTask && (
                                        <p className="text-text-secondary text-xs truncate">Tarea: {log.linkedTask.title}</p>
                                    )}
                                </div>
                                <span className="text-xs text-text-secondary pt-1">
                                    {new Date(log.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-text-secondary">
                    <p>No hay actividad registrada hoy. <br/> ¡Inicia un Pomodoro para empezar!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default PomodoroHistoryLog;
