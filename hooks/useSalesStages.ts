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
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

const stagesCollection = collection(db, 'salesStages');

export const useSalesStages = () => {
  const [stages, setStages] = useState<string[]>([]);

  useEffect(() => {
    const q = query(stagesCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stagesData = snapshot.docs.map(doc => doc.data().name as string);
      setStages(stagesData);
    }, (error) => {
      console.error("Error fetching stages from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addStage = useCallback(async (newStage: string) => {
    if (!newStage || stages.includes(newStage)) {
        console.error("Stage cannot be empty or a duplicate.");
        return;
    }
    try {
      await addDoc(stagesCollection, {
        name: newStage,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding stage: ", error);
    }
  }, [stages]);

  const updateStage = useCallback(async (oldName: string, newName: string) => {
    if (!oldName || !newName || stages.includes(newName)) {
        console.error("Stage names cannot be empty or a duplicate.");
        return;
    }
    const q = query(stagesCollection, where('name', '==', oldName));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error(`Stage "${oldName}" not found.`);
        return;
      }
      const stageDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'salesStages', stageDoc.id), { name: newName });
    } catch (error) {
      console.error("Error updating stage: ", error);
    }
  }, [stages]);

  const deleteStage = useCallback(async (stageToDelete: string) => {
    const q = query(stagesCollection, where('name', '==', stageToDelete));
    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.error(`Stage "${stageToDelete}" not found.`);
            return;
        }
        // Use a batch to delete all documents with that name, just in case of duplicates
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        console.error("Error deleting stage: ", error);
    }
  }, []);

  return { stages, addStage, updateStage, deleteStage };
};