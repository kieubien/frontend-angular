import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: any[] = [];
  products: any[] = [];
  isLoading = true;
  activeTab = 'featured';
  email = '';

  tabs = [
    { key: 'featured', label: 'Bán chạy' },
    { key: 'newest', label: 'Mới nhất' },
    { key: 'sale', label: 'Khuyến mãi' }
  ];

  marqueeItems = [
    'Miễn phí vận chuyển đơn từ 299K',
    'Hoàn tiền 100% nếu phát hiện hàng giả',
    'Tư vấn miễn phí 24/7',
    'Đổi trả trong 30 ngày',
    'MAC Cosmetics', 'Dior Beauty', 'YSL Beauty'
  ];

  stats = [
    { num: '500+', label: 'Sản phẩm' },
    { num: '20K+', label: 'Khách hàng' },
    { num: '50+', label: 'Thương hiệu' }
  ];

  discounts = [
    { value: '30%', label: 'Giảm giá son' },
    { value: '50%', label: 'Deal hời' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });

    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods || [];
        this.updateFeaturedProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
        this.isLoading = false;
        this.products = [];
      }
    });
  }

  updateFeaturedProducts(): void {
    if (!this.products) {
      this.featuredProducts = [];
      return;
    }

    if (this.activeTab === 'newest') {
      this.featuredProducts = [...this.products]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 8);
    } 
    else if (this.activeTab === 'sale') {
      this.featuredProducts = this.products
        .filter(p => p.badge === 'sale' || p.original_price)
        .slice(0, 8);
    } 
    else {
      // Mặc định là Featured/Bán chạy
      this.featuredProducts = this.products.slice(0, 8);
    }
  }

  setTab(key: string) {
    this.activeTab = key;
    this.updateFeaturedProducts();
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng! 💖`);
  }

  subscribe() {
    if (this.email) {
      alert('Cảm ơn bạn đã đăng ký nhận bản tin!');
      this.email = '';
    }
  }

  getDiscount(p: any): number {
    const original = p.original_price || p.originalPrice;
    if (!original) return 0;
    return Math.round((1 - p.price / original) * 100);
  }
}
