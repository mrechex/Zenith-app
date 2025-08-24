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
import { Prospect } from '../types';

const prospectsCollection = collection(db, 'prospects');

export const useProspects = (defaultStage: string) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);

  useEffect(() => {
    const q = query(prospectsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prospectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Prospect[];
      setProspects(prospectsData);
    }, (error) => {
      console.error("Error fetching prospects from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addProspect = useCallback(async (prospect: Omit<Prospect, 'id' | 'createdAt' | 'stage'> & { stage?: string }) => {
    try {
      await addDoc(prospectsCollection, {
        ...prospect,
        stage: prospect.stage || defaultStage,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding prospect: ", error);
    }
  }, [defaultStage]);

  const updateProspect = useCallback(async (updatedProspect: Prospect) => {
    const { id, ...prospectData } = updatedProspect;
    if (!id) {
        console.error("Cannot update prospect without an ID");
        return;
    }
    const prospectDoc = doc(db, 'prospects', id);
    try {
      await updateDoc(prospectDoc, prospectData);
    } catch (error) {
      console.error("Error updating prospect: ", error);
    }
  }, []);

  const deleteProspect = useCallback(async (prospectId: string) => {
    const prospectDoc = doc(db, 'prospects', prospectId);
    try {
      await deleteDoc(prospectDoc);
    } catch (error) {
      console.error("Error deleting prospect: ", error);
    }
  }, []);

  return { prospects, addProspect, updateProspect, deleteProspect };
};