import { api } from './api';
import type { Document, Recommendation } from '../types';

export const documentService = {
  async getAll(): Promise<Document[]> {
    return api.get<Document[]>('/documents');
  },

  async getById(id: string): Promise<Document> {
    return api.get<Document>(`/documents/${id}`);
  },

  async getRecommendations(): Promise<Recommendation[]> {
    return api.get<Recommendation[]>('/documents/recommendations');
  },

  async logInteraction(documentId: string, action: string): Promise<void> {
    return api.post('/documents/interactions', { document_id: documentId, action });
  },
};
