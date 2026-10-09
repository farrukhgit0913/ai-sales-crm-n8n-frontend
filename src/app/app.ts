
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  title = 'ai-sales-crm-n8n';

  profileMenuOpen = false;
  showAppLayout = true;

  currentUser: AuthUser | null = null;

  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.updateLayout();

    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateLayout();
        this.closeProfileMenu();

        // Refresh user information after navigation.
        this.loadCurrentUser();
      });
  }

  private loadCurrentUser(): void {
    try {
      const storedUser = sessionStorage.getItem('auth_user');

      if (!storedUser) {
        this.currentUser = null;
        return;
      }

      const user: unknown = JSON.parse(storedUser);

      if (
        typeof user !== 'object' ||
        user === null ||
        !('id' in user) ||
        !('name' in user) ||
        !('email' in user) ||
        typeof user.id !== 'string' ||
        typeof user.name !== 'string' ||
        typeof user.email !== 'string'
      ) {
        this.currentUser = null;
        return;
      }

      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch {
      this.currentUser = null;
    }
  }

  getUserInitials(): string {
    const name = this.currentUser?.name?.trim();

    if (!name) {
      return 'U';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  private updateLayout(): void {
    const url = this.router.url.split('?')[0].split('#')[0];

    this.showAppLayout =
      url !== '/signin' &&
      url !== '/signup';
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  signOut(): void {
    this.closeProfileMenu();

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');

    this.currentUser = null;

    void this.router.navigate(['/signin']);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}