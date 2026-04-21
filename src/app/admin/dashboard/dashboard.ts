import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order } from '../../shared/models/order.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, RouterModule]
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

  chart: any[] = [];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      orders: this.orderService.getOrders().pipe(catchError(() => of([] as Order[]))),
      pubStats: this.productService.getPublicStats().pipe(catchError(() => of({ products: 0, customers: 0 }))),
      products: this.productService.getProducts().pipe(catchError(() => of([] as any[])))
    }).subscribe({
      next: (res: any) => {
        console.log('Dashboard Data Received:', res);
        const safeOrders: Order[] = res.orders || [];
        const safeProducts = res.products || [];
        const safeStats = res.pubStats || {};

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        // --- CALCULATION HELPERS ---
        const getStatsInRange = (orders: Order[], startDate: Date, endDate: Date) => {
          const filtered = orders.filter(o => {
            const d = new Date(o.created_at || '');
            return d >= startDate && d <= endDate;
          });

          return {
            revenue: filtered.filter(o => o.status === 'done').reduce((s, o) => s + Number(o.total_price || 0), 0),
            count: filtered.length,
            customers: new Set(filtered.map(o => o.user_id)).size
          };
        };

        const currentPeriod = getStatsInRange(safeOrders, thirtyDaysAgo, now);
        const previousPeriod = getStatsInRange(safeOrders, sixtyDaysAgo, thirtyDaysAgo);

        const calcPercent = (curr: number, prev: number) => {
          if (prev === 0) return curr > 0 ? 100 : 0;
          return Math.round(((curr - prev) / prev) * 100);
        };

        const totalRevenue = safeOrders
          .filter(o => o.status === 'done')
          .reduce((sum: number, o: Order) => sum + Number(o.total_price || 0), 0);

        this.stats = [
          { 
            label: 'Tổng doanh thu', 
            value: this.formatCurrency(totalRevenue), 
            change: calcPercent(currentPeriod.revenue, previousPeriod.revenue), 
            icon: 'bi-cash-stack' 
          },
          { 
            label: 'Tổng đơn hàng', 
            value: safeOrders.length.toString(), 
            change: calcPercent(currentPeriod.count, previousPeriod.count), 
            icon: 'bi-cart-check' 
          },
          { 
            label: 'Tổng khách hàng', 
            value: (safeStats.customers || 11).toString(),
            change: calcPercent(currentPeriod.customers, previousPeriod.customers), 
            icon: 'bi-people' 
          },
          { 
            label: 'Sản phẩm', 
            value: (safeStats.products || safeProducts.length || 0).toString(), 
            change: 0, 
            icon: 'bi-box-seam' 
          }
        ];

        this.recentOrders = safeOrders.slice(0, 5);
        this.processTopProducts(safeOrders, safeProducts);
        this.processChartData(safeOrders);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error loading dashboard stats:', err)
    });
  }

  private calculateGrowth(orders: Order[], field: 'total_price' | 'count'): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentPeriodOrders = orders.filter(o => {
      const d = new Date(o.created_at || '');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const previousPeriodOrders = orders.filter(o => {
      const d = new Date(o.created_at || '');
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    let currentVal = 0;
    let previousVal = 0;

    if (field === 'total_price') {
      currentVal = currentPeriodOrders.filter(o => o.status === 'done').reduce((s, o) => s + Number(o.total_price), 0);
      previousVal = previousPeriodOrders.filter(o => o.status === 'done').reduce((s, o) => s + Number(o.total_price), 0);
    } else {
      currentVal = currentPeriodOrders.length;
      previousVal = previousPeriodOrders.length;
    }

    if (previousVal === 0) return currentVal > 0 ? 100 : 0;
    return Math.round(((currentVal - previousVal) / previousVal) * 100);
  }

  processChartData(orders: Order[]) {
    const months: { label: string; month: number; year: number; raw: number }[] = [];
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: `T${d.getMonth() + 1}`,
        month: d.getMonth(),
        year: d.getFullYear(),
        raw: 0
      });
    }

    orders.filter(o => o.status === 'done' && o.created_at).forEach(o => {
      const d = new Date(o.created_at!);
      const match = months.find(item => 
        item.month === d.getMonth() && 
        item.year === d.getFullYear()
      );
      if (match) match.raw += Number(o.total_price || 0);
    });

    const maxRevenue = Math.max(...months.map(m => m.raw), 1);
    this.chart = months.map(m => ({
      label: m.label,
      value: Math.max((m.raw / maxRevenue) * 150, 10), // Base height 10px
      rawValue: m.raw
    }));
  }

  processTopProducts(orders: Order[], products: any[]) {
    const salesMap = new Map<number, number>();

    orders.filter(o => o.status === 'done').forEach(o => {
      const items = o.OrderItems || o.items || [];
      items.forEach(item => {
        const current = salesMap.get(item.product_id) || 0;
        salesMap.set(item.product_id, current + item.quantity);
      });
    });

    this.topProducts = Array.from(salesMap.entries())
      .map(([id, quantity]) => {
        const p = products.find(prod => prod.id === id);
        return {
          name: p?.name || `Sản phẩm #${id}`,
          brand: p?.brand || 'N/A',
          price: Number(p?.price || 0),
          soldQty: quantity
        };
      })
      .sort((a, b) => b.soldQty - a.soldQty)
      .slice(0, 5);
  }

  formatCurrency(value: number): string {
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toLocaleString('vi-VN') + 'đ';
  }

  goToProducts() { this.router.navigate(['/admin/products']); }
  goToOrders() { this.router.navigate(['/admin/orders']); }
}