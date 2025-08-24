import React, { useMemo } from 'react';
import { Goal, Task, TaskStatus, GoalHorizon } from '../types';
import { CalendarIcon } from './Icons';

interface GoalCardProps {
  goal: Goal;
  tasks: Task[];
  onSelect: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, tasks, onSelect }) => {
  const { completedTasks, totalTasks, progress } = useMemo(() => {
    const relevantTasks = tasks.filter(t => goal.taskIds.includes(t.id));
    const completed = relevantTasks.filter(t => t.status === TaskStatus.HECHO);
    const total = relevantTasks.length;
    const progressPercentage = total > 0 ? (completed.length / total) * 100 : 0;
    return {
      completedTasks: completed.length,
      totalTasks: total,
      progress: progressPercentage,
    };
  }, [goal, tasks]);
  
  const getProgressBarColor = (percentage: number) => {
    if (percentage < 33) return 'bg-red-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  const horizonStyles: Record<GoalHorizon, { bg: string, text: string }> = {
    [GoalHorizon.CORTO]: { bg: 'bg-blue-900/70', text: 'text-blue-300' },
    [GoalHorizon.MEDIANO]: { bg: 'bg-purple-900/70', text: 'text-purple-300' },
    [GoalHorizon.LARGO]: { bg: 'bg-indigo-900/70', text: 'text-indigo-300' },
  };

  return (
    <div
      onClick={() => onSelect(goal)}
      className="bg-secondary p-6 rounded-lg border border-border-color hover:border-accent transition-all duration-200 cursor-pointer flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="pr-4">
          <h3 className="font-bold text-xl text-text-primary">{goal.title}</h3>
          <p className="text-sm text-text-secondary">{goal.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${horizonStyles[goal.horizon].bg} ${horizonStyles[goal.horizon].text}`}>
                {goal.horizon}
            </span>
            {goal.targetDate && (
            <div className="flex items-center gap-1 text-sm text-text-secondary bg-primary px-3 py-1 rounded-full">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
            </div>
            )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-text-secondary">Progreso</span>
          <span className="text-sm font-bold text-text-primary">{completedTasks} / {totalTasks} tareas</span>
        </div>
        <div className="w-full bg-primary rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;