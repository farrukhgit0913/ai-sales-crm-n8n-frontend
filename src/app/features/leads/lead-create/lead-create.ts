import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  CrmService
} from '../../../core/services/crm';

import {
  Lead
} from '../../../core/models/crm.models';

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

    budget: undefined,

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

    this.saving = true;

    this.error = '';

    this.crm.createLead(
      this.lead
    )
    .subscribe({

      next: response => {

        this.saving = false;

        this.router.navigate([
          '/leads',
          response.lead._id
        ]);

      },

      error: error => {

        this.saving = false;

        this.error =
          error?.error?.error ||
          'Unable to create lead.';

      }

    });

  }

  cancel(): void {

    this.router.navigate([
      '/leads'
    ]);

  }

}