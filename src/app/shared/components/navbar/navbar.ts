import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';

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
  private cartSub!: Subscription;
  
  isLoggedIn = false;
  userRole = '';
  userName = '';

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router
  ) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    this.checkUser();
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.qty, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  checkUser(): void {
    const userJson = localStorage.getItem('bb_user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.isLoggedIn = true;
      this.userRole = user.role === 1 || user.role === 'admin' ? 'admin' : 'user';
      
      // Better Mojibake fix: only attempt if we see suspect characters
      let decodedName = user.name;
      if (decodedName && /[\u0080-\u00FF]/.test(decodedName)) {
        try {
          decodedName = decodeURIComponent(escape(decodedName));
        } catch (e) { }
      }
      this.userName = decodedName;
    }
  }

  logout(): void {
    localStorage.removeItem('bb_user');
    localStorage.removeItem('bb_token');
    this.isLoggedIn = false;
    this.userRole = '';
    this.userName = '';
    this.router.navigate(['/login']);
  }

  getChildren(categories: Category[], parentId: number): Category[] {
    return categories.filter(c => (c.parent_id || c.parentId) === parentId);
  }

  getRootCategories(categories: Category[]): Category[] {
    return categories.filter(c => !(c.parent_id || c.parentId));
  }
}