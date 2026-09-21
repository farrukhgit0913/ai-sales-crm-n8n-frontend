import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmService } from '../../../core/services/crm';
import { SystemStatus } from '../../../core/models/crm.models';

@Component({
  selector: 'app-workflow-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './workflow-status.html',
  styleUrl: './workflow-status.scss'
})
export class WorkflowStatusComponent implements OnInit {

  status: SystemStatus | null = null;

  loading = true;

  error = '';

  constructor(
    private crm: CrmService
  ) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {

    this.loading = true;

    this.crm.getSystemStatus()
      .subscribe({

        next: response => {

          this.status = response;
          this.loading = false;

        },

        error: () => {

          this.error =
            'Unable to load service status.';

          this.loading = false;

        }

      });
  }

  isOnline(
    service: string
  ): boolean {

    return this.status
      ?.services?.[service]
      ?.status === 'online';
  }

  serviceName(
    service: string
  ): string {

    return this.status
      ?.services?.[service]
      ?.name || service;

  }

}