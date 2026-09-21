import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  CrmService
} from '../../../core/services/crm';

import {
  SystemStatus
} from '../../../core/models/crm.models';

@Component({
  selector: 'app-workflow-status',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './workflow-status.html',
  styleUrl: './workflow-status.scss'
})
export class WorkflowStatusComponent
  implements OnInit {

  // =========================
  // STATE
  // =========================

  readonly status =
    signal<SystemStatus | null>(null);

  readonly loading =
    signal(false);

  readonly error =
    signal('');


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private readonly crm: CrmService
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadStatus();
  }


  // =========================
  // LOAD STATUS
  // =========================

  loadStatus(): void {

    this.loading.set(true);
    this.error.set('');

    this.crm
      .getSystemStatus()
      .subscribe({

        next: (response: SystemStatus) => {

          this.status.set(response);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Workflow status error:',
            error
          );

          this.error.set(
            'Unable to load workflow status.'
          );

          this.loading.set(false);

        }

      });

  }


  // =========================
  // SERVICE STATUS
  // =========================

  isOnline(
    service: string
  ): boolean {

    return this.status()
      ?.services?.[service]
      ?.status === 'online';

  }


  // =========================
  // STATUS FORMATTER
  // =========================

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
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }

}