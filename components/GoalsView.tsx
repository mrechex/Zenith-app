import React from 'react';
import { Goal, Task, GoalHorizon } from '../types';
import GoalCard from './GoalCard';

interface GoalsViewProps {
  goals: Goal[];
  tasks: Task[];
  onSelectGoal: (goal: Goal) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, tasks, onSelectGoal }) => {
  const shortTermGoals = goals.filter(g => g.horizon === GoalHorizon.CORTO);
  const mediumTermGoals = goals.filter(g => g.horizon === GoalHorizon.MEDIANO);
  const longTermGoals = goals.filter(g => g.horizon === GoalHorizon.LARGO);

  const renderGoalSection = (title: string, subtitle: string, goalList: Goal[]) => {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4 text-text-primary border-b-2 border-border-color pb-2">
          {title} <span className="text-base font-normal text-text-secondary">{subtitle}</span>
        </h2>
        {goalList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {goalList.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal}
                tasks={tasks}
                onSelect={onSelectGoal} 
              />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary px-2">No hay metas definidas para este horizonte.</p>
        )}
      </section>
    );
  };
  
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      {goals.length > 0 ? (
        <div className="space-y-12">
          {renderGoalSection('Corto Plazo', '(Este Trimestre)', shortTermGoals)}
          {renderGoalSection('Mediano Plazo', '(Este Año)', mediumTermGoals)}
          {renderGoalSection('Largo Plazo', '(Más Allá)', longTermGoals)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
          <h2 className="text-2xl font-bold mb-2 text-text-primary">Define tu primera meta</h2>
          <p>Las metas te ayudan a organizar tus tareas y a seguir tu progreso. ¡Haz clic en "Añadir Meta" para empezar!</p>
        </div>
      )}
    </div>
  );
};

export default GoalsView;