// FirestoreController.ts
import {
  addDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument, 
  setDocument, 
  getDocument 
} from './FirestoreService';

// Define the structure of Firestore data
type FirestoreData = Record<string, any>;

class FirestoreController {
  private route: string;

  constructor(route: string) {
    this.route = route;
  }

  // Create a new document in the Firestore collection
  async create(data: FirestoreData): Promise<string | undefined> {
    const id = await addDocument(this.route, data);
    return id;
  }

  // Get all documents from the Firestore collection
  async getAll(): Promise<FirestoreData[]> {
    const documents = await getDocuments(this.route);
    return documents;
  }

  // Update a specific document by its ID
  async update(id: string, data: FirestoreData): Promise<void> {
    await updateDocument(this.route, id, data);
  }

  // Delete a specific document by its ID
  async delete(id: string): Promise<void> {
    await deleteDocument(this.route, id);
  }

  // Upsert (set or update) a document by its ID
  async upsert(id: string, data: FirestoreData): Promise<void> {
    await setDocument(this.route, id, data);
  }

  // Get a document by its ID
  async getById(id: string): Promise<FirestoreData | null> {
    const document = await getDocument(this.route, id);
    return document;
  }
}

export default FirestoreController;