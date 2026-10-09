
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

  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
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
      });
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

    void this.router.navigate(['/signin']);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}