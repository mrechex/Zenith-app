import React, { useMemo } from 'react';
import { PomodoroSessionType, Task, PomodoroLog, TaskStatus } from '../types';
import PomodoroHistoryLog from './PomodoroHistoryLog';

interface PomodoroViewProps {
    tasks: Task[];
    updateTask: (task: Task) => void;
    history: PomodoroLog[];
    
    // Props from usePomodoro hook
    sessionType: PomodoroSessionType;
    timeRemaining: number;
    isActive: boolean;
    pomodorosCompleted: number;
    linkedTaskId: string | null;
    setLinkedTaskId: (id: string | null) => void;
    toggleTimer: () => void;
    resetTimer: () => void;
    changeSession: (type: PomodoroSessionType) => void;
    getSessionDuration: (type: PomodoroSessionType) => number;
}

const PomodoroView: React.FC<PomodoroViewProps> = ({ 
    tasks, 
    updateTask, 
    history,
    sessionType,
    timeRemaining,
    isActive,
    linkedTaskId,
    setLinkedTaskId,
    toggleTimer,
    resetTimer,
    changeSession,
    getSessionDuration
}) => {
    const uncompletedTasks = useMemo(() => tasks.filter(t => t.status !== TaskStatus.HECHO), [tasks]);
    const linkedTask = useMemo(() => tasks.find(t => t.id === linkedTaskId), [tasks, linkedTaskId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleFinishTask = () => {
        if (linkedTask) {
            updateTask({ ...linkedTask, status: TaskStatus.HECHO });
            setLinkedTaskId(null);
        }
    };
    
    const totalDuration = getSessionDuration(sessionType);
    const progress = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;
    const radius = 120; // Reduced for smaller screens
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const sessionTabs = [
        { type: PomodoroSessionType.POMODORO, label: 'Pomodoro' },
        { type: PomodoroSessionType.SHORT_BREAK, label: 'P. Corta' },
        { type: PomodoroSessionType.LONG_BREAK, label: 'P. Larga' },
    ];
    
    return (
        <div className="p-4 md:p-8 h-full flex flex-col md:flex-row gap-8">
            {/* Left Column: Timer and Controls */}
            <div className="flex-[2] flex flex-col items-center justify-center text-center">
                <div className="flex items-center bg-secondary p-1 rounded-lg mb-8 w-full max-w-sm">
                    {sessionTabs.map(tab => (
                        <button key={tab.type} onClick={() => changeSession(tab.type)}
                            className={`w-full px-2 sm:px-6 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${ sessionType === tab.type ? 'bg-accent text-white' : 'text-text-secondary hover:bg-border-color' }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-6">
                    <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="15" fill="transparent" className="text-border-color" />
                        <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="15" fill="transparent"
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                            className="text-accent transition-all" style={{ transitionDuration: '1s' }} />
                    </svg>
                    <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        <h2 className="text-6xl md:text-7xl font-bold tracking-widest text-text-primary">{formatTime(timeRemaining)}</h2>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={toggleTimer} className="w-36 sm:w-48 bg-accent text-white text-xl sm:text-2xl font-bold py-4 px-4 sm:px-8 rounded-lg hover:bg-purple-500 transition-colors duration-300 shadow-lg shadow-purple-900/50 uppercase tracking-widest">
                        {isActive ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button onClick={resetTimer} className="bg-secondary text-text-secondary font-bold p-5 rounded-lg hover:bg-border-color transition-colors" aria-label="Reiniciar temporizador">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
                        </svg>
                    </button>
                </div>
                
                <div className="h-24 w-full max-w-md">
                    {linkedTask ? (
                        <div className="bg-secondary p-4 rounded-lg border border-border-color text-left">
                           <p className="text-text-secondary text-sm">Trabajando en:</p>
                           <p className="font-bold text-text-primary truncate">{linkedTask.title}</p>
                           <div className="flex gap-2 mt-2">
                                <button onClick={handleFinishTask} className="flex-1 bg-green-600/20 text-green-300 text-sm font-semibold py-1 rounded hover:bg-green-600/40">Finalizar Tarea</button>
                                <button onClick={() => setLinkedTaskId(null)} className="flex-1 bg-gray-600/20 text-gray-300 text-sm font-semibold py-1 rounded hover:bg-gray-600/40">Cambiar Tarea</button>
                           </div>
                        </div>
                    ) : (
                         <div>
                            <label htmlFor="task-select" className="sr-only">Selecciona una tarea para enfocar</label>
                            <select id="task-select" value={linkedTaskId || ''} onChange={(e) => setLinkedTaskId(e.target.value || null)}
                                className="w-full bg-secondary border border-border-color rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-center">
                                <option value="" disabled>Selecciona una tarea para enfocar</option>
                                {uncompletedTasks.map(task => (
                                    <option key={task.id} value={task.id}>{task.title}</option>
                                ))}
                            </select>
                         </div>
                    )}
                </div>
            </div>

            {/* Right Column: History */}
            <div className="flex-1 bg-secondary p-6 rounded-lg flex flex-col border border-border-color min-h-[400px] md:min-h-0">
                <PomodoroHistoryLog history={history} />
            </div>
        </div>
    );
};

export default PomodoroView;