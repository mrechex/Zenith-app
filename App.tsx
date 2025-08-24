import React, { useState, useMemo, useEffect } from 'react';
import { Task, Prospect, ViewType, Goal, RoutineEvent, Transaction, Contact } from './types';
import { GoogleGenAI } from "@google/genai";
import { useTasks } from './hooks/useTasks';
import { useContacts } from './hooks/useContacts';
import { useProspects } from './hooks/useProspects';
import { useSalesStages } from './hooks/useSalesStages';
import { useGoals } from './hooks/useGoals';
import { useRoutines } from './hooks/useRoutines';
import { useTransactions } from './hooks/useTransactions';
import { usePomodoroHistory } from './hooks/usePomodoroHistory';
import { usePomodoro } from './hooks/usePomodoro';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskView from './components/TaskView';
import KanbanView from './components/KanbanView';
import ContactsView from './components/ContactsView';
import ProspectsView from './components/ProspectsView';
import CalendarView from './components/CalendarView';
import GoalsView from './components/GoalsView';
import FinanceView from './components/FinanceView';
import PomodoroView from './components/PomodoroView';
import SettingsView from './components/SettingsView';
import AddTaskModal from './components/AddTaskModal';
import AddProspectModal from './components/AddProspectModal';
import AddGoalModal from './components/AddGoalModal';
import AddRoutineModal from './components/AddRoutineModal';
import AddTransactionModal from './components/AddTransactionModal';
import ContactDetailModal from './components/ContactDetailModal';
import TaskDetailModal from './components/TaskDetailModal';
import ProspectDetailModal from './components/ProspectDetailModal';
import GoalDetailModal from './components/GoalDetailModal';
import RoutineDetailModal from './components/RoutineDetailModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import CopilotModal from './components/CopilotModal';
import { SparklesIcon } from './components/Icons';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('zenith-theme') || 'dark');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('zenith-accent') || 'purple');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineEvent | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const [contactToMakeProspect, setContactToMakeProspect] = useState<Contact | null>(null);

  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { contacts, addContact, updateContact, deleteContact } = useContacts();
  const { stages, addStage, updateStage, deleteStage } = useSalesStages();
  const { prospects, addProspect, updateProspect, deleteProspect } = useProspects(stages[0] || 'Nuevo');
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useRoutines();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { history, addLogEntry } = usePomodoroHistory();
  
  const pomodoroState = usePomodoro({
    tasks,
    updateTask,
    addLogEntry
  });

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle light/dark theme
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('zenith-theme', theme);

    // Handle accent color theme
    for (const className of Array.from(root.classList)) {
        if (className.startsWith('theme-')) {
            root.classList.remove(className);
        }
    }
    root.classList.add(`theme-${accentColor}`);
    localStorage.setItem('zenith-accent', accentColor);
  }, [theme, accentColor]);

  const handleOpenContactModal = (contact: Contact | null) => {
      setSelectedContact(contact);
      setIsContactModalOpen(true);
  };
  
  const handleCloseContactModal = () => {
      setSelectedContact(null);
      setIsContactModalOpen(false);
  };

  const handleAddClick = () => {
    switch (currentView) {
      case 'contacts':
        handleOpenContactModal(null);
        break;
      case 'prospects':
        alert("Para añadir un prospecto, primero crea un contacto en la vista de 'Contactos' y luego conviértelo en prospecto.");
        break;
      case 'goal':
        setIsGoalModalOpen(true);
        break;
      case 'calendar':
        setIsRoutineModalOpen(true);
        break;
      case 'finance':
        setIsTransactionModalOpen(true);
        break;
      case 'list':
      case 'kanban':
      default:
        setIsTaskModalOpen(true);
        break;
    }
  };

  const handleAddStage = (newStageName: string) => {
    if (!newStageName.trim() || stages.includes(newStageName.trim())) {
      alert("El nombre de la etapa no puede estar vacío o duplicado.");
      return;
    }
    addStage(newStageName.trim());
  };

  const handleUpdateStage = (oldName: string, newName: string) => {
    if (!newName.trim() || (stages.includes(newName.trim()) && newName.trim() !== oldName)) {
        alert("El nombre de la etapa no puede estar vacío o duplicado.");
        return;
    }
    prospects.forEach(p => {
        if (p.stage === oldName) {
            updateProspect({ ...p, stage: newName.trim() });
        }
    });
    updateStage(oldName, newName.trim());
  };

  const handleDeleteStage = (stageToDelete: string) => {
    if (stages.length <= 1) {
        alert("Debe haber al menos una etapa.");
        return;
    }
    if (confirm(`¿Seguro que quieres eliminar la etapa "${stageToDelete}"? Los prospectos en esta etapa se moverán a la primera etapa.`)) {
        const defaultStage = stages.find(s => s !== stageToDelete);
        if (!defaultStage) return;

        prospects.forEach(p => {
            if (p.stage === stageToDelete) {
                updateProspect({ ...p, stage: defaultStage });
            }
        });
        deleteStage(stageToDelete);
    }
  };
  
  const handleAddProspect = (prospectData: Omit<Prospect, 'id' | 'contactId'>) => {
    if (!contactToMakeProspect) return;
    addProspect({
        ...prospectData,
        contactId: contactToMakeProspect.id,
    });
    setContactToMakeProspect(null); // Close modal
  };

  const selectedContactForProspect = useMemo(() => {
    if (!selectedProspect) return undefined;
    return contacts.find(c => c.id === selectedProspect.contactId);
  }, [selectedProspect, contacts]);

  const handleClearAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los datos de la aplicación? Esta acción es irreversible.')) {
        localStorage.clear();
        window.location.reload();
    }
  };

  const handleExportData = () => {
    const dataToExport: { [key: string]: string | null } = {};
    const keysToExport = [
      'zenith-tasks',
      'zenith-contacts',
      'zenith-sales-stages',
      'zenith-prospects',
      'zenith-goals',
      'zenith-routines',
      'zenith-transactions',
      'zenith-pomodoro-history',
      'zenith-theme',
      'zenith-accent',
    ];

    keysToExport.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        dataToExport[key] = item;
      }
    });

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenith-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonString: string) => {
      if (!window.confirm('¿Estás seguro de que quieres importar estos datos? Esto sobreescribirá todos los datos actuales de la aplicación. Se recomienda hacer una copia de seguridad primero.')) {
          return;
      }

      try {
          const dataToImport = JSON.parse(jsonString);
          Object.keys(dataToImport).forEach(key => {
              if (dataToImport[key] !== null && typeof dataToImport[key] === 'string') {
                  localStorage.setItem(key, dataToImport[key]);
              }
          });
          alert('Datos importados con éxito. La aplicación se recargará.');
          window.location.reload();
      } catch (error) {
          console.error('Error al importar los datos:', error);
          alert('El archivo de importación no es válido o está corrupto. No se realizaron cambios.');
      }
  };

  const renderView = () => {
    switch(currentView) {
        case 'list':
            return <TaskView tasks={tasks} onDeleteTask={deleteTask} onSelectTask={setSelectedTask} />;
        case 'kanban':
            return <KanbanView tasks={tasks} onDeleteTask={deleteTask} onSelectTask={setSelectedTask} updateTask={updateTask} />;
        case 'contacts':
            return <ContactsView 
                        contacts={contacts}
                        onSelectContact={handleOpenContactModal}
                        onDeleteContact={deleteContact}
                        onConvertToProspect={setContactToMakeProspect}
                    />;
        case 'prospects':
            return (
              <ProspectsView 
                prospects={prospects}
                contacts={contacts}
                stages={stages}
                updateProspect={updateProspect}
                onDeleteProspect={deleteProspect} 
                onSelectProspect={setSelectedProspect}
                onAddStage={handleAddStage}
                onUpdateStage={handleUpdateStage}
                onDeleteStage={handleDeleteStage}
              />
            );
        case 'calendar':
            return <CalendarView routines={routines} onSelectRoutine={setSelectedRoutine} />;
        case 'goal':
            return <GoalsView goals={goals} tasks={tasks} onSelectGoal={setSelectedGoal} />;
        case 'finance':
            return <FinanceView transactions={transactions} onSelectTransaction={setSelectedTransaction} />;
        case 'pomodoro':
            return (
                <PomodoroView 
                    tasks={tasks} 
                    updateTask={updateTask}
                    history={history}
                    {...pomodoroState}
                />
            );
        case 'settings':
            return (
                <SettingsView 
                    currentTheme={theme}
                    onSetTheme={setTheme}
                    currentAccent={accentColor}
                    onSetAccent={setAccentColor}
                    onClearData={handleClearAllData}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                />
            );
        default:
            return <KanbanView tasks={tasks} onDeleteTask={deleteTask} onSelectTask={setSelectedTask} updateTask={updateTask} />;
    }
  }

  return (
    <div className="flex h-screen bg-primary font-sans overflow-hidden">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} onNavigate={() => setIsSidebarOpen(false)} />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentView={currentView} 
          onAdd={handleAddClick} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <div className="flex-1 overflow-auto">
            {renderView()}
        </div>
      </main>

      {/* Add Modals */}
      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        addTask={addTask}
      />
      {contactToMakeProspect && (
        <AddProspectModal
          isOpen={!!contactToMakeProspect}
          onClose={() => setContactToMakeProspect(null)}
          addProspect={handleAddProspect}
          contact={contactToMakeProspect}
          stages={stages}
        />
      )}
      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        addGoal={addGoal}
        tasks={tasks}
      />
       <AddRoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        addRoutine={addRoutine}
      />
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        addTransaction={addTransaction}
      />

      {/* Detail/Edit Modals */}
      <ContactDetailModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        contact={selectedContact}
        addContact={addContact}
        updateContact={updateContact}
      />
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          updateTask={updateTask}
        />
      )}
      {selectedProspect && (
        <ProspectDetailModal
          isOpen={!!selectedProspect}
          onClose={() => setSelectedProspect(null)}
          prospect={selectedProspect}
          contact={selectedContactForProspect}
          updateProspect={updateProspect}
          stages={stages}
        />
      )}
      {selectedGoal && (
        <GoalDetailModal
            isOpen={!!selectedGoal}
            onClose={() => setSelectedGoal(null)}
            goal={selectedGoal}
            tasks={tasks}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
        />
      )}
       {selectedRoutine && (
        <RoutineDetailModal
            isOpen={!!selectedRoutine}
            onClose={() => setSelectedRoutine(null)}
            routine={selectedRoutine}
            updateRoutine={updateRoutine}
            deleteRoutine={deleteRoutine}
        />
      )}
      {selectedTransaction && (
        <TransactionDetailModal
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
        />
      )}
      
      {/* AI Copilot */}
      <button 
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-8 right-8 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-purple-500 transition-all duration-300 z-40 transform hover:scale-110"
        aria-label="Abrir Asistente IA"
      >
        <SparklesIcon className="w-8 h-8" />
      </button>

      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        ai={ai}
        context={{ tasks, goals, transactions, prospects, contacts }}
      />
    </div>
  );
}

export default App;
