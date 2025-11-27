import { NgClass } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'side-menu',
  imports: [NgClass, RouterLink],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss'
})
export class SideMenuComponent {

  menuList: any = signal([]);
  previousIsMobile: boolean = this.IsTabOrMobile();

  constructor(private router: Router) {
    this.router.events.subscribe(() => this.setActiveMenu());
  }

  setActiveMenu() {
    const currentUrl = this.router.url;

    this.menuList.update((list: any[]) =>
      list.map(item => ({
        ...item,
        isSelected:
          item.pageUrl === '/' || item.pageUrl === '/dashboard'
            ? currentUrl === '/' || currentUrl.startsWith('/dashboard')
            : currentUrl.startsWith(item.pageUrl)
      }))
    );
  }

  autoCollapseSidemenu() {
    if (!document.body.classList.contains('sidebar-collapsed')) {
      document.body.classList.add('sidebar-collapsed');
    }
  }



  hasSelected(items: any[]): boolean {
    return !!items?.some(item => item.isSelected);
  }

  checkView() {

    if (!this.IsTabOrMobile() && this.previousIsMobile) {
      document.body.classList.remove('sidebar-collapsed');
    }
    this.previousIsMobile = this.IsTabOrMobile();
    if (this.IsTabOrMobile()) {
      document.body.classList.add('sidebar-collapsed');
    }
  }

  IsTabOrMobile() {
    if (window.innerWidth < 1200) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.checkView();

    var role = localStorage['selectedRole'];

    if (role == 'admin') {
      this.menuList.set([
        {
          "id": 0,
          "title": "Dashboard",
          "icon": "fa-solid fa-chart-line",
          "pageUrl": "/dashboard",
          "isSelected": false,
          "items": []
        },
        {
          "id": 0,
          "title": "Users",
          "icon": "fa-solid fa-user",
          "pageUrl": "/users",
          "isSelected": false,
          "items": []
        },
        {
          "id": 0,
          "title": "Books",
          "icon": "fa-solid fa-book",
          "pageUrl": "/books",
          "isSelected": false,
          "items": []
        },
      ]);
    }
    else {
      this.menuList.set([
        {
          "id": 0,
          "title": "Dashboard",
          "icon": "fa-solid fa-chart-line",
          "pageUrl": "/dashboard",
          "isSelected": false,
          "items": []
        },
        {
          "id": 0,
          "title": "Users",
          "icon": "fa-solid fa-user",
          "pageUrl": "/users",
          "isSelected": false,
          "items": []
        },
        {
          "id": 0,
          "title": "Books",
          "icon": "fa-solid fa-book",
          "pageUrl": "/books",
          "isSelected": false,
          "items": []
        },
      ]);
    }

    this.setActiveMenu();

  }

  @HostListener("window:resize", [])
  WindowResize() {
    this.checkView();
  }

}
