import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Task, TaskStatus } from '../types';

const tasksCollection = collection(db, 'tasks');

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(tasksCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    }, (error) => {
      console.error("Error fetching tasks from Firestore: ", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'status' | 'pomodorosDone' | 'totalTimeSpent' | 'createdAt'>) => {
    try {
      await addDoc(tasksCollection, {
        ...task,
        status: TaskStatus.POR_HACER,
        pomodorosDone: 0,
        totalTimeSpent: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }, []);

  const updateTask = useCallback(async (updatedTask: Task) => {
    const { id, ...taskData } = updatedTask;
    if (!id) {
        console.error("Cannot update task without an ID");
        return;
    }
    const taskDoc = doc(db, 'tasks', id);
    try {
      await updateDoc(taskDoc, taskData);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    const taskDoc = doc(db, 'tasks', taskId);
    try {
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  }, []);

  return { tasks, addTask, updateTask, deleteTask };
};