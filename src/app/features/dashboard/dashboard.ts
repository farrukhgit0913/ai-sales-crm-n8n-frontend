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
  RouterLink
} from '@angular/router';

import {
  CrmService
} from '../../core/services/crm';

import {
  Lead,
  SystemStatus
} from '../../core/models/crm.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  // =========================
  // STATE
  // =========================

  readonly leads = signal<Lead[]>([]);

  readonly status =
    signal<SystemStatus | null>(null);

  readonly loading =
    signal(false);

  readonly error =
    signal('');


  // =========================
  // COMPUTED
  // =========================

  readonly totalLeads = computed(() => {
    return this.leads().length;
  });


  readonly newLeads = computed(() => {
    return this.leads().filter(
      lead =>
        lead.status?.toLowerCase() === 'new'
    ).length;
  });


  readonly qualifiedLeads = computed(() => {
    return this.leads().filter(
      lead =>
        lead.qualification?.toLowerCase() === 'qualified'
    ).length;
  });


  readonly recentLeads = computed(() => {
    return this.leads().slice(0, 6);
  });


  readonly onlineServices = computed(() => {
    return this.status()
      ?.summary
      ?.online ?? 0;
  });


  readonly totalServices = computed(() => {
    return this.status()
      ?.summary
      ?.total ?? 0;
  });


  readonly allServicesOnline = computed(() => {
    const total =
      this.totalServices();

    return total > 0 &&
      this.onlineServices() === total;
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
    this.loadDashboard();
  }


  // =========================
  // LOAD DASHBOARD
  // =========================

  loadDashboard(): void {

    this.loading.set(true);
    this.error.set('');

    let leadsLoaded = false;
    let statusLoaded = false;

    const finishLoading = () => {

      if (
        leadsLoaded &&
        statusLoaded
      ) {
        this.loading.set(false);
      }

    };


    // -------------------------
    // Leads
    // -------------------------

    this.crm.getLeads()
      .subscribe({

        next: (response) => {

          this.leads.set(
            response?.leads ?? []
          );

          leadsLoaded = true;

          finishLoading();
        },

        error: (error) => {

          console.error(
            'Dashboard leads error:',
            error
          );

          this.error.set(
            'Unable to load leads.'
          );

          leadsLoaded = true;

          finishLoading();
        }

      });


    // -------------------------
    // System Status
    // -------------------------

    this.crm.getSystemStatus()
      .subscribe({

        next: (response) => {

          this.status.set(
            response
          );

          statusLoaded = true;

          finishLoading();
        },

        error: (error) => {

          console.error(
            'Dashboard status error:',
            error
          );

          this.error.set(
            'Unable to load system status.'
          );

          statusLoaded = true;

          finishLoading();
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
  // HELPERS
  // =========================

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