import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon } from './Icons';

interface TransactionItemProps {
  transaction: Transaction;
  onSelect: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onSelect }) => {
  const isIncome = transaction.type === TransactionType.INGRESO;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div
      onClick={() => onSelect(transaction)}
      className="bg-secondary p-4 rounded-lg border border-border-color flex items-center justify-between hover:border-accent transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {isIncome ? (
            <ArrowUpIcon className="w-5 h-5 text-green-400" />
          ) : (
            <ArrowDownIcon className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div>
          <p className="font-semibold text-text-primary">{transaction.title}</p>
          <p className="text-sm text-text-secondary">{transaction.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-right">
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date(transaction.date).toLocaleDateString()}</span>
        </div>
        <p className={`font-bold text-lg ${isIncome ? 'text-green-400' : 'text-text-primary'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;