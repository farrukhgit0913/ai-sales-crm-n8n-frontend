import { Component, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CrmService } from '../../../core/services/crm';
import { Lead } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lead-create.html',
  styleUrl: './lead-create.scss',
})
export class LeadCreateComponent {
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly name = signal('');
  readonly company = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly budget = signal<number | null>(null);
  readonly status = signal('new');
  readonly requirement = signal('');

  constructor(
    private readonly crm: CrmService,
    private readonly router: Router,
  ) {}

  createLead(): void {
    this.error.set('');
    this.success.set('');

    if (!this.name().trim()) {
      this.error.set('Lead name is required.');
      return;
    }

    if (!this.email().trim()) {
      this.error.set('Email is required.');
      return;
    }

    const payload: Partial<Lead> = {
      name: this.name().trim(),
      company: this.company().trim(),
      email: this.email().trim(),
      phone: this.phone().trim(),
      budget: this.budget() ?? undefined,
      status: this.status(),
      requirement: this.requirement().trim(),
    };

    this.saving.set(true);

    console.log('Creating lead:', payload);

    this.crm.createLead(payload).subscribe({
      next: (response) => {
        console.log('Lead created:', response);

        const lead = response?.lead;
        const leadId = lead?._id;

        if (!leadId) {
          this.saving.set(false);
          this.error.set('Lead was created but no lead ID was returned.');
          return;
        }

        /*
         * Trigger AI workflow after MongoDB creation.
         *
         * IMPORTANT:
         * Send the MongoDB-generated _id to n8n.
         */
        const n8nPayload: Partial<Lead> = {
          ...lead,
          _id: leadId,
        };

        console.log('Triggering n8n AI workflow:', n8nPayload);

        this.crm.triggerN8nLead(n8nPayload).subscribe({
          next: (n8nResponse) => {
            console.log('n8n workflow completed:', n8nResponse);

            this.saving.set(false);
            this.success.set('Lead created and AI analysis completed successfully.');

            setTimeout(() => {
              this.router.navigate(['/leads', leadId]);
            }, 700);
          },

          error: (error) => {
            console.error('n8n workflow error:', error);

            /*
             * The lead already exists in MongoDB.
             * Do not tell the user that lead creation failed.
             */
            this.saving.set(false);

            this.success.set('Lead created successfully, but AI analysis could not be completed.');

            setTimeout(() => {
              this.router.navigate(['/leads', leadId]);
            }, 1000);
          },
        });
      },

      error: (error: unknown) => {
        console.error('Create lead error:', error);

        this.saving.set(false);

        this.error.set(this.getErrorMessage(error));
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/leads']);
  }

  private getErrorMessage(error: unknown): string {
    if (!error) {
      return 'Unable to create lead.';
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

      if (apiError.error && typeof apiError.error === 'object' && apiError.error.message) {
        return apiError.error.message;
      }

      if (apiError.error && typeof apiError.error === 'object' && apiError.error.error) {
        return apiError.error.error;
      }

      if (apiError.message) {
        return apiError.message;
      }
    }

    return 'Unable to create lead.';
  }
}
