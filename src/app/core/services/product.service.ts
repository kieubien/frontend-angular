import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private cache = new Map<string, any[]>();

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<any[]> {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/list`, { params }).pipe(
      map((res: { data: any[] }) => res?.data || []),
      catchError((err: any) => {
        console.error('ProductService Error:', err);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<{data: any}>(`${this.apiUrl}/${id}`).pipe(
      map((res: { data: any }) => res.data)
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPublicStats(): Observable<any> {
    return this.http.get<{ data: any }>('http://localhost:3000/api/public/stats').pipe(
      map((res: { data: any }) => res.data)
    );
  }
}
