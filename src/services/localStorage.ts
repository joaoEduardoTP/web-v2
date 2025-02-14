import { Base, User, Envelope, Protocol, TravelDocument } from '../types';

// Base Service
export const baseService = {
  getBases: async (): Promise<Base[]> => {
    
    const bases = localStorage.getItem('bases');

    return bases ? JSON.parse(bases) : [];
  },

  saveBase: async (base: Base): Promise<Base> => {
    const bases = await baseService.getBases();
    const updatedBases = base.id
      ? bases.map(b => b.id === base.id ? base : b)
      : [...bases, base];
    localStorage.setItem('bases', JSON.stringify(updatedBases));
    return base;
  },

  deleteBase: async (id: string): Promise<void> => {
    const bases = await baseService.getBases();
    const updatedBases = bases.filter(b => b.id !== id);
    localStorage.setItem('bases', JSON.stringify(updatedBases));
  }
};



// User Service
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },

  saveUser: async (user: User): Promise<User> => {
    const users = await userService.getUsers();
    const updatedUsers = user.id
      ? users.map(u => u.id === user.id ? user : u)
      : [...users, user];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return user;
  },

  deleteUser: async (id: string): Promise<void> => {
    const users = await userService.getUsers();
    const updatedUsers = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }
};

// Document Service
export const documentService = {
  getSentDocuments: async (): Promise<Envelope[]> => {
    const docs = localStorage.getItem('sent-documents');
    return docs ? JSON.parse(docs) : [];
  },

  getTravelDocuments: async ():Promise<TravelDocument[]> => { //Promise<TravelDocument[]>
    const docs = localStorage.getItem('travel-documents');
  return docs ? JSON.parse(docs) : [];
  },

  getProtocols: async (): Promise<Protocol[]> => {
    const protocols = localStorage.getItem('protocols');
    return protocols ? JSON.parse(protocols) : [];
  },

  saveSentDocument: async (doc: Envelope): Promise<Envelope> => {
    const docs = await documentService.getSentDocuments();
    const updatedDocs = [...docs, doc];
    localStorage.setItem('sent-documents', JSON.stringify(updatedDocs));
    return doc;
  },

  saveTravelDocument: async (doc: TravelDocument) => { // (doc: TravelDocument): Promise<TravelDocument> => {
    const docs = await documentService.getTravelDocuments();
    const updatedDocs = [...docs, doc];
    localStorage.setItem('travel-documents', JSON.stringify(updatedDocs));
    return doc;
  },

  saveProtocol: async (protocol: Protocol): Promise<Protocol> => {
    const protocols = await documentService.getProtocols();
    const updatedProtocols = [...protocols, protocol];
    localStorage.setItem('protocols', JSON.stringify(updatedProtocols));
    return protocol;
  },

  deleteSentDocument: async (id: string): Promise<void> => {
    const docs = await documentService.getSentDocuments();
    const updatedDocs = docs.filter(d => d.id !== id);
    localStorage.setItem('sent-documents', JSON.stringify(updatedDocs));
  }
};