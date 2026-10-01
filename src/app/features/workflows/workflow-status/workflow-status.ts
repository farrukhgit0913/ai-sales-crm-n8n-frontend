import {
  Component,
  OnInit,
  computed,
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
  // COMPUTED SERVICE COUNTS
  // =========================

  readonly onlineServices = computed(() => {

    const services =
      this.status()?.services ?? {};

    return Object.values(services).filter(
      (service: any) =>
        [
          'online',
          'connected',
          'ready',
          'passed',
          'active',
          'working',
          'configured',
          'healthy',
          'success'
        ].includes(
          String(service?.status || '').toLowerCase()
        )
    ).length;

  });


  readonly totalServices = computed(() => {

    const services =
      this.status()?.services ?? {};

    return Object.keys(services).length;

  });


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

    const status =
      this.status()
        ?.services?.[service]
        ?.status;

    return [
      'online',
      'connected',
      'ready',
      'passed',
      'active',
      'working',
      'configured',
      'healthy',
      'success'
    ].includes(
      String(status || '').toLowerCase()
    );

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