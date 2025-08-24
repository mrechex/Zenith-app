import React, { useState, useEffect } from 'react';
import { Prospect, Contact } from '../types';
import { CloseIcon } from './Icons';

interface ProspectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  contact: Contact | undefined;
  updateProspect: (prospect: Prospect) => void;
  stages: string[];
}

const ProspectDetailModal: React.FC<ProspectDetailModalProps> = ({ isOpen, onClose, prospect, contact, updateProspect, stages }) => {
  const [formData, setFormData] = useState<Omit<Prospect, 'id' | 'contactId'>>({
    stage: prospect.stage,
    notes: prospect.notes,
    followUpDate: prospect.followUpDate,
  });

  useEffect(() => {
    setFormData({
      stage: prospect.stage,
      notes: prospect.notes,
      followUpDate: prospect.followUpDate,
    });
  }, [prospect]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProspect({ ...prospect, ...formData });
    onClose();
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-text-primary">Detalles del Prospecto</h2>
        <div className="mb-6 bg-primary p-4 rounded-lg border border-border-color">
            <p className="text-lg font-semibold text-text-primary">{contact.name}</p>
            <p className="text-sm text-text-secondary">{contact.company}</p>
            {contact.email && <p className="text-sm text-text-secondary mt-1">Email: {contact.email}</p>}
            {contact.phone && <p className="text-sm text-text-secondary">Tel: {contact.phone}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-text-secondary mb-1">Etapa</label>
              <select
                  id="stage" name="stage" value={formData.stage} onChange={handleChange}
                  className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="followUpDate" className="block text-sm font-medium text-text-secondary mb-1">Fecha de Seguimiento</label>
              <input
                type="date" id="followUpDate" name="followUpDate" value={formData.followUpDate || ''} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">Notas de Venta</label>
            <textarea
              id="notes" name="notes" value={formData.notes || ''} onChange={handleChange}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProspectDetailModal;