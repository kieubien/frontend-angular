import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  categories$: Observable<Category[]>;
  private subs = new Subscription();
  
  isLoggedIn = false;
  userRole = '';
  userName = '';

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    console.log('NavbarComponent: Subscription init');

    this.subs.add(
      this.authService.currentUser$.subscribe(user => {
        console.log('NavbarComponent: User state changed:', user);
        if (user) {
          this.isLoggedIn = true;
          this.userName = user.name;
          this.userRole = user.role;
        } else {
          this.isLoggedIn = false;
          this.userName = '';
          this.userRole = '';
        }
        this.cdr.detectChanges(); // Ép buộc cập nhật giao diện
      })
    );

    this.subs.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartCount = items.reduce((sum, item) => sum + item.qty, 0);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getChildren(categories: Category[], parentId: number): Category[] {
    return categories.filter(c => (c.parent_id || c.parentId) === parentId);
  }

  getRootCategories(categories: Category[]): Category[] {
    return categories.filter(c => !(c.parent_id || c.parentId));
  }
}