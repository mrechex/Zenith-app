export enum TaskStatus {
  POR_HACER = 'Por Hacer',
  EN_PROGRESO = 'En Progreso',
  HECHO = 'Hecho',
}

export enum TaskPriority {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  pomodorosDone?: number;
  totalTimeSpent?: number; // in seconds
  createdAt?: any; 
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt?: any;
}

export interface Prospect {
    id: string;
    contactId: string; // Link to a Contact
    stage: string; 
    notes?: string;
    followUpDate?: string;
    createdAt?: any;
}

export enum GoalHorizon {
    CORTO = 'Corto Plazo',
    MEDIANO = 'Mediano Plazo',
    LARGO = 'Largo Plazo',
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  taskIds: string[];
  horizon: GoalHorizon;
  createdAt?: any;
}

export enum RoutineColor {
    RED = '#ef4444',
    BLUE = '#3b82f6',
    GREEN = '#22c55e',
    YELLOW = '#eab308',
    PURPLE = '#8b5cf6',
    PINK = '#ec4899',
}

export interface RoutineEvent {
    id: string;
    title: string;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    days: number[]; // 0 for Sunday, 1 for Monday, etc.
    color: RoutineColor;
    createdAt?: any;
}

export enum TransactionType {
    INGRESO = 'Ingreso',
    GASTO = 'Gasto',
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
    createdAt?: any;
}

export enum PomodoroSessionType {
    POMODORO = 'Pomodoro',
    SHORT_BREAK = 'Pausa Corta',
    LONG_BREAK = 'Pausa Larga',
}

export interface PomodoroLog {
    id: string;
    timestamp: number;
    type: PomodoroSessionType;
    duration: number; // in seconds
    linkedTask?: {
        id: string;
        title: string;
    };
}

export type ViewType = 'list' | 'kanban' | 'prospects' | 'pomodoro' | 'calendar' | 'goal' | 'finance' | 'contacts' | 'settings';