import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CrmService } from '../../../core/services/crm';

interface SystemStatusResponse {
  status?: string;
  message?: string;
  workflows?: unknown[];
  [key: string]: unknown;
}

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

  readonly loading = signal(false);

  readonly error = signal('');

  readonly status = signal<SystemStatusResponse | null>(null);


  constructor(
    private readonly crm: CrmService
  ) {}


  ngOnInit(): void {
    this.loadStatus();
  }


  loadStatus(): void {

    this.loading.set(true);

    this.error.set('');

    this.crm.getSystemStatus().subscribe({

      next: (response: SystemStatusResponse) => {

        console.log(
          'System status response:',
          response
        );

        this.status.set(response);

        this.loading.set(false);
      },


      error: (error: unknown) => {

        console.error(
          'System status error:',
          error
        );

        this.loading.set(false);

        this.error.set(
          'Unable to load system status.'
        );
      }

    });
  }

}