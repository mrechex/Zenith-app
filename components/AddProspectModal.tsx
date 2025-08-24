import React, { useState } from 'react';
import { Prospect, Contact } from '../types';
import { CloseIcon } from './Icons';

interface AddProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  addProspect: (prospect: Omit<Prospect, 'id' | 'contactId'>) => void;
  stages: string[];
  contact: Contact;
}

const AddProspectModal: React.FC<AddProspectModalProps> = ({ isOpen, onClose, addProspect, stages, contact }) => {
  const [stage, setStage] = useState(stages[0] || '');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProspect({ stage, notes, followUpDate });
    setStage(stages[0] || '');
    setNotes('');
    setFollowUpDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-text-primary">Convertir en Prospecto</h2>
        <p className="text-text-secondary mb-6">Añade detalles de venta para <strong className="text-text-primary">{contact.name}</strong> de <strong className="text-text-primary">{contact.company}</strong>.</p>
        <form onSubmit={handleSubmit}>
           <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
                <label htmlFor="stage" className="block text-sm font-medium text-text-secondary mb-1">Etapa Inicial</label>
                <select
                    id="stage" name="stage" value={stage} onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="followUpDate" className="block text-sm font-medium text-text-secondary mb-1">Fecha de Seguimiento</label>
                <input
                    type="date" id="followUpDate" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>
          </div>
        
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">Notas Adicionales</label>
            <textarea
              id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300">
              Crear Prospecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProspectModal;