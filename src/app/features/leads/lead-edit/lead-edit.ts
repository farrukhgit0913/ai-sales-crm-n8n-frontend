import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CrmService } from '../../../core/services/crm';
import { Lead } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './lead-edit.html',
  styleUrl: './lead-edit.scss'
})
export class LeadEditComponent implements OnInit {

  readonly loading = signal(false);
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

  private leadId = '';

  constructor(
    private readonly crm: CrmService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.leadId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.leadId) {
      this.error.set('Lead ID is missing.');
      return;
    }

    this.loadLead();
  }

  loadLead(): void {
    this.loading.set(true);
    this.error.set('');

    this.crm.getLead(this.leadId).subscribe({
      next: (response) => {
        const lead = response?.lead;

        if (!lead) {
          this.error.set('Lead not found.');
          this.loading.set(false);
          return;
        }

        this.name.set(lead.name ?? '');
        this.company.set(lead.company ?? '');
        this.email.set(lead.email ?? '');
        this.phone.set(lead.phone ?? '');

        this.budget.set(
          lead.budget !== undefined &&
          lead.budget !== null
            ? Number(lead.budget)
            : null
        );

        this.status.set(
          lead.status ?? 'new'
        );

        this.requirement.set(
          lead.requirement ?? ''
        );

        this.loading.set(false);
      },

      error: (error: unknown) => {
        console.error(
          'Load lead error:',
          error
        );

        this.loading.set(false);
        this.error.set(
          'Unable to load lead.'
        );
      }
    });
  }

  updateLead(): void {
    this.error.set('');
    this.success.set('');

    if (!this.name().trim()) {
      this.error.set(
        'Lead name is required.'
      );
      return;
    }

    if (!this.email().trim()) {
      this.error.set(
        'Email is required.'
      );
      return;
    }

    const payload: Partial<Lead> = {
      name: this.name().trim(),
      company: this.company().trim(),
      email: this.email().trim(),
      phone: this.phone().trim(),
      budget: this.budget() ?? undefined,
      status: this.status(),
      requirement: this.requirement().trim()
    };

    this.saving.set(true);

    console.log(
      'Updating lead:',
      this.leadId,
      payload
    );

    this.crm.updateLead(
      this.leadId,
      payload
    ).subscribe({
      next: (response) => {
        console.log(
          'Lead updated:',
          response
        );

        this.saving.set(false);
        this.success.set(
          'Lead updated successfully.'
        );

        setTimeout(() => {
          this.router.navigate([
            '/leads',
            this.leadId
          ]);
        }, 500);
      },

      error: (error: unknown) => {
        console.error(
          'Update lead error:',
          error
        );

        this.saving.set(false);
        this.error.set(
          'Unable to update lead.'
        );
      }
    });
  }

  cancel(): void {
    this.router.navigate([
      '/leads',
      this.leadId
    ]);
  }
}