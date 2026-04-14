import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.scss']
})
export class OrderManagement implements OnInit {

  searchText = '';
  filterStatus = '';
  filterPayment = '';

  selectedOrder: Order | null = null;
  orders: Order[] = [];

  statusList = [
    { key: '', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'done', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Huỷ' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /* ===== LOAD ORDERS ===== */
  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
      },
      error: (err) => {
        console.error('Lỗi tải danh sách đơn hàng:', err);
      }
    });
  }

  /* ===== FILTER LOGIC ===== */
  filteredOrders() {
    return this.orders.filter(o => {
      const customerName = o.customer_name || 'Khách vãng lai';
      const matchStatus = !this.filterStatus || o.status === this.filterStatus;
      const matchPayment = !this.filterPayment || o.payment_method === this.filterPayment;
      const matchText = !this.searchText || customerName.toLowerCase().includes(this.searchText.toLowerCase());
      
      return matchStatus && matchPayment && matchText;
    });
  }

  /* ===== UI UTILS ===== */
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

  selectOrder(order: Order) {
    // Clone order to avoid direct binding modification before confirmation
    this.selectedOrder = { ...order };
  }

  /* ===== ACTIONS ===== */
  updateStatus() {
    if (!this.selectedOrder || !this.selectedOrder.id) return;
    
    this.orderService.updateStatus(this.selectedOrder.id, this.selectedOrder.status).subscribe({
      next: () => {
        alert('Cập nhật trạng thái thành công!');
        this.loadOrders();
        this.selectedOrder = null; // Close detail view after success
      },
      error: (err) => {
        alert(err.error?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    });
  }

  exportExcel() {
    alert('Tính năng đang phát triển!');
  }
}