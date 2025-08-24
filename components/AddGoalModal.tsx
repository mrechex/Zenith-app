import React, { useState } from 'react';
import { Goal, Task, GoalHorizon } from '../types';
import { CloseIcon } from './Icons';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  tasks: Task[];
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, addGoal, tasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [horizon, setHorizon] = useState<GoalHorizon>(GoalHorizon.CORTO);

  const handleTaskToggle = (taskId: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({
      title,
      description,
      targetDate,
      taskIds: selectedTaskIds,
      horizon,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setTargetDate('');
    setSelectedTaskIds([]);
    setHorizon(GoalHorizon.CORTO);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-2xl mx-4 p-8 relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Añadir Nueva Meta</h2>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Título</label>
              <input
                type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-text-secondary mb-1">Fecha Límite</label>
              <input
                type="date" id="targetDate" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Descripción</label>
            <textarea
              id="description" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
           <div className="mb-4">
            <label htmlFor="horizon" className="block text-sm font-medium text-text-secondary mb-1">Horizonte</label>
            <select
              id="horizon"
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as GoalHorizon)}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {Object.values(GoalHorizon).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          
          <div className="mb-4 flex-1 flex flex-col overflow-hidden">
             <label className="block text-sm font-medium text-text-secondary mb-2">Vincular Tareas</label>
             <div className="bg-primary border border-border-color rounded-md p-3 overflow-y-auto max-h-48">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-secondary">
                            <input
                                type="checkbox"
                                id={`task-${task.id}`}
                                checked={selectedTaskIds.includes(task.id)}
                                onChange={() => handleTaskToggle(task.id)}
                                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                            />
                            <label htmlFor={`task-${task.id}`} className="text-text-primary cursor-pointer">{task.title}</label>
                        </div>
                    ))
                ) : (
                    <p className="text-text-secondary text-center py-4">No hay tareas para vincular.</p>
                )}
             </div>
          </div>

          <div className="flex justify-end mt-2">
            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300">
              Crear Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;