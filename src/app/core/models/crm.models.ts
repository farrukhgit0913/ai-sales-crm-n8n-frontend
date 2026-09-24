export interface Lead {

  _id?: string;

  name: string;

  company?: string;

  email: string;

  phone?: string;

  budget?: number;

  requirement?: string;

  message?: string;

  status: string;

  source: string;

  qualification?: 'Qualified' | 'Unqualified';

  score?: number;

  summary?: string;

  nextAction?: string;

  emailSubject?: string;

  emailBody?: string;

  createdAt?: string;

  updatedAt?: string;

}

export interface LeadsResponse {

  success: boolean;

  count: number;

  leads: Lead[];

}

export interface LeadResponse {

  success: boolean;

  lead: Lead;

}

export interface ServiceStatus {

  name: string;

  status: string;

  url?: string;

  version?: string;

  model?: string;

  database?: string;

  description?: string;

  message?: string;

  models?: string[];

  qwen3Installed?: boolean;

  installed?: boolean;

  endpoint?: string;

  smtp?: string;

}

export interface SystemStatus {

  success: boolean;

  timestamp: string;

  summary: {

    online: number;

    total: number;

  };

  services: {

    [key: string]: ServiceStatus;

  };

}

export interface AiTestResponse {

  success: boolean;

  model: string;

  response: string;

}

export interface HealthResponse {

  success: boolean;

  message: string;

  timestamp: string;

}