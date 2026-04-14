import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  /**
   * Lấy danh sách tất cả đơn hàng (Dành cho Admin)
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<{ status: number; data: Order[] }>(`${this.apiUrl}/list`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<{ status: number; data: Order }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Đặt hàng (Checkout)
   */
  checkout(orderData: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData);
  }

  /**
   * Cập nhật trạng thái đơn hàng (Dành cho Admin)
   */
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Lấy lịch sử đơn hàng của người dùng hiện tại
   */
  getUserOrders(userId: number): Observable<Order[]> {
    // Lưu ý: Cần BE hỗ trợ endpoint này hoặc lọc từ list nếu BE cho phép
    // Ở đây giả định query params nếu cần, hoặc BE đã có endpoint riêng
    return this.http.get<{ status: number; data: Order[] }>(`${this.apiUrl}/user/${userId}`).pipe(
      map(res => res.data)
    );
  }
}
