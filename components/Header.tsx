import React from 'react';
import { PlusIcon, MenuIcon } from './Icons';
import { ViewType } from '../types';

interface HeaderProps {
    currentView: ViewType;
    onAdd: () => void;
    onToggleSidebar: () => void;
}

const viewConfig: Record<string, { title: string; subtitle: string; buttonText: string | null; }> = {
    list: {
        title: 'Lista de Tareas',
        subtitle: 'Aquí están todas tus tareas.',
        buttonText: 'Añadir Tarea'
    },
    kanban: {
        title: 'Tablero Kanban',
        subtitle: 'Visualiza tu flujo de trabajo.',
        buttonText: 'Añadir Tarea'
    },
    contacts: {
        title: 'Gestión de Contactos',
        subtitle: 'Tu libreta de direcciones centralizada.',
        buttonText: 'Añadir Contacto'
    },
    prospects: {
        title: 'Gestión de Prospectos',
        subtitle: 'Administra tu ciclo de ventas.',
        buttonText: null
    },
    calendar: {
        title: 'Rutina Semanal',
        subtitle: 'Organiza tus hábitos y bloques de tiempo.',
        buttonText: 'Añadir Rutina'
    },
    goal: {
        title: 'Metas y Objetivos',
        subtitle: 'Define y sigue tu progreso hacia el éxito.',
        buttonText: 'Añadir Meta'
    },
    finance: {
        title: 'Gestor Financiero',
        subtitle: 'Controla tus ingresos y gastos.',
        buttonText: 'Añadir Transacción'
    },
    pomodoro: {
        title: 'Temporizador Pomodoro',
        subtitle: 'Enfócate con ciclos de trabajo y descanso.',
        buttonText: null,
    },
    settings: {
        title: 'Ajustes',
        subtitle: 'Personaliza tu experiencia en la aplicación.',
        buttonText: null,
    }
};

const Header: React.FC<HeaderProps> = ({ currentView, onAdd, onToggleSidebar }) => {
    const config = viewConfig[currentView] || viewConfig.kanban;

    return (
        <header className="bg-primary p-4 md:p-6 flex justify-between items-center border-b border-border-color shrink-0">
            <div className="flex items-center gap-4">
                 <button onClick={onToggleSidebar} className="md:hidden text-text-secondary hover:text-text-primary">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary">{config.title}</h2>
                    <p className="text-sm text-text-secondary hidden sm:block">{config.subtitle}</p>
                </div>
            </div>
            {config.buttonText && (
              <button
                  onClick={onAdd} 
                  className="flex items-center gap-2 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-500 transition-colors duration-300 shadow-lg shadow-purple-900/50">
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">{config.buttonText}</span>
              </button>
            )}
        </header>
    );
};

export default Header;