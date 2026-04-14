import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  featuredProducts: any[] = [];
  isLoading = true;
  activeTab = 'all';
  email = '';

  tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'lipstick', label: 'Son môi' },
    { key: 'skincare', label: 'Chăm sóc da' },
    { key: 'perfume', label: 'Nước hoa' }
  ];

  marqueeItems = [
    'Miễn phí vận chuyển đơn từ 299K',
    'Hoàn tiền 100% nếu phát hiện hàng giả',
    'Tư vấn miễn phí 24/7',
    'Đổi trả trong 30 ngày'
  ];

  stats = [
    { num: '500+', label: 'Sản phẩm' },
    { num: '20K+', label: 'Khách hàng' },
    { num: '15+', label: 'Thương hiệu' }
  ];

  discounts = [
    { value: '30%', label: 'Giảm giá son' },
    { value: '50%', label: 'Deal hời' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });

    this.productService.getProducts({ limit: 8 }).subscribe(res => {
      this.featuredProducts = res;
      this.isLoading = false;
    });
  }

  setTab(key: string) {
    this.activeTab = key;
    this.isLoading = true;
    const filter = key === 'all' ? { limit: 8 } : { category: key, limit: 8 };
    this.productService.getProducts(filter).subscribe(res => {
      this.featuredProducts = res;
      this.isLoading = false;
    });
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  subscribe() {
    if (this.email) {
      alert('Cảm ơn bạn đã đăng ký nhận bản tin!');
      this.email = '';
    }
  }

  getDiscount(p: any): number {
    if (!p.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }
}
