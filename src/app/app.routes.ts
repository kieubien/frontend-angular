import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { ClientLayoutComponent } from './shared/layouts/client-layout/client-layout';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  // HỆ THỐNG CLIENT (CÓ HEADER/FOOTER)
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
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
    ]
  },

  // HỆ THỐNG ADMIN (CÓ SIDEBAR)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'orders', // Đổi lại cho gọn: /admin/orders
        loadComponent: () =>
          import('./admin/order-management/order-management').then((m) => m.OrderManagement),
      },
      {
        path: 'products', // /admin/products
        loadComponent: () =>
          import('./admin/product-management/product-management').then((m) => m.ProductManagement),
      },
      {
        path: 'categories', // /admin/categories
        loadComponent: () =>
          import('./admin/category-management/category-management').then((m) => m.CategoryManagement),
      },
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
