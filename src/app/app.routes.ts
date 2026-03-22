import { Routes } from '@angular/router';
import { CartComponent } from './features/cart/cart.component/cart.component';
import { HomeComponent } from './features/home/home';
export const routes: Routes = [
    // HOME
    { path: '', component: HomeComponent },

    // PRODUCTS (từ bạn)
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

    // CART (chung)
    { path: 'cart', component: CartComponent },

    // AUTH
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./auth/register/register.component').then((m) => m.RegisterComponent),
    },
];
