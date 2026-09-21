import { Component, OnInit, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

import { CrmService } from "../../../core/services/crm";
import { Lead } from "../../../core/models/crm.models";

@Component({
  selector: "app-lead-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./lead-list.html",
  styleUrl: "./lead-list.scss",
})
export class LeadListComponent implements OnInit {
  readonly leads = signal<Lead[]>([]);
  readonly loading = signal(false);
  readonly error = signal("");

  readonly searchTerm = signal("");
  readonly statusFilter = signal("all");
  readonly sourceFilter = signal("all");

  readonly filteredLeads = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const source = this.sourceFilter();

    return this.leads().filter((lead) => {
      const matchesSearch =
        !search ||
        [lead.name, lead.company, lead.email, lead.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));

      const matchesStatus =
        status === "all" || lead.status?.toLowerCase() === status;

      const matchesSource =
        source === "all" || lead.source?.toLowerCase() === source;

      return matchesSearch && matchesStatus && matchesSource;
    });
  });

  readonly resultCount = computed(() => this.filteredLeads().length);

  readonly availableSources = computed(() => {
    const sources = this.leads()
      .map((lead) => lead.source?.trim())
      .filter(Boolean) as string[];

    return [...new Set(sources)].sort();
  });

  ngOnInit(): void {
    this.loadLeads();
  }

  constructor(private readonly crm: CrmService) {}

  loadLeads(): void {
    this.loading.set(true);
    this.error.set("");

    this.crm.getLeads().subscribe({
      next: (response) => {
        this.leads.set(response?.leads ?? []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Load leads error:", error);

        this.error.set(error?.error?.error || "Unable to load leads.");

        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }

  onSourceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sourceFilter.set(select.value);
  }

  clearFilters(): void {
    this.searchTerm.set("");
    this.statusFilter.set("all");
    this.sourceFilter.set("all");
  }

  deleteLead(id: string | undefined): void {
    if (!id) {
      this.error.set("Lead ID is missing.");
      return;
    }

    const lead = this.leads().find((item) => item._id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${lead?.name || "this lead"}?`,
    );

    if (!confirmed) {
      return;
    }

    this.crm.deleteLead(id).subscribe({
      next: () => {
        this.leads.update((current) =>
          current.filter((item) => item._id !== id),
        );
      },

      error: (error) => {
        console.error("Delete lead error:", error);

        this.error.set(error?.error?.error || "Unable to delete lead.");
      },
    });
  }
  formatStatus(status?: string): string {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  getInitials(name?: string): string {
    if (!name?.trim()) {
      return "?";
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
