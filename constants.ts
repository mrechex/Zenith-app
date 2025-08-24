import { TaskStatus } from './types';

export const KANBAN_STATUSES: TaskStatus[] = [
  TaskStatus.POR_HACER,
  TaskStatus.EN_PROGRESO,
  TaskStatus.HECHO,
];

export const GASTO_CATEGORIES: string[] = [
  'Vivienda',
  'Alimentación',
  'Transporte',
  'Servicios',
  'Ocio',
  'Salud',
  'Educación',
  'Compras',
  'Otros',
];

export const INGRESO_CATEGORIES: string[] = [
  'Salario',
  'Ingresos Extra',
  'Inversiones',
  'Regalos',
  'Otros',
];