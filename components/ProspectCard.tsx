import React, { useMemo } from 'react';
import { Prospect, Contact } from '../types';
import { TrashIcon, CalendarIcon } from './Icons';

interface ProspectCardProps {
  prospect: Prospect;
  contact: Contact;
  onDelete: (id: string) => void;
  onSelect: (prospect: Prospect) => void;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ prospect, contact, onDelete, onSelect }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prospect.id);
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('prospectId', prospect.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const isUrgent = useMemo(() => {
    if (!prospect.followUpDate) return false;
    // Don't highlight if the prospect is already in a closed stage.
    if (prospect.stage.toLowerCase().includes('cerrado')) return false;
    
    // Get today's date at the beginning of the day (midnight).
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the follow-up date string. Adding 'T00:00:00' ensures it's parsed in the local timezone,
    // preventing off-by-one errors that can occur when the user's timezone is different from UTC.
    const followUp = new Date(prospect.followUpDate + 'T00:00:00');
    
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    
    // Calculate the difference in days.
    const diffDays = Math.round((followUp.getTime() - today.getTime()) / oneDayInMillis);

    // Highlight if the follow-up is for tomorrow (diffDays === 1),
    // today (diffDays === 0), or is overdue (diffDays < 0).
    return diffDays <= 1;
  }, [prospect.followUpDate, prospect.stage]);

  return (
    <div 
      onClick={() => onSelect(prospect)}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-secondary p-4 rounded-lg border-l-4 border-accent mb-4 shadow-md hover:shadow-lg hover:bg-opacity-80 cursor-grab active:cursor-grabbing group ${isUrgent ? 'glow-animation' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
            <h4 className="font-bold text-text-primary">{contact.name}</h4>
            <p className="text-sm text-text-secondary">{contact.company}</p>
        </div>
        <button onClick={handleDelete} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      {(contact.email || contact.phone || prospect.followUpDate) && (
        <div className="mt-3 pt-2 border-t border-border-color text-xs text-text-secondary space-y-1">
            {prospect.followUpDate && (
                <p className={`flex items-center gap-1.5 ${isUrgent ? 'font-bold text-red-400' : ''}`}>
                    <CalendarIcon className="w-4 h-4" />
                    <span>Seguimiento: {new Date(prospect.followUpDate + 'T00:00:00').toLocaleDateString()}</span>
                </p>
            )}
            {contact.email && <p>Email: {contact.email}</p>}
            {contact.phone && <p>Tel: {contact.phone}</p>}
        </div>
      )}
    </div>
  );
};

export default ProspectCard;