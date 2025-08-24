import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.POR_HACER]: 'border-t-blue-500',
    [TaskStatus.EN_PROGRESO]: 'border-t-yellow-500',
    [TaskStatus.HECHO]: 'border-t-green-500',
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onDeleteTask, onSelectTask, onDropTask }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necesario para permitir soltar
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
        onDropTask(taskId, status);
    }
    setIsOver(false);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[300px] bg-primary rounded-lg p-4 border-t-4 ${statusColors[status]} transition-colors duration-300 ${isOver ? 'bg-secondary/80' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-text-primary">{status}</h3>
        <span className="bg-secondary text-text-secondary text-sm font-bold px-3 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="h-full space-y-2 overflow-y-auto">
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} onDelete={onDeleteTask} onSelect={onSelectTask} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;