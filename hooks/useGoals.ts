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
import { Goal } from '../types';

const goalsCollection = collection(db, 'goals');

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const q = query(goalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[];
      setGoals(goalsData);
    }, (error) => {
      console.error("Error fetching goals from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    try {
      await addDoc(goalsCollection, {
        ...goal,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding goal: ", error);
    }
  }, []);

  const updateGoal = useCallback(async (updatedGoal: Goal) => {
    const { id, ...goalData } = updatedGoal;
    if (!id) {
        console.error("Cannot update goal without an ID");
        return;
    }
    const goalDoc = doc(db, 'goals', id);
    try {
      await updateDoc(goalDoc, goalData);
    } catch (error) {
      console.error("Error updating goal: ", error);
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    const goalDoc = doc(db, 'goals', goalId);
    try {
      await deleteDoc(goalDoc);
    } catch (error) {
      console.error("Error deleting goal: ", error);
    }
  }, []);

  return { goals, addGoal, updateGoal, deleteGoal };
};