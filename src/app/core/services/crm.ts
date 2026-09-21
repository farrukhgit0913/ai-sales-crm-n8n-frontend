import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService
} from './api';

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

  constructor(
    private api: ApiService
  ) {}

  // -----------------------------------------------
  // System
  // -----------------------------------------------

  getHealth(): Observable<HealthResponse> {
    return this.api.get<HealthResponse>(
      '/health'
    );
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.api.get<SystemStatus>(
      '/status'
    );
  }

  // -----------------------------------------------
  // Leads
  // -----------------------------------------------

  getLeads(): Observable<LeadsResponse> {
    return this.api.get<LeadsResponse>(
      '/leads'
    );
  }

  createLead(
    lead: Lead
  ): Observable<LeadResponse> {

    return this.api.post<LeadResponse>(
      '/leads',
      lead
    );

  }

  // -----------------------------------------------
  // AI
  // -----------------------------------------------

  testAi(
    prompt: string
  ): Observable<AiTestResponse> {

    return this.api.post<AiTestResponse>(
      '/ai/test',
      {
        prompt
      }
    );

  }

  // -----------------------------------------------
  // n8n
  // -----------------------------------------------

  sendLeadToN8n(
    lead: Lead
  ): Observable<any> {

    return this.api.post(
      '/n8n/lead',
      lead
    );

  }

  // -----------------------------------------------
  // Email
  // -----------------------------------------------

  testEmail(
    data: {
      to?: string;
      subject?: string;
      text?: string;
    }
  ): Observable<any> {

    return this.api.post(
      '/email/test',
      data
    );

  }

}