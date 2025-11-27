import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../../shared/layout/side-menu/side-menu.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayoutComponent {
  isSidebarCollapsed: boolean = false;

  toggleSideMenu() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    document.body.classList.toggle('sidebar-collapsed');
  }

  ngOnInit() {
  }
}
