import React, { useState, useRef, useEffect } from 'react';
import { Contact } from '../types';
import { TrashIcon, PencilIcon, DotsVerticalIcon } from './Icons';

interface ContactCardProps {
    contact: Contact;
    onSelect: () => void;
    onDelete: () => void;
    onConvertToProspect: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect, onDelete, onConvertToProspect }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        if (confirm(`¿Seguro que quieres eliminar a ${contact.name}?`)) {
            onDelete();
        }
    }
    
    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        onSelect();
    }
    
    const handleConvertToProspect = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        onConvertToProspect();
    }

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    }
    
    return (
        <div 
            className="bg-secondary p-4 rounded-lg border border-border-color flex items-center justify-between hover:border-accent transition-all duration-200 group cursor-pointer"
            onClick={onSelect}
        >
            <div className="flex items-center gap-4 min-w-0">
                 <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-bold text-xl text-white shrink-0">
                     {contact.name.charAt(0).toUpperCase()}
                 </div>
                <div className="min-w-0">
                    <p className="font-semibold text-text-primary text-lg truncate">{contact.name}</p>
                    <p className="text-sm text-text-secondary truncate">{contact.company}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-text-secondary ml-4">
                <div className="text-right hidden sm:block min-w-0">
                    {contact.email && <p className="text-sm truncate">{contact.email}</p>}
                    {contact.phone && <p className="text-sm truncate">{contact.phone}</p>}
                </div>
                <div className="relative" ref={menuRef}>
                    <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-border-color hover:text-text-primary">
                        <DotsVerticalIcon />
                    </button>
                    {isMenuOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-primary border border-border-color rounded-md shadow-lg z-10">
                            <button onClick={handleConvertToProspect} className="block w-full text-left px-4 py-2 text-sm text-purple-300 hover:bg-border-color">
                                Crear Prospecto
                            </button>
                            <button onClick={handleSelect} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-border-color">
                                Editar
                            </button>
                            <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-border-color">
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactCard;