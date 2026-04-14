import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<any[]> {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/list`, { params }).pipe(
      map(res => res.data)
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<{data: any}>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
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
}
