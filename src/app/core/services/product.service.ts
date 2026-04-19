import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private cache = new Map<string, any[]>();

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<any[]> {
    const cacheKey = JSON.stringify(params || {});
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    return this.http.get<{data: any[]}>(`${this.apiUrl}/list`, { params }).pipe(
      map(res => {
        this.cache.set(cacheKey, res.data);
        return res.data;
      })
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<{data: any}>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  addProduct(product: any): Observable<any> {
    const data = product instanceof FormData ? product : product;
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateProduct(id: number, product: any): Observable<any> {
    const data = product instanceof FormData ? product : product;
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
