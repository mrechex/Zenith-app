import React from 'react';
import { Task, TaskPriority } from '../types';
import { CalendarIcon, TrashIcon } from './Icons';

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
    onSelect: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
    [TaskPriority.ALTA]: 'bg-red-500',
    [TaskPriority.MEDIA]: 'bg-yellow-500',
    [TaskPriority.BAJA]: 'bg-green-500',
};


const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onSelect }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(task.id);
    }
    
    return (
        <div 
            onClick={() => onSelect(task)}
            className="bg-secondary p-4 rounded-lg border border-border-color flex items-center justify-between hover:border-accent transition-all duration-200 group cursor-pointer">
            <div className="flex items-center gap-4">
                 <span className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}></span>
                <div>
                    <p className="font-semibold text-text-primary">{task.title}</p>
                    <p className="text-sm text-text-secondary">{task.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-text-secondary">
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                )}
                 <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


export default TaskCard;