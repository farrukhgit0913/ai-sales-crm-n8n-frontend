import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrmService } from '../../../core/services/crm';
import { Lead } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lead-create.html',
  styleUrl: './lead-create.scss'
})
export class LeadCreateComponent {
  lead: Lead = {
    name: '',
    company: '',
    email: '',
    phone: '',
    budget: 0,
    requirement: '',
    message: '',
    status: 'new',
    source: 'website'
  };

  saving = false;
  error = '';

  constructor(
    private crm: CrmService,
    private router: Router
  ) {}

  submit(): void {
    this.error = '';

    if (!this.lead.name.trim() || !this.lead.email.trim()) {
      this.error = 'Name and email are required.';
      return;
    }

    this.saving = true;

    this.crm.createLead(this.lead).subscribe({
      next: (response) => {
        this.saving = false;

        if (response.success && response.lead?._id) {
          this.router.navigate(['/leads', response.lead._id]);
        } else {
          this.error = 'Lead was created but no lead ID was returned.';
        }
      },
      error: (error: unknown) => {
        this.saving = false;

        console.error('Create lead error:', error);

        this.error =
          error instanceof Error
            ? error.message
            : 'Unable to create lead.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/leads']);
  }
}