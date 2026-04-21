import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order.model';

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

  selectedOrder: Order | null = null;
  selectedStatusTemp: string = '';
  orders: Order[] = [];

  statusList = [
    { key: '', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'done', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Huỷ' }
  ];

  isModalOpen = false;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res: Order[]) => {
        this.orders = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Lỗi khi tải đơn hàng:', err);
        alert('Không thể tải danh sách đơn hàng');
      }
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

  getAvailableStatuses(currentStatus: string) {
    if (currentStatus === 'pending') {
      return this.statusList.filter(s => ['shipping', 'done', 'cancelled'].includes(s.key));
    } else if (currentStatus === 'shipping') {
      return this.statusList.filter(s => ['done', 'cancelled'].includes(s.key));
    }
    return [];
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
    if (!order.id) return;
    this.orderService.getOrderById(order.id).subscribe({
      next: (res: Order) => {
        this.selectedOrder = res;
        this.selectedStatusTemp = res.status;
        this.isModalOpen = true;
        this.cdr.detectChanges();
      },
      error: () => alert('Không thể tải chi tiết đơn hàng')
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  updateStatus() {
    if (!this.selectedOrder || !this.selectedOrder.id) return;
    
    const statusLabel = this.getStatusLabel(this.selectedStatusTemp);
    if (!confirm(`Bạn có chắc chắn muốn thay đổi trạng thái sang "${statusLabel}"?`)) return;

    this.orderService.updateStatus(this.selectedOrder.id, this.selectedStatusTemp).subscribe({
      next: () => {
        alert('Cập nhật trạng thái thành công!');
        if (this.selectedOrder) {
          this.selectedOrder.status = this.selectedStatusTemp as any;
        }
        this.loadOrders();
      },
      error: (err: { error: { message: any; }; }) => alert(err.error?.message || 'Có lỗi xảy ra')
    });
  }

  exportExcel() {
    alert('Tính năng đang phát triển!');
  }
}