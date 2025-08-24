

import React from 'react';
import { Task, TaskStatus } from '../types';
import { KANBAN_STATUSES } from '../constants';
import KanbanColumn from './KanbanColumn';

interface KanbanViewProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, updateTask, onDeleteTask, onSelectTask }) => {
  const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    const taskToMove = tasks.find(t => t.id === taskId);
    if (taskToMove && taskToMove.status !== newStatus) {
      updateTask({ ...taskToMove, status: newStatus });
    }
  };

  return (
    <div className="flex flex-1 p-4 md:p-6 gap-6 overflow-x-auto">
      {KANBAN_STATUSES.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(task => task.status === status)}
          onDeleteTask={onDeleteTask}
          onSelectTask={onSelectTask}
          onDropTask={handleTaskDrop}
        />
      ))}
    </div>
  );
};

export default KanbanView;