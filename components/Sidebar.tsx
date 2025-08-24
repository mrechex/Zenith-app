import React from 'react';
import { ViewType } from '../types';
import { ListIcon, KanbanIcon, CalendarIcon, GoalIcon, FinanceIcon, ClockIcon, UsersIcon, BriefcaseIcon, CogIcon } from './Icons';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onNavigate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onNavigate }) => {
    const mainNavItems = [
        { id: 'list' as ViewType, icon: ListIcon, label: 'Tareas' },
        { id: 'kanban' as ViewType, icon: KanbanIcon, label: 'Tablero Kanban' },
        { id: 'contacts' as ViewType, icon: UsersIcon, label: 'Contactos' },
        { id: 'prospects' as ViewType, icon: BriefcaseIcon, label: 'Prospectos' },
        { id: 'calendar' as ViewType, icon: CalendarIcon, label: 'Calendario' },
        { id: 'goal' as ViewType, icon: GoalIcon, label: 'Metas' },
        { id: 'finance' as ViewType, icon: FinanceIcon, label: 'Finanzas' },
        { id: 'pomodoro' as ViewType, icon: ClockIcon, label: 'Pomodoro' },
    ];

    const secondaryNavItems = [
        { id: 'settings' as ViewType, icon: CogIcon, label: 'Ajustes' },
    ];
    
    const handleNavigation = (view: ViewType) => {
        setCurrentView(view);
        onNavigate();
    }
    
    const renderNavList = (items: typeof mainNavItems) => (
         <ul>
          {items.map(item => (
             <li key={item.id}>
              <button 
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  currentView === item.id 
                  ? 'bg-accent text-white' 
                  : 'text-text-secondary hover:bg-border-color hover:text-text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
    );

  return (
    <aside className="bg-secondary p-6 flex flex-col w-64 h-full">
      <h1 className="text-2xl font-bold text-white mb-10">Zenith</h1>
      <nav className="flex-1 flex flex-col justify-between">
        <div>
            <h2 className="text-xs text-text-secondary uppercase font-bold mb-4 px-4">Vistas</h2>
            {renderNavList(mainNavItems)}
        </div>
        <div>
            {renderNavList(secondaryNavItems)}
             <div className="mt-4 text-center text-xs text-text-secondary">
                <p>&copy; 2024 Zenith Corp</p>
            </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;