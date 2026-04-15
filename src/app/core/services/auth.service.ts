import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface AuthUser {
  id?: number;
  name: string;
  role: 'admin' | 'user';
  email: string;
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
      localStorage.setItem('bb_token', token);
      localStorage.setItem('bb_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('bb_token');
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
}
