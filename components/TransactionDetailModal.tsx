import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { CloseIcon, TrashIcon } from './Icons';
import { GASTO_CATEGORIES, INGRESO_CATEGORIES } from '../constants';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose, transaction, updateTransaction, deleteTransaction }) => {
  const [formData, setFormData] = useState(transaction);

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      const newType = value as TransactionType;
      const newCategory = newType === TransactionType.GASTO ? GASTO_CATEGORIES[0] : INGRESO_CATEGORIES[0];
      setFormData(prev => ({ ...prev, type: newType, category: newCategory }));
    } else {
      const newValue = name === 'amount' ? parseFloat(value) : value;
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.amount <= 0 || !formData.category.trim()) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }
    updateTransaction(formData);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`¿Seguro que quieres eliminar la transacción "${transaction.title}"?`)) {
      deleteTransaction(transaction.id);
      onClose();
    }
  };

  if (!isOpen) return null;
  
  const currentCategoryList = formData.type === TransactionType.GASTO ? GASTO_CATEGORIES : INGRESO_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Detalles de la Transacción</h2>
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
              <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Monto (€)</label>
              <input
                type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.00" step="0.01" min="0" required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1">Tipo</label>
              <select
                id="type" name="type" value={formData.type} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Categoría</label>
                <select
                    id="category" name="category" value={formData.category} onChange={handleChange}
                    className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
                >
                   {currentCategoryList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Fecha</label>
              <input
                type="date" id="date" name="date" value={formData.date} onChange={handleChange}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
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

export default TransactionDetailModal;