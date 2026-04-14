import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.scss']
})
export class ProductManagement implements OnInit {

  searchText = '';
  filterCategory = '';
  filterStatus = '';

  showModal = false;
  editing = false;

  form: any = {};
  products: any[] = [];
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  filteredProducts() {
    return this.products.filter(p =>
      (!this.filterCategory || p.category_id == Number(this.filterCategory)) &&
      (!this.filterStatus || p.status === this.filterStatus) &&
      (!this.searchText || p.name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  getActiveCount() {
    return this.products.filter(p => p.status === 'active').length;
  }

  getLowStock() {
    return this.products.filter(p => p.stock < 10).length;
  }

  resetFilters() {
    this.filterCategory = '';
    this.filterStatus = '';
    this.searchText = '';
  }

  openModal() {
    this.form = { status: 'active' };
    this.editing = false;
    this.showModal = true;
  }

  editProduct(p: any) {
    this.form = { ...p };
    this.editing = true;
    this.showModal = true;
  }

  saveProduct() {
     // Tự tạo slug nếu chưa có
     if (!this.form.slug && this.form.name) {
        // Simple Vietnamese slugify
        let slug = this.form.name.toLowerCase();
        slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
        slug = slug.replace(/[đÐ]/g, 'd');
        slug = slug.replace(/[^a-z0-9 ]/g, ''); // Remove special chars
        slug = slug.trim().replace(/\s+/g, '-'); // Spaces to dashes
        this.form.slug = slug;
    }

    if (!this.form.name || !this.form.price || !this.form.category_id) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    if (this.editing) {
      this.productService.updateProduct(this.form.id, this.form).subscribe({
        next: () => {
          alert('Cập nhật thành công!');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => alert(err.error?.error || err.error?.message || 'Có lỗi xảy ra')
      });
    } else {
      this.productService.addProduct(this.form).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => alert(err.error?.error || err.error?.message || 'Có lỗi xảy ra')
      });
    }
  }

  deleteProduct(p: any) {
    if (confirm(`Bạn có chắc muốn xoá sản phẩm "${p.name}"?`)) {
      this.productService.deleteProduct(p.id).subscribe({
        next: () => {
          alert('Đã xoá thành công!');
          this.loadProducts();
        },
        error: (err) => alert(err.error?.error || err.error?.message || 'Có lỗi xảy ra')
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}