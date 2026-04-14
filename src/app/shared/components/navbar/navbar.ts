import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  categories$: Observable<Category[]>;
  
  isLoggedIn = false;
  userRole = '';
  userName = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    this.checkUser();
  }

  checkUser(): void {
    const userJson = localStorage.getItem('bb_user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.isLoggedIn = true;
      this.userRole = user.role;
      this.userName = user.name;
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