import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface AuthUser {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'admin' | 'user';
  email: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient
  ) {
    console.log('AuthService: Instantiated');
    let initialUser = null;
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('bb_user');
      if (storedUser) {
        try {
          initialUser = JSON.parse(storedUser);
          console.log('AuthService: Loaded user from localStorage:', initialUser);
        } catch (e) {
          localStorage.removeItem('bb_user');
        }
      }
    }
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  setSession(token: string, user: AuthUser): void {
    console.log('AuthService: Setting session:', user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('bb_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('bb_user');
      this.currentUserSubject.next(null);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  getUsers(): Observable<User[]> {
    return this.http.get<{ data: User[] }>(`${this.apiUrl}/list`).pipe(
      map(res => res.data || [])
    );
  }

  updateUserRole(id: string | number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-role/${id}`, { role });
  }

  updateUserStatus(id: string | number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-status/${id}`, { status });
  }

  getProfile(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${id}`).pipe(
      map(res => res.data)
    );
  }

  updateProfile(id: string | number, data: any): Observable<any> {
    return this.http.put<{ message: string, user: any }>(`${this.apiUrl}/update-profile/${id}`, data).pipe(
      map(res => {
        if (res.user && isPlatformBrowser(this.platformId)) {
          // Merge updated data into session
          const currentUser = this.currentUserValue;
          if (currentUser) {
            const updatedUser = { 
              ...currentUser, 
              first_name: res.user.first_name, 
              last_name: res.user.last_name,
              name: (res.user.first_name || '') + ' ' + (res.user.last_name || ''),
              phone: res.user.phone,
              address: res.user.address
            };
            localStorage.setItem('bb_user', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
          }
        }
        return res;
      })
    );
  }
}
