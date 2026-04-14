import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { adminGuard } from './core/guards/admin.guard';

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
    path: 'order-history',
    loadComponent: () =>
      import('./features/cart/order-history/order-history').then(
        (m) => m.OrderHistoryComponent,
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
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'order-management',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin/order-management/order-management').then((m) => m.OrderManagement),
  },
  {
    path: 'product-management',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin/product-management/product-management').then((m) => m.ProductManagement),
  },
  {
    path: 'category-management',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin/category-management/category-management').then((m) => m.CategoryManagement),
  },
];
