import React, { useState, useRef, useEffect } from 'react';
import { Prospect, Contact } from '../types';
import ProspectCard from './ProspectCard';
import { DotsVerticalIcon } from './Icons';

interface ProspectsKanbanColumnProps {
  stage: string;
  prospectsWithContacts: Array<{ prospect: Prospect; contact?: Contact }>;
  onDeleteProspect: (id: string) => void;
  onSelectProspect: (prospect: Prospect) => void;
  onUpdateStage: (oldName: string, newName: string) => void;
  onDeleteStage: (name: string) => void;
  onDropProspect: (prospectId: string, stage: string) => void;
}

const ProspectsKanbanColumn: React.FC<ProspectsKanbanColumnProps> = ({ 
  stage, 
  prospectsWithContacts, 
  onDeleteProspect, 
  onSelectProspect, 
  onUpdateStage, 
  onDeleteStage, 
  onDropProspect 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stageName, setStageName] = useState(stage);
  const [isOver, setIsOver] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    if (isEditing) {
        inputRef.current?.focus();
        inputRef.current?.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    setIsEditing(false);
    setIsMenuOpen(false);
    if (stageName.trim() && stageName.trim() !== stage) {
      onUpdateStage(stage, stageName);
    } else {
      setStageName(stage);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const prospectId = e.dataTransfer.getData('prospectId');
    if (prospectId) {
        onDropProspect(prospectId, stage);
    }
    setIsOver(false);
  };
  
  return (
    <div 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[300px] bg-primary rounded-lg p-4 border-t-4 border-t-purple-500 flex flex-col transition-colors duration-300 ${isOver ? 'bg-secondary/80' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
            <input
                ref={inputRef}
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                className="font-bold text-lg text-text-primary bg-transparent border-b-2 border-accent outline-none"
            />
        ) : (
            <h3 className="font-bold text-lg text-text-primary">{stage}</h3>
        )}

        <div className="flex items-center gap-2">
            <span className="bg-secondary text-text-secondary text-sm font-bold px-3 py-1 rounded-full">
                {prospectsWithContacts.length}
            </span>
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-secondary hover:text-text-primary">
                    <DotsVerticalIcon />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-secondary border border-border-color rounded-md shadow-lg z-10">
                        <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-border-color">
                            Renombrar
                        </button>
                        <button onClick={() => onDeleteStage(stage)} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-border-color">
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="h-full space-y-2 overflow-y-auto pr-2">
        {prospectsWithContacts.map(({ prospect, contact }) => 
          contact ? (
            <ProspectCard 
              key={prospect.id} 
              prospect={prospect} 
              contact={contact} 
              onDelete={onDeleteProspect} 
              onSelect={onSelectProspect} 
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default ProspectsKanbanColumn;