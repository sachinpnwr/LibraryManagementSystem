import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../../shared/layout/side-menu/side-menu.component';
import { UsersService } from '@service/usersService';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayoutComponent {
  isSidebarCollapsed: boolean = false;
  accountInfo: any = signal([]);
  loggedUserName: string | null = null;
  protected usersService = inject(UsersService);
  protected router = inject(Router);

  toggleSideMenu() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    document.body.classList.toggle('sidebar-collapsed');
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    const first = parts[0][0].toUpperCase();
    const last = parts[parts.length - 1][0].toUpperCase();

    return first + last;
  }

  onLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    this.usersService.getAccountInfo().subscribe((s: any) => {
      const data = {
        fullName: s.fullName,
        role: s.role,
      }
      this.accountInfo.set(data);
    })
  }
}
