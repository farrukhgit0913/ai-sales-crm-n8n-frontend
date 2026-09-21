import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CrmService } from '../../../core/services/crm';
import { Lead } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './lead-detail.html',
  styleUrl: './lead-detail.scss'
})
export class LeadDetailComponent implements OnInit {

  /*
   * =========================
   * State
   * =========================
   */

  readonly lead = signal<Lead | null>(null);

  readonly loading = signal(false);

  readonly error = signal('');

  readonly deleting = signal(false);

  readonly deleteError = signal('');


  private leadId = '';


  constructor(
    private readonly crm: CrmService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}


  /*
   * =========================
   * Lifecycle
   * =========================
   */

  ngOnInit(): void {

    this.leadId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.leadId) {

      this.error.set(
        'Lead ID was not provided.'
      );

      return;
    }

    this.loadLead();
  }


  /*
   * =========================
   * Load Lead
   * =========================
   */

  loadLead(): void {

    if (!this.leadId) {
      return;
    }

    this.loading.set(true);

    this.error.set('');

    this.crm.getLead(this.leadId).subscribe({

      next: (response) => {

        console.log(
          'Lead detail response:',
          response
        );

        /*
         * Supports:
         *
         * { lead: {...} }
         *
         * or directly:
         *
         * {...}
         */

        const lead =
          response?.lead ?? response;

        this.lead.set(
          lead as Lead
        );

        this.loading.set(false);
      },


      error: (error: unknown) => {

        console.error(
          'Lead detail error:',
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
   * Delete Lead
   * =========================
   */

  deleteLead(): void {

    const currentLead =
      this.lead();

    if (!currentLead?._id) {
      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${currentLead.name}"?`
      );


    if (!confirmed) {
      return;
    }


    this.deleting.set(true);

    this.deleteError.set('');


    this.crm.deleteLead(
      currentLead._id
    ).subscribe({

      next: () => {

        this.deleting.set(false);

        this.router.navigate([
          '/leads'
        ]);
      },


      error: (error: unknown) => {

        console.error(
          'Delete lead error:',
          error
        );

        this.deleting.set(false);

        this.deleteError.set(
          this.getErrorMessage(error)
        );
      }

    });
  }


  /*
   * =========================
   * Status
   * =========================
   */

  formatStatus(
    status?: string
  ): string {

    if (!status) {
      return 'Unknown';
    }

    return status
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );
  }


  getStatusClass(
    status?: string
  ): string {

    switch (
      status?.trim().toLowerCase()
    ) {

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
   * Error handling
   * =========================
   */

  private getErrorMessage(
    error: unknown
  ): string {

    if (!error) {
      return 'Something went wrong.';
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


    return 'Something went wrong.';
  }

}