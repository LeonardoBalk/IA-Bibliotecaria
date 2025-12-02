import { api } from './api';
import type { Message } from '../types';

export const messageService = {
  async getAll(): Promise<Message[]> {
    return api.get<Message[]>('/messages');
  },

  async send(content: string, attachmentUrl?: string): Promise<Message> {
    return api.post<Message>('/messages', { content, attachment_url: attachmentUrl });
  },

  async markAsRead(id: string): Promise<void> {
    return api.put(`/messages/${id}/read`, {});
  },
};
