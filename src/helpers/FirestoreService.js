import { db } from '../src/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const getDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

const updateDocument = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  console.log(docRef)
  console.log(data)
  try {
    await updateDoc(docRef, data);
    console.log('Document updated with ID: ', id);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

const getDocument = async (route, id) => {
  const docRef = doc(db, route, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};


const deleteDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  try {
    await deleteDoc(docRef);
    console.log('Document deleted with ID: ', id);
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};

const setDocument = async (route, id, data) => {
  const docRef = doc(db, route, id);

  try {
    await setDoc(docRef, data, { merge: true });
    console.log('Document written with ID: ', id);
  } catch (e) {
    console.error('Error writing document: ', e);
  }
};

export { 
  addDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument,
  getDocument,
  setDocument
};