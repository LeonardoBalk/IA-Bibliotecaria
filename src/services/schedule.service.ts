import { api } from './api';
import type { ScheduleEvent } from '../types';

export const scheduleService = {
  async getEvents(): Promise<ScheduleEvent[]> {
    return api.get<ScheduleEvent[]>('/schedule');
  },

  async createEvent(data: Partial<ScheduleEvent>): Promise<ScheduleEvent> {
    return api.post<ScheduleEvent>('/schedule', data);
  },

  async cancelEvent(id: string): Promise<void> {
    return api.delete(`/schedule/${id}`);
  },

  async getAvailableSlots(date: string): Promise<string[]> {
    return api.get<string[]>(`/schedule/available?date=${date}`);
  },
};
