import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FooterComponent } from '../../shared/components/footer/footer';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  featuredProducts: any[] = [];
  products: any[] = [];
  isLoading = true;
  activeTab = 'featured';
  email = '';

  //  HERO STATS 
  stats = [
    { num: '500+', label: 'Sản phẩm' },
    { num: '50+', label: 'Thương hiệu' },
    { num: '20K+', label: 'Khách hàng' },
  ];

  //  MARQUEE 
  marqueeItems = [
    'Miễn phí ship đơn từ 299K', 'MAC Cosmetics', 'Charlotte Tilbury',
    'NARS', 'Dior Beauty', 'YSL Beauty', 'Đổi trả 30 ngày', '100% Chính hãng',
    'Miễn phí ship đơn từ 299K', 'MAC Cosmetics', 'Charlotte Tilbury',
    'NARS', 'Dior Beauty', 'YSL Beauty', 'Đổi trả 30 ngày', '100% Chính hãng',
  ];

  //  CATEGORIES 
  categories: Category[] = [];

  //  TABS 
  tabs = [
    { key: 'featured', label: 'Bán chạy' },
    { key: 'newest', label: 'Mới nhất' },
    { key: 'sale', label: 'Khuyến mãi' },
  ];

  //  DISCOUNTS 
  discounts = [
    { value: '30%', label: 'Son môi' },
    { value: '50%', label: 'Mắt' },
  ];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Load Categories
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    // Load Products
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.updateFeaturedProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
        this.isLoading = false;
      }
    });
  }

  // Cập nhật danh sách hiển thị dựa trên Tab
  updateFeaturedProducts(): void {
    if (this.activeTab === 'newest') {
      this.featuredProducts = [...this.products]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
    } 
    else if (this.activeTab === 'sale') {
      this.featuredProducts = this.products
        .filter(p => p.badge === 'sale' || p.original_price)
        .slice(0, 4);
    } 
    else {
      // Mặc định là Featured/Bán chạy
      this.featuredProducts = this.products.slice(0, 4);
    }
  }

  setTab(key: string): void {
    this.activeTab = key;
    this.updateFeaturedProducts();
  }

  //  CALC DISCOUNT 
  getDiscount(p: any): number {
    if (!p.original_price || !p.price) return 0;
    return Math.round((1 - p.price / p.original_price) * 100);
  }

  //  ADD TO CART 
  addToCart(p: any, e: Event): void {
    e.stopPropagation();
    alert('Đã thêm "' + p.name + '" vào giỏ hàng!');
  }

  //  SUBSCRIBE 
  subscribe(): void {
    if (!this.email) return;
    alert('Cảm ơn bạn đã đăng ký!');
    this.email = '';
  }
}