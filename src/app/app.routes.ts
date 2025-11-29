import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: '', loadComponent: () => import("./shared/layout/admin-layout/admin-layout.component").then(s => s.AdminLayoutComponent), children: [
            {
                path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'loans', loadComponent: () => import('./features/loans/list/loans-list/loans-list.component').then((m) => m.LoansListComponent),
                children: [],
            },
            {
                path: 'admins', loadComponent: () => import('./features/admins/list/admins-list/admins-list.component').then((m) => m.AdminsListComponent),
                children: [],
            },
            {
                path: 'users', loadComponent: () => import('./features/users/list/users-list/users-list.component').then((m) => m.UsersListComponent),
                children: [],
            },
            {
                path: 'books', loadComponent: () => import('./features/books/list/books-list/books-list.component').then((m) => m.BooksListComponent),
                children: [],
            },
            { path: '', redirectTo: '/login', pathMatch: 'full' },
        ]
    },
];
