import {
   addDocument, 
   getDocuments, 
   updateDocument, 
   deleteDocument, 
   setDocument, 
   getDocument 
  } from './FirestoreService';

class FirestoreController {
  constructor(route) {
    this.route = route;
  }

  async create(data) {
    const id = await addDocument(this.route, data);
    return id;
  }

  async getAll() {
    const documents = await getDocuments(this.route);
    return documents;
  }

  async update(id, data) {
    await updateDocument(this.route, id, data);
  }

  async delete(id) {
    await deleteDocument(this.route, id);
  }

  async upsert(id, data) {
    await setDocument(this.route, id, data);
  }

  async getById(id) {
    const document = await getDocument(this.route, id);
    return document;
  }
  
}

export default FirestoreController;