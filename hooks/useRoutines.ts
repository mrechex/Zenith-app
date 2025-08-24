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
import { RoutineEvent } from '../types';

const routinesCollection = collection(db, 'routines');

export const useRoutines = () => {
  const [routines, setRoutines] = useState<RoutineEvent[]>([]);

  useEffect(() => {
    const q = query(routinesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const routinesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RoutineEvent[];
      setRoutines(routinesData);
    }, (error) => {
      console.error("Error fetching routines from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addRoutine = useCallback(async (routine: Omit<RoutineEvent, 'id' | 'createdAt'>) => {
    try {
      await addDoc(routinesCollection, {
        ...routine,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding routine: ", error);
    }
  }, []);

  const updateRoutine = useCallback(async (updatedRoutine: RoutineEvent) => {
    const { id, ...routineData } = updatedRoutine;
    if (!id) {
        console.error("Cannot update routine without an ID");
        return;
    }
    const routineDoc = doc(db, 'routines', id);
    try {
      await updateDoc(routineDoc, routineData);
    } catch (error) {
      console.error("Error updating routine: ", error);
    }
  }, []);

  const deleteRoutine = useCallback(async (routineId: string) => {
    const routineDoc = doc(db, 'routines', routineId);
    try {
      await deleteDoc(routineDoc);
    } catch (error) {
      console.error("Error deleting routine: ", error);
    }
  }, []);

  return { routines, addRoutine, updateRoutine, deleteRoutine };
};