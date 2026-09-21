import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CrmService } from '../../../core/services/crm';
import { Lead } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.scss'
})
export class LeadListComponent implements OnInit {

  /*
   * =========================
   * State
   * =========================
   */

  readonly leads = signal<Lead[]>([]);

  readonly search = signal('');

  readonly loading = signal(false);

  readonly error = signal('');


  /*
   * =========================
   * Computed
   * =========================
   */

  readonly filteredLeads = computed(() => {

    const leads = this.leads();

    const term = this.search()
      .trim()
      .toLowerCase();

    if (!term) {
      return leads;
    }

    return leads.filter((lead) => {

      const name =
        lead.name?.toLowerCase() ?? '';

      const company =
        lead.company?.toLowerCase() ?? '';

      const email =
        lead.email?.toLowerCase() ?? '';

      const status =
        lead.status?.toLowerCase() ?? '';

      const requirement =
        lead.requirement?.toLowerCase() ?? '';

      return (
        name.includes(term) ||
        company.includes(term) ||
        email.includes(term) ||
        status.includes(term) ||
        requirement.includes(term)
      );
    });
  });


  /*
   * =========================
   * Constructor
   * =========================
   */

  constructor(
    private readonly crm: CrmService
  ) {}


  /*
   * =========================
   * Lifecycle
   * =========================
   */

  ngOnInit(): void {
    this.loadLeads();
  }


  /*
   * =========================
   * API
   * =========================
   */

  loadLeads(): void {

    this.loading.set(true);

    this.error.set('');

    this.crm.getLeads().subscribe({

      next: (response) => {

        console.log(
          'Lead API response:',
          response
        );

        this.leads.set(
          response?.leads ?? []
        );

        this.loading.set(false);
      },


      error: (error: unknown) => {

        console.error(
          'Lead API error:',
          error
        );

        this.loading.set(false);

        this.error.set(
          this.getErrorMessage(error)
        );
      }

    });
  }


  /*
   * =========================
   * Search
   * =========================
   */

  setSearch(value: string): void {
    this.search.set(value);
  }


  clearSearch(): void {
    this.search.set('');
  }


  /*
   * =========================
   * Status
   * =========================
   */

  formatStatus(status?: string): string {

    if (!status) {
      return 'Unknown';
    }

    return status
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }


  getStatusClass(status?: string): string {

    const normalizedStatus =
      status?.trim().toLowerCase();

    switch (normalizedStatus) {

      case 'new':
        return 'status-new';

      case 'qualified':
        return 'status-qualified';

      case 'contacted':
        return 'status-contacted';

      case 'proposal':
        return 'status-proposal';

      case 'negotiation':
        return 'status-negotiation';

      case 'converted':
      case 'won':
        return 'status-converted';

      case 'lost':
        return 'status-lost';

      default:
        return 'status-default';
    }
  }


  /*
   * =========================
   * Track rows
   * =========================
   */

  trackByLeadId(
    index: number,
    lead: Lead
  ): string | number {

    return lead._id ?? index;
  }


  /*
   * =========================
   * Error handling
   * =========================
   */

  private getErrorMessage(
    error: unknown
  ): string {

    if (!error) {
      return 'Unable to load leads.';
    }


    if (typeof error === 'string') {
      return error;
    }


    if (typeof error === 'object') {

      const apiError = error as {
        message?: string;

        error?: {
          message?: string;
          error?: string;
        };
      };


      if (
        apiError.error &&
        typeof apiError.error === 'object' &&
        apiError.error.message
      ) {
        return apiError.error.message;
      }


      if (
        apiError.error &&
        typeof apiError.error === 'object' &&
        apiError.error.error
      ) {
        return apiError.error.error;
      }


      if (apiError.message) {
        return apiError.message;
      }
    }


    return 'Unable to load leads.';
  }

}