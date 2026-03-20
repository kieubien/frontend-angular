import { Routes } from '@angular/router';
import { CartComponent } from './features/cart/cart.component/cart.component';

export const routes: Routes = [
  { path: 'cart', component: CartComponent },
  // AUTH
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
];

