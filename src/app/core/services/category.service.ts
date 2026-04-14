import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<{data: Category[]}>(`${this.apiUrl}/list`).pipe(
      map(response => response.data)
    );
  }

  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<{data: Category}>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(response => response.data)
    );
  }

  addCategory(category: Partial<Category>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, category);
  }

  updateCategory(category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
