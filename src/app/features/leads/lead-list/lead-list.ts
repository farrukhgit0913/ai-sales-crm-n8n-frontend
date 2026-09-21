import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  CrmService
} from '../../../core/services/crm';

import {
  Lead
} from '../../../core/models/crm.models';

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
export class LeadListComponent
  implements OnInit {

  leads: Lead[] = [];

  search = '';

  loading = true;

  constructor(
    private crm: CrmService
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {

    this.loading = true;

    this.crm.getLeads()
      .subscribe({

        next: response => {

          this.leads =
            response.leads;

          this.loading =
            false;

        },

        error: () => {

          this.loading =
            false;

        }

      });

  }

  get filteredLeads(): Lead[] {

    const query =
      this.search
        .trim()
        .toLowerCase();

    if (!query) {
      return this.leads;
    }

    return this.leads.filter(
      lead =>
        lead.name
          ?.toLowerCase()
          .includes(query) ||

        lead.company
          ?.toLowerCase()
          .includes(query) ||

        lead.email
          ?.toLowerCase()
          .includes(query)
    );

  }

}