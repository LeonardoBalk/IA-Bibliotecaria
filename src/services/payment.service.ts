import { api } from './api';
import type { Plan, Subscription } from '../types';

export const paymentService = {
  async getPlans(): Promise<Plan[]> {
    return api.get<Plan[]>('/plans');
  },

  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    return api.post('/payments/checkout', { plan_id: planId });
  },

  async getSubscription(): Promise<Subscription> {
    return api.get<Subscription>('/subscriptions/me');
  },

  async cancelSubscription(): Promise<void> {
    return api.post('/subscriptions/cancel', {});
  },
};
