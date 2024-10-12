// helpers/firestoreHelpers.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

// Define a generic type for data that will be used in documents
type FirestoreData = Record<string, any>;

// Add a document to a collection
export const addDocument = async (
  collectionName: string,
  data: FirestoreData
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Get all documents from a collection
export const getDocuments = async (
  collectionName: string
): Promise<FirestoreData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents: FirestoreData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

// Update a document by ID
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: FirestoreData
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  try {
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

// Get a single document by ID
export const getDocument = async (
  route: string,
  id: string
): Promise<FirestoreData | null> => {
  const docRef = doc(db, route, id);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FirestoreData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
};

// Delete a document by ID
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  try {
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

// Set a document (merge if exists)
export const setDocument = async (
  route: string,
  id: string,
  data: FirestoreData
): Promise<void> => {
  const docRef = doc(db, route, id);
  try {
    await setDoc(docRef, data, { merge: true });
    console.log("Document written with ID: ", id);
  } catch (e) {
    console.error("Error writing document: ", e);
  }
};
