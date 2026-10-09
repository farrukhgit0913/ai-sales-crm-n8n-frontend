import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'ai-sales-crm-n8n';
  profileMenuOpen = false;

  constructor(private router: Router) {}

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    console.log('Profile menu:', this.profileMenuOpen);
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  signOut(): void {
    this.closeProfileMenu();
    sessionStorage.clear();
    this.router.navigate(['/signin']);
  }
}
