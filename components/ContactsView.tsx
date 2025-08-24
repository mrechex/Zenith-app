import React from 'react';
import { Contact } from '../types';
import ContactCard from './ContactCard';

interface ContactsViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onConvertToProspect: (contact: Contact) => void;
}

const ContactsView: React.FC<ContactsViewProps> = ({ contacts, onSelectContact, onDeleteContact, onConvertToProspect }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      {contacts.length > 0 ? (
        <div className="space-y-4">
            {contacts.map(contact => (
                <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    onSelect={() => onSelectContact(contact)}
                    onDelete={() => onDeleteContact(contact.id)}
                    onConvertToProspect={() => onConvertToProspect(contact)}
                />
            ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
          <h2 className="text-2xl font-bold mb-2 text-text-primary">Tu libreta de contactos está vacía</h2>
          <p>Añade tu primer contacto para empezar a gestionar tus relaciones y crear prospectos de venta.</p>
        </div>
      )}
    </div>
  );
};

export default ContactsView;