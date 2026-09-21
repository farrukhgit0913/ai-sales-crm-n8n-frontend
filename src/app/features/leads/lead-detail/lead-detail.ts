import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  CrmService
} from '../../../core/services/crm';

import {
  Lead
} from '../../../core/models/crm.models';

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

  // --------------------------------------------------
  // Lead
  // --------------------------------------------------

  readonly lead = signal<Lead | null>(null);

  readonly loading = signal(false);

  readonly error = signal('');


  // --------------------------------------------------
  // AI Qualification
  // --------------------------------------------------

  readonly aiLoading = signal(false);

  readonly aiError = signal('');

  readonly aiResult = signal<{
    qualification: string;
    score: number;
    reason: string;
    recommendation: string;
    model?: string;
  } | null>(null);


  // --------------------------------------------------
  // Lead ID
  // --------------------------------------------------

  private leadId = '';


  // --------------------------------------------------
  // Constructor
  // --------------------------------------------------

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly crm: CrmService
  ) {}


  // --------------------------------------------------
  // Init
  // --------------------------------------------------

  ngOnInit(): void {

    this.leadId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.leadId) {

      this.error.set(
        'Lead ID is missing.'
      );

      return;
    }

    this.loadLead();
  }


  // --------------------------------------------------
  // Load Lead
  // --------------------------------------------------

  loadLead(): void {

    this.loading.set(true);

    this.error.set('');

    this.crm.getLead(
      this.leadId
    ).subscribe({

      next: (response) => {

        this.lead.set(
          response.lead
        );

        this.loading.set(false);

      },

      error: (error) => {

        console.error(
          'Lead detail error:',
          error
        );

        this.error.set(
          error?.error?.error ||
          'Unable to load lead.'
        );

        this.loading.set(false);

      }

    });
  }


  // --------------------------------------------------
  // AI Qualification
  // --------------------------------------------------

  runAiQualification(): void {

    if (!this.leadId) {
      return;
    }

    this.aiLoading.set(true);

    this.aiError.set('');

    this.aiResult.set(null);

    this.crm
      .qualifyLead(
        this.leadId
      )
      .subscribe({

        next: (response) => {

          this.aiResult.set({

            qualification:
              response.qualification,

            score:
              response.score,

            reason:
              response.reason,

            recommendation:
              response.recommendation,

            model:
              response.model

          });

          this.aiLoading.set(false);

        },

        error: (error) => {

          console.error(
            'AI qualification error:',
            error
          );

          this.aiError.set(
            error?.error?.error ||
            'Unable to qualify this lead.'
          );

          this.aiLoading.set(false);

        }

      });
  }


  // --------------------------------------------------
  // Edit Lead
  // --------------------------------------------------

  editLead(): void {

    this.router.navigate([
      '/leads',
      this.leadId,
      'edit'
    ]);

  }


  // --------------------------------------------------
  // Delete Lead
  // --------------------------------------------------

  deleteLead(): void {

    const currentLead =
      this.lead();

    if (!currentLead) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${currentLead.name || 'this lead'}?`
      );

    if (!confirmed) {
      return;
    }

    this.crm
      .deleteLead(
        this.leadId
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/leads'
          ]);

        },

        error: (error) => {

          console.error(
            'Delete lead error:',
            error
          );

          this.error.set(
            error?.error?.error ||
            'Unable to delete lead.'
          );

        }

      });

  }


  // --------------------------------------------------
  // Initials
  // --------------------------------------------------

  getInitials(
    name?: string
  ): string {

    if (!name?.trim()) {
      return '?';
    }

    const parts =
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 1) {

      return parts[0]
        .substring(0, 2)
        .toUpperCase();

    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  }


  // --------------------------------------------------
  // Format Status
  // --------------------------------------------------

  formatStatus(
    status?: string
  ): string {

    if (!status) {
      return 'Unknown';
    }

    return status
      .replace(
        /[_-]+/g,
        ' '
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()
      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );
  }


  // --------------------------------------------------
  // Format Date
  // --------------------------------------------------

  formatDate(
    date?: string | Date
  ): string {

    if (!date) {
      return '—';
    }

    return new Date(
      date
    ).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );

  }

}