import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { CloseIcon } from './Icons';
import { GASTO_CATEGORIES, INGRESO_CATEGORIES } from '../constants';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, addTransaction }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.GASTO);
  const [category, setCategory] = useState(GASTO_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (type === TransactionType.GASTO) {
      setCategory(GASTO_CATEGORIES[0]);
    } else {
      setCategory(INGRESO_CATEGORIES[0]);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || !category.trim()) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    addTransaction({ 
      title, 
      amount: parseFloat(amount), 
      type, 
      category, 
      date 
    });
    // Reset form
    setTitle('');
    setAmount('');
    setType(TransactionType.GASTO);
    setCategory(GASTO_CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Añadir Nueva Transacción</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Título</label>
            <input
              type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Monto (€)</label>
              <input
                type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.00" step="0.01" min="0" required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1">Tipo</label>
              <select
                id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}
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
                    id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
                >
                  {(type === TransactionType.GASTO ? GASTO_CATEGORIES : INGRESO_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Fecha</label>
              <input
                type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300">
              Crear Transacción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;