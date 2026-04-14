import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [SidebarComponent, CommonModule]
})
export class Dashboard {

  constructor(private router: Router) {}

  stats = [
    { label: 'Doanh thu', value: '128M', change: 18 },
    { label: 'Đơn hàng', value: '342', change: 9 },
    { label: 'Khách hàng', value: '1,284', change: 24 },
    { label: 'Sản phẩm', value: '5,620', change: -3 }
  ];

  chart = [
    { label: 'T1', value: 80 },
    { label: 'T2', value: 100 },
    { label: 'T3', value: 90 },
    { label: 'T4', value: 120 }
  ];

  topProducts = [
    { name: 'MAC Ruby Woo', brand: 'MAC', sales: '2.8K' },
    { name: 'Dior 999', brand: 'Dior', sales: '1.9K' }
  ];

  orders = [
    { id: '001', customer: 'Nguyễn A', total: '1.200.000đ', status: 'done' },
    { id: '002', customer: 'Trần B', total: '800.000đ', status: 'pending' }
  ];

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }

  goToOrders() {
    this.router.navigate(['/admin/orders']);
  }
}