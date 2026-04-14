import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.scss']
})
export class OrderManagement {

  searchText = '';
  filterStatus = '';
  filterPayment = '';

  selectedOrder: any = null;

  orders = [
    { id: '001', customer: 'Nguyễn A', total: '1.200.000đ', status: 'done', payment: 'COD' },
    { id: '002', customer: 'Trần B', total: '800.000đ', status: 'pending', payment: 'VISA' }
  ];

  statusList = [
    { key: '', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'done', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Huỷ' }
  ];

  filteredOrders() {
    return this.orders.filter(o => {
      return (!this.filterStatus || o.status === this.filterStatus)
        && (!this.filterPayment || o.payment === this.filterPayment)
        && (!this.searchText || o.customer.toLowerCase().includes(this.searchText.toLowerCase()));
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
    alert('Cập nhật thành công!');
  }

  exportExcel() {
    alert('Xuất Excel thành công!');
  }
}