import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        // NUEVA: página para crear un bubble tea.
        path: 'create',
        loadComponent: () => import('./pages/create-bubble-tea/create-bubble-tea').then(m => m.CreateBubbleTea)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then(m => m.Register)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
];
