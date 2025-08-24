import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import TransactionItem from './TransactionItem';
import CategorySpendingItem from './CategorySpendingItem';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface FinanceViewProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
}

type ViewMode = 'monthly' | 'yearly';

const FinanceView: React.FC<FinanceViewProps> = ({ transactions, onSelectTransaction }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (viewMode === 'monthly') {
        return transactionDate.getFullYear() === currentDate.getFullYear() &&
               transactionDate.getMonth() === currentDate.getMonth();
      } else { // yearly
        return transactionDate.getFullYear() === currentDate.getFullYear();
      }
    });
  }, [transactions, currentDate, viewMode]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INGRESO)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.GASTO)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [filteredTransactions]);

  const categorySpending = useMemo(() => {
    if (totalExpenses === 0) return [];

    const spendingByCategory = filteredTransactions
      .filter(t => t.type === TransactionType.GASTO)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(spendingByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);

  }, [filteredTransactions, totalExpenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleDateChange = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'monthly') {
        newDate.setMonth(newDate.getMonth() + offset);
      } else {
        newDate.setFullYear(newDate.getFullYear() + offset);
      }
      return newDate;
    });
  };

  const displayDate = useMemo(() => {
    if (viewMode === 'monthly') {
      return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
    return currentDate.getFullYear().toString();
  }, [currentDate, viewMode]);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      {/* Controles de Fecha y Vista */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 sm:gap-4 bg-secondary p-2 rounded-lg">
          <button onClick={() => handleDateChange(-1)} className="p-2 rounded-md hover:bg-border-color"><ChevronLeftIcon /></button>
          <span className="font-bold text-base md:text-lg text-text-primary w-32 sm:w-40 text-center capitalize">{displayDate}</span>
          <button onClick={() => handleDateChange(1)} className="p-2 rounded-md hover:bg-border-color"><ChevronRightIcon /></button>
        </div>
        <div className="flex items-center bg-secondary p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${viewMode === 'monthly' ? 'bg-accent text-white' : 'text-text-secondary hover:bg-border-color'}`}
          >
            Mensual
          </button>
          <button 
            onClick={() => setViewMode('yearly')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${viewMode === 'yearly' ? 'bg-accent text-white' : 'text-text-secondary hover:bg-border-color'}`}
          >
            Anual
          </button>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-secondary p-6 rounded-lg border border-border-color">
          <h3 className="text-text-secondary text-sm font-semibold mb-2">Balance del Período</h3>
          <p className={`text-2xl md:text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="bg-secondary p-6 rounded-lg border border-border-color">
          <h3 className="text-text-secondary text-sm font-semibold mb-2">Ingresos del Período</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-secondary p-6 rounded-lg border border-border-color">
          <h3 className="text-text-secondary text-sm font-semibold mb-2">Gastos del Período</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
      
      {/* Desglose de Gastos y Transacciones */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-text-primary">Gastos por Categoría</h2>
            <div className="bg-secondary p-4 rounded-lg border border-border-color space-y-3">
              {categorySpending.length > 0 ? (
                categorySpending.map(item => (
                  <CategorySpendingItem 
                    key={item.category}
                    category={item.category}
                    amount={item.amount}
                    percentage={item.percentage}
                  />
                ))
              ) : (
                <p className="text-text-secondary text-center py-4">No hay gastos en este período.</p>
              )}
            </div>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold mb-4 text-text-primary">Historial de Transacciones</h2>
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  onSelect={onSelectTransaction} 
                />
              ))
            ) : (
              <div className="text-center py-12 text-text-secondary bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold text-text-primary">No hay transacciones</h3>
                <p>No se encontraron registros para el período seleccionado.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default FinanceView;