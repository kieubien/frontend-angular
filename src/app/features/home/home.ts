import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FooterComponent } from '../../shared/components/footer/footer';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

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

  //  CATEGORIES (CLEAN) 
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
    private http: HttpClient,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  this.products = this.mockData();
  this.featuredProducts = this.products
    .filter((p: any) => p.isFeatured)
    .slice(0, 4);

  this.isLoading = false;
}

  //  CHANGE TAB 
  setTab(key: string): void {
    this.activeTab = key;

    if (key === 'newest') {
      this.featuredProducts = [...this.products].reverse().slice(0, 4);
    } 
    else if (key === 'sale') {
      this.featuredProducts = this.products
        .filter((p: any) => p.badge === 'sale')
        .slice(0, 4);
    } 
    else {
      this.featuredProducts = this.products
        .filter((p: any) => p.isFeatured)
        .slice(0, 4);
    }
  }

  //  CALC DISCOUNT 
  getDiscount(p: any): number {
    if (!p.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  //  ADD TO CART 
  addToCart(p: any, e: Event): void {
    e.stopPropagation();
    console.log('Đã thêm "' + p.name + '" vào giỏ hàng!');
  }

  //  SUBSCRIBE 
  subscribe(): void {
    if (!this.email) return;
    console.log('Đăng ký thành công!');
    this.email = '';
  }

  //  MOCK DATA 
  mockData(): any[] {
    return [
      {
        id: 1,
        name: 'Lipstick Matte Ruby Woo',
        brand: 'MAC Cosmetics',
        price: 480000,
        originalPrice: 600000,
        badge: 'sale',
        reviewCount: 342,
        isFeatured: true,
        colors: [
          { hex: '#C95E85' },
          { hex: '#E24B4A' },
          { hex: '#9B3060' }
        ]
      },
      {
        id: 2,
        name: 'Rouge Dior Satin 999',
        brand: 'Dior Beauty',
        price: 1250000,
        originalPrice: null,
        badge: 'new',
        reviewCount: 218,
        isFeatured: true,
        colors: [
          { hex: '#C8963E' },
          { hex: '#C95E85' }
        ]
      },
      {
        id: 3,
        name: 'Velvet Matte Lip Pencil',
        brand: 'NARS Cosmetics',
        price: 720000,
        originalPrice: 850000,
        badge: null,
        reviewCount: 189,
        isFeatured: true,
        colors: [
          { hex: '#DEB8F0' },
          { hex: '#D4537E' }
        ]
      },
      {
        id: 4,
        name: 'Rouge Pur Couture Sheer',
        brand: 'YSL Beauty',
        price: 980000,
        originalPrice: null,
        badge: 'hot',
        reviewCount: 401,
        isFeatured: true,
        colors: [
          { hex: '#E88DAE' },
          { hex: '#E24B4A' }
        ]
      },
    ];
  }
}