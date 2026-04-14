import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
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

  getCategoryName(id?: number): string {
    if (!id) return '-';
    return this.allCategories.find(c => c.id === id)?.name || '-';
  }

  openModal() {
    this.form = { name: '', slug: '', icon: 'bi-bookmark', parent_id: null };
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
        error: (err) => alert('Lỗi: ' + JSON.stringify(err))
      });
    } else {
      this.categoryService.addCategory(this.form).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => alert('Lỗi: ' + JSON.stringify(err))
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
