import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface TaskViewProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
}

const TaskView: React.FC<TaskViewProps> = ({ tasks, onDeleteTask, onSelectTask }) => {
  const todoTasks = tasks.filter(t => t.status === TaskStatus.POR_HACER);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.EN_PROGRESO);
  const doneTasks = tasks.filter(t => t.status === TaskStatus.HECHO);

  return (
    <div className="p-4 md:p-8 space-y-8 h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Por Hacer</h2>
        <div className="space-y-3">
            {todoTasks.length > 0 ? (
                todoTasks.map(task => <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onSelect={onSelectTask} />)
            ) : (
                <p className="text-text-secondary">No hay tareas por hacer. ¡Buen trabajo!</p>
            )}
        </div>
      </div>

       <div>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">En Progreso</h2>
        <div className="space-y-3">
             {inProgressTasks.length > 0 ? (
                inProgressTasks.map(task => <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onSelect={onSelectTask} />)
            ) : (
                <p className="text-text-secondary">No hay tareas en progreso.</p>
            )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Hecho</h2>
        <div className="space-y-3">
             {doneTasks.length > 0 ? (
                doneTasks.map(task => <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onSelect={onSelectTask} />)
            ) : (
                <p className="text-text-secondary">Aún no se han completado tareas.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default TaskView;