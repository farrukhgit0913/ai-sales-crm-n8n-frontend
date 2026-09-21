import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'leads',
    loadComponent: () =>
      import('./features/leads/lead-list/lead-list')
        .then(m => m.LeadListComponent)
  },
  {
    path: 'leads/new',
    loadComponent: () =>
      import('./features/leads/lead-create/lead-create')
        .then(m => m.LeadCreateComponent)
  },
  {
    path: 'leads/:id',
    loadComponent: () =>
      import('./features/leads/lead-detail/lead-detail')
        .then(m => m.LeadDetailComponent)
  },
  {
    path: 'ai',
    loadComponent: () =>
      import('./features/ai/ai-test/ai-test')
        .then(m => m.AiTestComponent)
  },
  {
    path: 'workflows',
    loadComponent: () =>
      import('./features/workflows/workflow-status/workflow-status')
        .then(m => m.WorkflowStatusComponent)
  },
  {
    path: 'email',
    loadComponent: () =>
      import('./features/email/email-test/email-test')
        .then(m => m.EmailTestComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];