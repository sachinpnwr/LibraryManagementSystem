import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  accountInfo: any = {
    fullName: null,
    role: null
  }
  loggedUserName: string | null = null;
  protected usersService = inject(UsersService);

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

  ngOnInit() {
    this.usersService.getAccountInfo().subscribe((s: any) => {
      console.log(s)
      this.accountInfo.fullName = s.fullName;
      this.accountInfo.role = s.role;
    })
  }
}
