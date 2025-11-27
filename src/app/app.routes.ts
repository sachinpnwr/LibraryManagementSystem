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
            // {
            //     path: 'books', loadComponent: () => import('./features/orders/list/order-list.component').then((m) => m.OrderListComponent),
            //     children: [],
            // },
            { path: '', redirectTo: '/login', pathMatch: 'full' },
        ]
    },
];
