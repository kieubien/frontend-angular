import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  submitted = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts({ is_admin: 'true' }).subscribe((res: any[]) => {
      this.products = res;
      this.cdr.detectChanges();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: Category[]) => {
      this.categories = res;
    });
  }

  filteredProducts() {
    return this.products.filter((p: any) =>
      (!this.filterCategory || p.category_id == Number(this.filterCategory)) &&
      (!this.filterStatus || p.status === this.filterStatus) &&
      (!this.searchText || p.name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  getActiveCount() {
    return this.products.filter((p: any) => p.status === 'active').length;
  }

  getLowStock() {
    return this.products.filter((p: any) => p.stock < 10).length;
  }

  resetFilters() {
    this.filterCategory = '';
    this.filterStatus = '';
    this.searchText = '';
  }

  openModal() {
    this.form = { status: 'active', stock: 0, price: 0, original_price: 0 };
    this.editing = false;
    this.submitted = false;
    this.showModal = true;
  }

  editProduct(p: any) {
    this.form = { ...p };
    this.editing = true;
    this.submitted = false;
    this.showModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormInvalid() {
    // Check required fields
    if (!this.form.name || !this.form.price || !this.form.category_id) return true;
    // Check price logic (giá bán không được > giá gốc nếu giá gốc > 0)
    const p = parseFloat(this.form.price);
    const op = parseFloat(this.form.original_price);
    if (!isNaN(op) && op > 0 && p > op) return true;
    return false;
  }

  saveProduct() {
     this.submitted = true;

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

    // Xử lý logic giá: Nếu giá bán = 0 thì lấy giá gốc
    if ((!this.form.price || parseFloat(this.form.price) === 0) && parseFloat(this.form.original_price) > 0) {
      this.form.price = this.form.original_price;
    }

    // Bắt lỗi triệt để: Giá bán không được lớn hơn giá gốc
    const currentPrice = parseFloat(this.form.price);
    const currentOriginal = parseFloat(this.form.original_price);

    if (!isNaN(currentOriginal) && currentOriginal > 0 && currentPrice > currentOriginal) {
      alert(`Lỗi: Giá bán (${currentPrice.toLocaleString()}đ) không được lớn hơn giá gốc (${currentOriginal.toLocaleString()}đ)!`);
      return;
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
        error: (err: any) => alert(err.error?.error || err.error?.message || 'Có lỗi xảy ra')
      });
    } else {
      this.productService.addProduct(this.form).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.loadProducts();
          this.closeModal();
        },
        error: (err: any) => alert(err.error?.error || err.error?.message || 'Có lỗi xảy ra')
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