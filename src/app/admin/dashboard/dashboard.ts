import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule]
})
export class Dashboard implements OnInit {

  stats = [
    { label: 'Doanh thu', value: '0', change: 0, icon: 'bi-cash-stack' },
    { label: 'Đơn hàng', value: '0', change: 0, icon: 'bi-cart-check' },
    { label: 'Khách hàng', value: '0', change: 0, icon: 'bi-people' },
    { label: 'Sản phẩm', value: '0', change: 0, icon: 'bi-box-seam' }
  ];

  recentOrders: any[] = [];
  topProducts: any[] = [];

  chart = [
    { label: 'T1', value: 80 },
    { label: 'T2', value: 100 },
    { label: 'T3', value: 90 },
    { label: 'T4', value: 120 }
  ];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      orders: this.orderService.getOrders(),
      pubStats: this.productService.getPublicStats(),
      products: this.productService.getProducts()
    }).subscribe({
      next: (res) => {
        // Calculate Revenue
        const revenue = res.orders
          .filter(o => o.status === 'done')
          .reduce((sum, o) => sum + Number(o.total_price), 0);

        this.stats = [
          { label: 'Doanh thu', value: this.formatCurrency(revenue), change: 0, icon: 'bi-cash-stack' },
          { label: 'Đơn hàng', value: res.orders.length.toString(), change: 0, icon: 'bi-cart-check' },
          { label: 'Khách hàng', value: res.pubStats.customers.toString(), change: 0, icon: 'bi-people' },
          { label: 'Sản phẩm', value: res.pubStats.products.toString(), change: 0, icon: 'bi-box-seam' }
        ];

        this.recentOrders = res.orders.slice(0, 5);
        
        // Mocking top products from real list for now
        this.topProducts = res.products.slice(0, 5);
      },
      error: (err) => console.error('Error loading dashboard stats:', err)
    });
  }

  formatCurrency(val: number) {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    return val.toLocaleString('vi-VN') + 'đ';
  }

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }

  goToOrders() {
    this.router.navigate(['/admin/orders']);
  }
}