import { useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp, // We can use this for a more reliable timestamp
} from 'firebase/firestore';
import { PomodoroLog } from '../types';

const historyCollection = collection(db, 'pomodoroHistory');

export const usePomodoroHistory = () => {
    const [history, setHistory] = useState<PomodoroLog[]>([]);

    useEffect(() => {
        const q = query(historyCollection, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const historyData = snapshot.docs.map(doc => {
                const data = doc.data();
                // Firestore Timestamps need to be converted to JS Date objects then to a number
                const finalData = {
                    ...data,
                    id: doc.id,
                    timestamp: (data.timestamp?.toDate?.() || new Date()).getTime(),
                };
                return finalData as PomodoroLog;
            });
            setHistory(historyData);
        }, (error) => {
            console.error("Error fetching pomodoro history from Firestore: ", error);
        });

        return () => unsubscribe();
    }, []);

    const addLogEntry = useCallback(async (logEntry: Omit<PomodoroLog, 'id' | 'timestamp'>) => {
        try {
            await addDoc(historyCollection, {
                ...logEntry,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error adding pomodoro log entry: ", error);
        }
    }, []);

    return { history, addLogEntry };
};