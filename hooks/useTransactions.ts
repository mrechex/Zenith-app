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
import { Transaction } from '../types';

const transactionsCollection = collection(db, 'transactions');

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const q = query(transactionsCollection, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(transactionsData);
    }, (error) => {
      console.error("Error fetching transactions from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      await addDoc(transactionsCollection, {
        ...transaction,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  }, []);

  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    const { id, ...transactionData } = updatedTransaction;
    if (!id) {
        console.error("Cannot update transaction without an ID");
        return;
    }
    const transactionDoc = doc(db, 'transactions', id);
    try {
      await updateDoc(transactionDoc, transactionData);
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    const transactionDoc = doc(db, 'transactions', transactionId);
    try {
      await deleteDoc(transactionDoc);
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  }, []);

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
};