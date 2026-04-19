import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.html',
  styleUrls: ['./category-management.scss']
})
export class CategoryManagement implements OnInit {
  categories$: Observable<Category[]>;
  allCategories: Category[] = [];
  showModal = false;
  editing = false;
  form: any = {};

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categories$ = this.categoryService.getCategories();
    this.categories$.subscribe(cats => {
      this.allCategories = cats;
    });
  }



  generateSlug() {
    if (!this.form.name) return;

    let slug = this.form.name.toLowerCase();
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
    slug = slug.replace(/[đÐ]/g, 'd');
    slug = slug.replace(/[^a-z0-9 ]/g, ''); // Remove special chars
    slug = slug.trim().replace(/\s+/g, '-'); // Spaces to dashes
    this.form.slug = slug;
  }

  openModal() {
    this.form = { name: '', slug: '', icon: 'bi-bookmark' };
    this.editing = false;
    this.showModal = true;
  }

  editCategory(cat: Category) {
    this.form = { ...cat };
    this.editing = true;
    this.showModal = true;
  }

  saveCategory() {
    if (this.editing) {
      this.categoryService.updateCategory(this.form).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          const msg = err.error?.error || err.error?.message || 'Lỗi cập nhật danh mục';
          alert('Lỗi: ' + msg);
        }
      });
    } else {
      if (!this.form.slug) {
        this.generateSlug();
      }
      this.categoryService.addCategory(this.form).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          const msg = err.error?.error || err.error?.message || 'Lỗi thêm mới danh mục';
          alert('Lỗi: ' + msg);
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert('Lỗi: ' + JSON.stringify(err))
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
