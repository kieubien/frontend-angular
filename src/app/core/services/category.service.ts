import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [
    { id: 1, name: 'Son môi', slug: 'son-moi', productCount: 128, icon: 'bi-flower1' },
    { id: 11, name: 'Son lì', slug: 'son-li', parentId: 1 },
    { id: 12, name: 'Son bóng', slug: 'son-bong', parentId: 1 },
    { id: 2, name: 'Má hồng', slug: 'ma-hong', productCount: 64, icon: 'bi-palette' },
    { id: 3, name: 'Trang điểm mắt', slug: 'trang-diem-mat', productCount: 96, icon: 'bi-eye' },
    { id: 31, name: 'Phấn mắt', slug: 'phan-mat', parentId: 3 },
    { id: 32, name: 'Kẻ mắt', slug: 'ke-mat', parentId: 3 },
    { id: 4, name: 'Dưỡng da', slug: 'duong-da', productCount: 85, icon: 'bi-droplet' },
    { id: 5, name: 'Gift Set', slug: 'gift-set', productCount: 32, icon: 'bi-gift' },
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);

  constructor() {}

  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const newCategory = {
      ...category,
      id: this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1,
      productCount: 0
    };
    this.categories = [...this.categories, newCategory];
    this.categoriesSubject.next(this.categories);
  }

  updateCategory(category: Category): void {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = { ...category };
      this.categories = [...this.categories];
      this.categoriesSubject.next(this.categories);
    }
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(c => c.id !== id);
    this.categoriesSubject.next(this.categories);
  }
}
