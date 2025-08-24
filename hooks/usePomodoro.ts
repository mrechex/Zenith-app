import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PomodoroSessionType, Task, PomodoroLog, TaskStatus } from '../types';

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const SESSIONS_UNTIL_LONG_BREAK = 4;

interface UsePomodoroProps {
    tasks: Task[];
    updateTask: (task: Task) => void;
    addLogEntry: (log: Omit<PomodoroLog, 'id' | 'timestamp'>) => void;
}

export const usePomodoro = ({ tasks, updateTask, addLogEntry }: UsePomodoroProps) => {
    const [sessionType, setSessionType] = useState<PomodoroSessionType>(PomodoroSessionType.POMODORO);
    const [timeRemaining, setTimeRemaining] = useState(POMODORO_TIME);
    const [isActive, setIsActive] = useState(false);
    const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
    const [linkedTaskId, setLinkedTaskId] = useState<string | null>(null);

    const linkedTask = useMemo(() => tasks.find(t => t.id === linkedTaskId), [tasks, linkedTaskId]);

    const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const targetTimeRef = useRef<number>(0);

    useEffect(() => {
        alarmSoundRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
        alarmSoundRef.current.volume = 0.5;
    }, []);

    const playAlarm = useCallback(() => {
        alarmSoundRef.current?.play().catch(e => console.error("Error playing sound:", e));
    }, []);
    
    const getSessionDuration = useCallback((type: PomodoroSessionType) => {
        switch (type) {
            case PomodoroSessionType.POMODORO: return POMODORO_TIME;
            case PomodoroSessionType.SHORT_BREAK: return SHORT_BREAK_TIME;
            case PomodoroSessionType.LONG_BREAK: return LONG_BREAK_TIME;
            default: return POMODORO_TIME;
        }
    }, []);

    const stopTimer = useCallback(() => {
        setIsActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const tick = () => {
            const remainingSeconds = Math.round((targetTimeRef.current - Date.now()) / 1000);
            
            if (remainingSeconds <= 0) {
                setTimeRemaining(0);
                playAlarm();
                
                const finishedSessionType = sessionType;
                const duration = getSessionDuration(finishedSessionType);

                if (finishedSessionType === PomodoroSessionType.POMODORO && linkedTask) {
                    const updatedTask = {
                        ...linkedTask,
                        pomodorosDone: (linkedTask.pomodorosDone || 0) + 1,
                        totalTimeSpent: (linkedTask.totalTimeSpent || 0) + duration,
                    };
                    updateTask(updatedTask);
                     addLogEntry({
                        type: finishedSessionType,
                        duration,
                        linkedTask: { id: linkedTask.id, title: linkedTask.title }
                    });
                } else {
                     addLogEntry({ type: finishedSessionType, duration });
                }

                if (sessionType === PomodoroSessionType.POMODORO) {
                    const newCompletedCount = pomodorosCompleted + 1;
                    setPomodorosCompleted(newCompletedCount);
                    if (newCompletedCount > 0 && newCompletedCount % SESSIONS_UNTIL_LONG_BREAK === 0) {
                        setSessionType(PomodoroSessionType.LONG_BREAK);
                        setTimeRemaining(LONG_BREAK_TIME);
                    } else {
                        setSessionType(PomodoroSessionType.SHORT_BREAK);
                        setTimeRemaining(SHORT_BREAK_TIME);
                    }
                } else { // It was a break
                    setSessionType(PomodoroSessionType.POMODORO);
                    setTimeRemaining(POMODORO_TIME);
                }
                stopTimer();
            } else {
                setTimeRemaining(remainingSeconds);
            }
        };

        tick();
        intervalRef.current = setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, pomodorosCompleted, sessionType, playAlarm, stopTimer, getSessionDuration, addLogEntry, linkedTask, updateTask]);

    const toggleTimer = useCallback(() => {
        if (isActive) {
            stopTimer();
        } else {
            targetTimeRef.current = Date.now() + timeRemaining * 1000;
            setIsActive(true);
        }
    }, [isActive, timeRemaining, stopTimer]);

    const resetTimer = useCallback(() => {
        stopTimer();
        switch (sessionType) {
            case PomodoroSessionType.POMODORO: setTimeRemaining(POMODORO_TIME); break;
            case PomodoroSessionType.SHORT_BREAK: setTimeRemaining(SHORT_BREAK_TIME); break;
            case PomodoroSessionType.LONG_BREAK: setTimeRemaining(LONG_BREAK_TIME); break;
        }
    }, [sessionType, stopTimer]);

    const changeSession = useCallback((newSession: PomodoroSessionType) => {
        stopTimer();
        setSessionType(newSession);
        switch (newSession) {
            case PomodoroSessionType.POMODORO: setTimeRemaining(POMODORO_TIME); break;
            case PomodoroSessionType.SHORT_BREAK: setTimeRemaining(SHORT_BREAK_TIME); break;
            case PomodoroSessionType.LONG_BREAK: setTimeRemaining(LONG_BREAK_TIME); break;
        }
    }, [stopTimer]);

    return {
        sessionType,
        timeRemaining,
        isActive,
        pomodorosCompleted,
        linkedTaskId,
        setLinkedTaskId,
        toggleTimer,
        resetTimer,
        changeSession,
        getSessionDuration,
    };
};