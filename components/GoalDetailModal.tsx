import React, { useState, useEffect } from 'react';
import { Goal, Task, GoalHorizon } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
  tasks: Task[];
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
}

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ isOpen, onClose, goal, tasks, updateGoal, deleteGoal }) => {
  const [formData, setFormData] = useState(goal);

  useEffect(() => {
    setFormData(goal);
  }, [goal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTaskToggle = (taskId: string) => {
    setFormData(prev => {
        const newtaskIds = prev.taskIds.includes(taskId)
            ? prev.taskIds.filter(id => id !== taskId)
            : [...prev.taskIds, taskId];
        return { ...prev, taskIds: newtaskIds };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    updateGoal(formData);
    onClose();
  };

  const handleDelete = () => {
      if (confirm(`¿Seguro que quieres eliminar la meta "${goal.title}"?`)) {
          deleteGoal(goal.id);
          onClose();
      }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-2xl mx-4 p-8 relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Detalles de la Meta</h2>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Título</label>
              <input
                type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-text-secondary mb-1">Fecha Límite</label>
              <input
                type="date" id="targetDate" name="targetDate" value={formData.targetDate || ''} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Descripción</label>
            <textarea
              id="description" name="description" value={formData.description || ''} onChange={handleChange}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
           <div className="mb-4">
            <label htmlFor="horizon" className="block text-sm font-medium text-text-secondary mb-1">Horizonte</label>
            <select
              id="horizon"
              name="horizon"
              value={formData.horizon}
              onChange={handleChange}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {Object.values(GoalHorizon).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          
          <div className="mb-4 flex-1 flex flex-col overflow-hidden">
             <label className="block text-sm font-medium text-text-secondary mb-2">Tareas Vinculadas</label>
             <div className="bg-primary border border-border-color rounded-md p-3 overflow-y-auto max-h-48">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-secondary">
                        <input
                            type="checkbox"
                            id={`detail-task-${task.id}`}
                            checked={formData.taskIds.includes(task.id)}
                            onChange={() => handleTaskToggle(task.id)}
                            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <label htmlFor={`detail-task-${task.id}`} className="text-text-primary cursor-pointer">{task.title}</label>
                    </div>
                ))}
             </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <button type="button" onClick={handleDelete} className="flex items-center gap-2 text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-900/50 transition-colors duration-300">
                <TrashIcon />
                Eliminar Meta
            </button>
            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalDetailModal;