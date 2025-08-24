import React, { useMemo } from 'react';
import { Prospect, Contact } from '../types';
import ProspectsKanbanColumn from './ProspectsKanbanColumn';
import { PlusIcon } from './Icons';

interface ProspectsViewProps {
  prospects: Prospect[];
  contacts: Contact[];
  stages: string[];
  updateProspect: (prospect: Prospect) => void;
  onDeleteProspect: (id: string) => void;
  onSelectProspect: (prospect: Prospect) => void;
  onAddStage: (name: string) => void;
  onUpdateStage: (oldName: string, newName: string) => void;
  onDeleteStage: (name: string) => void;
}

const ProspectsView: React.FC<ProspectsViewProps> = ({ 
  prospects, 
  contacts,
  stages,
  updateProspect,
  onDeleteProspect, 
  onSelectProspect, 
  onAddStage,
  onUpdateStage,
  onDeleteStage
}) => {
  const handleAddStageClick = () => {
    const newStageName = prompt("Introduce el nombre de la nueva etapa:");
    if (newStageName) {
      onAddStage(newStageName);
    }
  };

  const handleProspectDrop = (prospectId: string, newStage: string) => {
    const prospectToMove = prospects.find(p => p.id === prospectId);
    if (prospectToMove && prospectToMove.stage !== newStage) {
      updateProspect({ ...prospectToMove, stage: newStage });
    }
  };
  
  const contactMap = useMemo(() => 
    new Map(contacts.map(contact => [contact.id, contact])), 
    [contacts]
  );

  return (
    <div className="flex flex-1 p-4 md:p-6 gap-6 overflow-x-auto">
      {stages.map(stage => {
        const prospectsInStage = prospects
          .filter(p => p.stage === stage)
          .map(p => ({ prospect: p, contact: contactMap.get(p.contactId) }))
          .filter(item => item.contact); // Ensure contact exists

        return (
            <ProspectsKanbanColumn
                key={stage}
                stage={stage}
                prospectsWithContacts={prospectsInStage as Array<{ prospect: Prospect; contact: Contact; }>}
                onDeleteProspect={onDeleteProspect}
                onSelectProspect={onSelectProspect}
                onUpdateStage={onUpdateStage}
                onDeleteStage={onDeleteStage}
                onDropProspect={handleProspectDrop}
            />
        );
    })}

      <div className="min-w-[300px]">
        <button 
          onClick={handleAddStageClick}
          className="w-full h-12 flex items-center justify-center gap-2 bg-secondary/50 text-text-secondary rounded-lg border-2 border-dashed border-border-color hover:bg-secondary hover:text-text-primary transition-colors">
          <PlusIcon className="w-5 h-5" />
          Añadir Etapa
        </button>
      </div>
    </div>
  );
};

export default ProspectsView;