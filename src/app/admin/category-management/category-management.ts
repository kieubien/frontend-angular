import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.html',
  styleUrls: ['./category-management.scss']
})
export class CategoryManagement implements OnInit, OnDestroy {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();
  allCategories: Category[] = [];
  showModal = false;
  editing = false;
  form: any = {};
  private sub = new Subscription();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((cats: Category[]) => {
      this.allCategories = cats;
      this.categoriesSubject.next(cats);
    });
  }



  generateSlug() {
    if (!this.form.name) return;
    // Simple Vietnamese slugify
    let slug = this.form.name.toLowerCase();
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
    slug = slug.replace(/[đÐ]/g, 'd');
    slug = slug.replace(/[^a-z0-9 ]/g, ''); // Remove special chars
    slug = slug.trim().replace(/\s+/g, '-'); // Spaces to dashes
    this.form.slug = slug;
  }

  openModal() {
    this.form = { name: '', slug: '', icon: 'bi-bookmark', status: 'active' };
    this.editing = false;
    this.showModal = true;
  }

  editCategory(cat: Category) {
    this.form = { ...cat };
    if (!this.form.status) this.form.status = 'active';
    this.editing = true;
    this.showModal = true;
  }

  saveCategory() {
    if (!this.form.name) return;

    // Bắt trùng danh mục (Check for duplicate names)
    const isDuplicate = this.allCategories.some(c => 
      c.name.toLowerCase() === this.form.name.toLowerCase() && c.id !== this.form.id
    );

    if (isDuplicate) {
      alert('Danh mục đã tồn tại');
      return;
    }

    // Tự động tạo slug nếu backend cần
    this.generateSlug();

    if (this.editing) {
      this.categoryService.updateCategory(this.form).subscribe({
        next: () => {
          alert('Cập nhật danh mục thành công!');
          this.loadCategories();
          this.closeModal();
        },
        error: (err: any) => {
          const msg = err.error?.error || err.error?.message || 'Lỗi cập nhật danh mục';
          alert('Lỗi: ' + msg);
        }
      });
    } else {
      this.categoryService.addCategory(this.form).subscribe({
        next: () => {
          alert('Đã thêm danh mục mới thành công!');
          this.loadCategories();
          this.closeModal();
        },
        error: (err: any) => {
          const msg = err.error?.error || err.error?.message || 'Lỗi thêm mới danh mục';
          alert('Lỗi: ' + msg);
        }
      });
    }
  }

  deleteCategory(id: number) {
    const category = this.allCategories.find(c => c.id === id);
    
    // Bắt lỗi khi danh mục có sp ko xoá được
    if (category && (category.product_count || 0) > 0) {
      alert(`Không thể xoá! Danh mục "${category.name}" đang có ${category.product_count} sản phẩm. Vui lòng chuyển hoặc xoá sản phẩm trước.`);
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          alert('Xoá danh mục thành công!');
          this.loadCategories();
        },
        error: (err: any) => {
           const msg = err.error?.error || err.error?.message || 'Lỗi khi xoá danh mục';
           alert('Lỗi: ' + msg);
        }
      });
    }
  }

  toggleStatus(cat: Category) {
    const newStatus = cat.status === 'inactive' ? 'active' : 'inactive';
    
    if (newStatus === 'inactive' && (cat.product_count || 0) > 0) {
      if (!confirm(`Danh mục này đang có ${cat.product_count} sản phẩm. Ẩn danh mục sẽ ẩn luôn toàn bộ sản phẩm bên trong khỏi khách hàng. Bạn có chắc chắn muốn ẩn?`)) {
        return;
      }
    }
    
    this.categoryService.updateCategory({ ...cat, status: newStatus }).subscribe({
      next: () => this.loadCategories(),
      error: (err: any) => alert('Lỗi cập nhật trạng thái')
    });
  }

  closeModal() {
    this.showModal = false;
  }
}
