import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    let token = '';
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('bb_user');
      }
      alert('Phiên đăng nhập đã hết hạn hoặc bạn không có quyền. Vui lòng đăng nhập lại!');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return throwError(() => error);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<{ data: Order[] }>(`${this.apiUrl}/list`, this.getAuthHeaders()).pipe(
      map((res: { data: Order[] }) => res.data || []),
      catchError(this.handleError)
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<{ data: Order }>(`${this.apiUrl}/${id}`, this.getAuthHeaders()).pipe(
      map((res: { data: Order }) => res.data),
      catchError(this.handleError)
    );
  }

  checkout(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/user/${userId}`, this.getAuthHeaders()).pipe(
      map((res: { data: any[] }) => res.data),
      catchError(this.handleError)
    );
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  userCancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/user-cancel/${id}`, {}, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }
}
