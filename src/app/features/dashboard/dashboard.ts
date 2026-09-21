import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  CrmService
} from '../../core/services/crm';

import {
  Lead,
  SystemStatus
} from '../../core/models/crm.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent
  implements OnInit {

  leads: Lead[] = [];

  status: SystemStatus | null = null;

  loading = true;

  error = '';

  constructor(
    private crm: CrmService
  ) {}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.loading = true;

    this.crm.getLeads()
      .subscribe({

        next: (response: any) => {

          this.leads =
            response.leads;

        },

        error: () => {

          this.error =
            'Unable to load leads.';

        }

      });

    this.crm.getSystemStatus()
      .subscribe({

        next: (response: any) => {

          this.status =
            response;

          this.loading =
            false;

        },

        error: () => {

          this.error =
            'Unable to load system status.';

          this.loading =
            false;

        }

      });

  }

  get totalLeads(): number {
    return this.leads.length;
  }

  get newLeads(): number {

    return this.leads.filter(
      lead => lead.status === 'new'
    ).length;

  }

  get qualifiedLeads(): number {

    return this.leads.filter(
      lead =>
        lead.status === 'qualified'
    ).length;

  }

  isOnline(
    service: string
  ): boolean {

    return this.status
      ?.services?.[service]
      ?.status === 'online';

  }

}