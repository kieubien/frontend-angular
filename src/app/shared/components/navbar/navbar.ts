import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {}

  getChildren(categories: Category[], parentId: number): Category[] {
    return categories.filter(c => c.parentId === parentId);
  }

  getRootCategories(categories: Category[]): Category[] {
    return categories.filter(c => !c.parentId);
  }
}