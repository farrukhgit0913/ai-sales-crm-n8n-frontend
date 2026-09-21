import { Routes } from "@angular/router";

import { DashboardComponent } from "./features/dashboard/dashboard";

import { LeadListComponent } from "./features/leads/lead-list/lead-list";
import { LeadCreateComponent } from "./features/leads/lead-create/lead-create";
import { LeadDetailComponent } from "./features/leads/lead-detail/lead-detail";
import { LeadEditComponent } from "./features/leads/lead-edit/lead-edit";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },

  {
    path: "dashboard",
    component: DashboardComponent,
  },

  {
    path: "leads",
    component: LeadListComponent,
  },

  {
    path: "leads/new",
    component: LeadCreateComponent,
  },

  {
    path: "leads/:id/edit",
    component: LeadEditComponent,
  },

  {
    path: "leads/:id",
    component: LeadDetailComponent,
  },
];
