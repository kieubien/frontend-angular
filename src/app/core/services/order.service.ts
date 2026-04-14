import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/list`).pipe(
      map(res => res.data)
    );
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  checkout(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData);
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/user/${userId}`).pipe(
      map(res => res.data)
    );
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
