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
import { Contact } from '../types';

const contactsCollection = collection(db, 'contacts');

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const q = query(contactsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      setContacts(contactsData);
    }, (error) => {
      console.error("Error fetching contacts from Firestore: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addContact = useCallback(async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(contactsCollection, {
        ...contact,
        createdAt: serverTimestamp(),
      });
      return { ...contact, id: docRef.id, createdAt: new Date() } as Contact; // Return the new contact with its ID
    } catch (error) {
      console.error("Error adding contact: ", error);
      return null;
    }
  }, []);

  const updateContact = useCallback(async (updatedContact: Contact) => {
    const { id, ...contactData } = updatedContact;
    if (!id) {
        console.error("Cannot update contact without an ID");
        return;
    }
    const contactDoc = doc(db, 'contacts', id);
    try {
      await updateDoc(contactDoc, contactData);
    } catch (error) {
      console.error("Error updating contact: ", error);
    }
  }, []);

  const deleteContact = useCallback(async (contactId: string) => {
    const contactDoc = doc(db, 'contacts', contactId);
    try {
      await deleteDoc(contactDoc);
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  }, []);

  return { contacts, addContact, updateContact, deleteContact };
};