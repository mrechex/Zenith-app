import React from 'react';

interface CategorySpendingItemProps {
  category: string;
  amount: number;
  percentage: number;
}

const CategorySpendingItem: React.FC<CategorySpendingItemProps> = ({ category, amount, percentage }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  const progressBarColor = 'bg-accent';

  return (
    <div className="p-3 rounded-md hover:bg-primary">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="font-semibold text-text-primary">{category}</span>
        <span className="font-bold text-text-primary">{formatCurrency(amount)}</span>
      </div>
      <div className="w-full bg-border-color rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${progressBarColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-text-secondary mt-1">
          {percentage.toFixed(1)}% del total
      </div>
    </div>
  );
};

export default CategorySpendingItem;