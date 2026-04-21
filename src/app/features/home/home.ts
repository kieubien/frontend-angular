import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { Category } from '../../core/models/category.model';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();
  
  private activeTabSubject = new BehaviorSubject<string>('all');
  activeTab$ = this.activeTabSubject.asObservable();
  
  featuredProducts$: Observable<any[]>;
  
  isLoading = true;
  email = '';

  tabs = [
    { key: 'all', label: 'Sản phẩm' },
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
    { num: '0', label: 'Sản phẩm' },
    { num: '0', label: 'Khách hàng' },
    { num: '0', label: 'Thương hiệu' }
  ];

  discounts = [
    { value: '30%', label: 'Giảm giá son' },
    { value: '50%', label: 'Deal hời' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.featuredProducts$ = combineLatest([this.products$, this.activeTab$]).pipe(
      map(([products, tab]) => {
        if (!products || products.length === 0) return [];
        
        if (tab === 'sale') {
          return products
            .filter(p => p.badge === 'sale' || p.original_price)
            .slice(0, 8);
        } else {
          // Mặc định là 'all' - Hiện 8 sản phẩm đầu tiên
          return products.slice(0, 8);
        }
      })
    );
  }

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
        this.productsSubject.next(prods || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
        this.isLoading = false;
        this.productsSubject.next([]);
      }
    });

    this.productService.getPublicStats().subscribe({
      next: (data) => {
        if (data) {
          this.stats = [
            { num: `${data.products}+`, label: 'Sản phẩm' },
            { num: `${data.customers}+`, label: 'Khách hàng' },
            { num: `${data.brands}+`, label: 'Thương hiệu' }
          ];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Lỗi tải thống kê:', err)
    });
  }


  setTab(key: string) {
    this.activeTabSubject.next(key);
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
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
