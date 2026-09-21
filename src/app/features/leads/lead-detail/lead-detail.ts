import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  lead: Lead | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private crm: CrmService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Lead ID was not provided.';
      this.loading = false;
      return;
    }

    this.crm.getLeads().subscribe({
      next: response => {
        this.lead =
          response.leads.find(
            item => item._id === id
          ) || null;

        if (!this.lead) {
          this.error = 'Lead not found.';
        }

        this.loading = false;
      },

      error: () => {
        this.error = 'Unable to load lead.';
        this.loading = false;
      }
    });
  }
}