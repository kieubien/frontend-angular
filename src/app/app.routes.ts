import { Routes } from '@angular/router';
import { CartComponent } from './features/cart/cart-page/cart.component';
import { CheckoutComponent } from './features/cart/checkout/checkout.component';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart-page/cart.component').then(
        (m) => m.CartComponent,
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/cart/checkout/checkout.component').then(
        (m) => m.CheckoutComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: 'order-management',
    loadComponent: () =>
      import('./admin/order-management/order-management').then((m) => m.OrderManagementComponent),
  },
  {
    path: 'product-management',
    loadComponent: () =>
      import('./admin/product-management/product-management').then((m) => m.ProductManagementComponent),
  },
];
