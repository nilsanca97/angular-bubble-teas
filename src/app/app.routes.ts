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
        // NUEVA: página para editar un bubble tea. El :id viaja en la URL
        // y llega al componente como input (gracias a withComponentInputBinding).
        path: 'edit/:id',
        loadComponent: () => import('./pages/edit-bubble-tea/edit-bubble-tea').then(m => m.EditBubbleTea)
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
