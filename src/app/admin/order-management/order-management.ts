import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.scss']
})
export class OrderManagement implements OnInit {

  searchText = '';
  filterStatus = '';
  filterPayment = '';

  selectedOrder: any = null;
  orders: any[] = [];

  statusList = [
    { key: '', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'done', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Huỷ' }
  ];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(res => {
      this.orders = res;
    });
  }

  filteredOrders() {
    return this.orders.filter(o => {
      const customerName = o.customer_name || 'Khách vãng lai';
      return (!this.filterStatus || o.status === this.filterStatus)
        && (!this.filterPayment || o.payment_method === this.filterPayment)
        && (!this.searchText || customerName.toLowerCase().includes(this.searchText.toLowerCase()));
    });
  }

  getStatusClass(status: string) {
    return {
      'bg-success': status === 'done',
      'bg-warning': status === 'pending',
      'bg-primary': status === 'shipping',
      'bg-danger': status === 'cancelled'
    };
  }

  getStatusLabel(status: string) {
    return this.statusList.find(s => s.key === status)?.label || status;
  }

  getCountByStatus(status: string) {
    return status
      ? this.orders.filter(o => o.status === status).length
      : this.orders.length;
  }

  resetFilters() {
    this.filterStatus = '';
    this.filterPayment = '';
    this.searchText = '';
  }

  selectOrder(order: any) {
    this.selectedOrder = order;
  }

  updateStatus() {
    if (!this.selectedOrder) return;
    this.orderService.updateStatus(this.selectedOrder.id, this.selectedOrder.status).subscribe({
      next: () => {
        alert('Cập nhật trạng thái thành công!');
        this.loadOrders();
      },
      error: (err) => alert(err.error?.message || 'Có lỗi xảy ra')
    });
  }

  exportExcel() {
    alert('Tính năng đang phát triển!');
  }
}