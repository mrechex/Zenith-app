import React, { useState, useEffect } from 'react';
import { RoutineEvent, RoutineColor } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface RoutineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine: RoutineEvent;
  updateRoutine: (routine: RoutineEvent) => void;
  deleteRoutine: (id: string) => void;
}

const weekDays = [
    { label: 'Lun', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Mié', value: 3 },
    { label: 'Jue', value: 4 },
    { label: 'Vie', value: 5 },
    { label: 'Sáb', value: 6 },
    { label: 'Dom', value: 0 },
];

const RoutineDetailModal: React.FC<RoutineDetailModalProps> = ({ isOpen, onClose, routine, updateRoutine, deleteRoutine }) => {
  const [formData, setFormData] = useState(routine);

  useEffect(() => {
    setFormData(routine);
  }, [routine]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (dayValue: number) => {
    setFormData(prev => {
        const newDays = prev.days.includes(dayValue)
            ? prev.days.filter(d => d !== dayValue)
            : [...prev.days, dayValue];
        return { ...prev, days: newDays };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.days.length === 0) {
        alert("Por favor, completa el título y selecciona al menos un día.");
        return;
    }
    updateRoutine(formData);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`¿Seguro que quieres eliminar la rutina "${routine.title}"?`)) {
      deleteRoutine(routine.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Detalles de la Rutina</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Título</label>
            <input
              type="text" id="title" name="title" value={formData.title} onChange={handleChange}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-text-secondary mb-1">Hora de Inicio</label>
              <input
                type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-text-secondary mb-1">Hora de Fin</label>
              <input
                type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">Días de la semana</label>
            <div className="flex justify-between gap-1">
                {weekDays.map(day => (
                    <button
                        type="button"
                        key={day.value}
                        onClick={() => handleDayToggle(day.value)}
                        className={`w-10 h-10 rounded-full font-bold transition-colors ${formData.days.includes(day.value) ? 'bg-accent text-white' : 'bg-primary hover:bg-border-color'}`}
                    >
                        {day.label}
                    </button>
                ))}
            </div>
          </div>
          
           <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">Color</label>
            <div className="flex gap-3">
                {Object.values(RoutineColor).map(c => (
                     <button
                        type="button"
                        key={c}
                        onClick={() => setFormData(prev => ({...prev, color: c}))}
                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${formData.color === c ? 'ring-2 ring-offset-2 ring-offset-secondary ring-white' : ''}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button type="button" onClick={handleDelete} className="flex items-center gap-2 text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-900/50 transition-colors duration-300">
                <TrashIcon />
                Eliminar
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

export default RoutineDetailModal;
