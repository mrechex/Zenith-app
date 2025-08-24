import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { CloseIcon } from './Icons';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null; // null for adding, object for editing
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ isOpen, onClose, contact, addContact, updateContact }) => {
  const [formData, setFormData] = useState({
      name: '',
      company: '',
      email: '',
      phone: '',
      notes: '',
  });
  
  const isEditing = contact !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: contact.name,
        company: contact.company,
        email: contact.email || '',
        phone: contact.phone || '',
        notes: contact.notes || '',
      });
    } else {
      setFormData({ name: '', company: '', email: '', phone: '', notes: '' });
    }
  }, [contact, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) {
        alert("El nombre y la empresa son obligatorios.");
        return;
    }

    if (isEditing) {
      updateContact({ ...contact, ...formData });
    } else {
      addContact(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">{isEditing ? 'Editar Contacto' : 'Añadir Nuevo Contacto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nombre</label>
              <input
                type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">Empresa</label>
              <input
                type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input
                type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Teléfono</label>
              <input
                type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">Notas</label>
            <textarea
              id="notes" name="notes" value={formData.notes} onChange={handleChange}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300">
              {isEditing ? 'Guardar Cambios' : 'Crear Contacto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactDetailModal;