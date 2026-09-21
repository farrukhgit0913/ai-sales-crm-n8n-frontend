import { Injectable } from '@angular/core';

import { ApiService } from './api';

import {
  Lead,
  LeadsResponse,
  LeadResponse,
  SystemStatus,
  AiTestResponse,
  HealthResponse
} from '../models/crm.models';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  constructor(private api: ApiService) {}

  getHealth() {
    return this.api.get<HealthResponse>('/health');
  }

  getSystemStatus() {
    return this.api.get<SystemStatus>('/status');
  }

  getLeads() {
    return this.api.get<LeadsResponse>('/leads');
  }

  createLead(lead: Lead) {
    return this.api.post<LeadResponse>('/leads', lead);
  }

  testAi(prompt: string) {
    return this.api.post<AiTestResponse>('/ai/test', {
      prompt
    });
  }

  sendLeadToN8n(lead: Lead) {
    return this.api.post<unknown>('/n8n/lead', lead);
  }

  testEmail(data: {
    to: string;
    subject: string;
    text: string;
  }) {
    return this.api.post<{
      success: boolean;
      message?: string;
      error?: string;
    }>('/email/test', data);
  }
}