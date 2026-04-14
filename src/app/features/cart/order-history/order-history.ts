import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    // Giả sử userId = 1 cho demo, thực tế lấy từ AuthService
    const userId = 1; 
    
    this.orderService.getUserOrders(userId).subscribe({
      next: (res: any[]) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Lỗi tải lịch sử đơn hàng:', err);
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string) {
    const labels: any = {
      'pending': 'Đang chờ',
      'shipping': 'Đang giao',
      'done': 'Hoàn thành',
      'cancelled': 'Đã huỷ'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string) {
    return {
      'text-warning': status === 'pending',
      'text-primary': status === 'shipping',
      'text-success': status === 'done',
      'text-danger': status === 'cancelled'
    };
  }
}
