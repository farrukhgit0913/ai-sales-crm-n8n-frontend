import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  Lead,
  SystemStatus
} from "../models/crm.models";

export interface EmailTestResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface SystemStatusResponse {
  [key: string]: unknown;
}

export interface AiTestResponse {
  success: boolean;
  model: string;
  response: string;
}

@Injectable({
  providedIn: "root",
})
export class CrmService {
  private readonly apiUrl = "http://localhost:3000/api";

  constructor(private readonly http: HttpClient) {}

  // =========================
  // SYSTEM
  // =========================

getSystemStatus() {
  return this.http.get<SystemStatus>(
    `${this.apiUrl}/status`
  );
}

  // =========================
  // AI
  // =========================

  testAi(prompt: string) {
    return this.http.post<AiTestResponse>(`${this.apiUrl}/ai/test`, {
      prompt,
    });
  }

  triggerN8nLead(payload: Partial<Lead>) {
    return this.http.post<{
      success: boolean;
      n8n?: unknown;
      error?: unknown;
    }>(
      `${this.apiUrl}/n8n/lead`,
      payload,
    );
  }

  // =========================
  // EMAIL
  // =========================

  testEmail(payload: { to: string; subject: string; text: string }) {
    return this.http.post<EmailTestResponse>(
      `${this.apiUrl}/email/test`,
      payload,
    );
  }

  // =========================
  // LEADS
  // =========================

  getLeads() {
    return this.http.get<{
      leads: Lead[];
    }>(`${this.apiUrl}/leads`);
  }

  getLead(id: string) {
    return this.http.get<{
      lead: Lead;
    }>(`${this.apiUrl}/leads/${id}`);
  }

  createLead(payload: Partial<Lead>) {
    return this.http.post<{
      lead: Lead;
    }>(`${this.apiUrl}/leads`, payload);
  }

  updateLead(id: string, payload: Partial<Lead>) {
    return this.http.put<{
      lead: Lead;
    }>(`${this.apiUrl}/leads/${id}`, payload);
  }

  deleteLead(id: string) {
    return this.http.delete(`${this.apiUrl}/leads/${id}`);
  }

  qualifyLead(id: string) {
    return this.http.post<{
      success: boolean;
      qualification: string;
      score: number;
      reason: string;
      recommendation: string;
      model?: string;
    }>(`${this.apiUrl}/leads/${id}/qualify`, {});
  }
}
