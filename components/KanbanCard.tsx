import React from 'react';
import { Task, TaskPriority } from '../types';
import { CalendarIcon, TrashIcon } from './Icons';

interface KanbanCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

const priorityClasses: Record<TaskPriority, { border: string, bg: string, text: string }> = {
  [TaskPriority.ALTA]: { border: 'border-red-500', bg: 'bg-red-900/50', text: 'text-red-300' },
  [TaskPriority.MEDIA]: { border: 'border-yellow-500', bg: 'bg-yellow-900/50', text: 'text-yellow-300' },
  [TaskPriority.BAJA]: { border: 'border-green-500', bg: 'bg-green-900/50', text: 'text-green-300' },
};

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDelete, onSelect }) => {
  const priorityStyle = priorityClasses[task.priority];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div 
      onClick={() => onSelect(task)}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-secondary p-4 rounded-lg border-l-4 ${priorityStyle.border} mb-4 shadow-md hover:shadow-lg hover:bg-opacity-80 cursor-grab active:cursor-grabbing group`}>
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-text-primary mb-2">{task.title}</h4>
        <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity">
            <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      {task.description && <p className="text-sm text-text-secondary mb-3">{task.description}</p>}
      <div className="flex items-center justify-between text-xs">
         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}>
            {task.priority}
        </span>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-text-secondary">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;