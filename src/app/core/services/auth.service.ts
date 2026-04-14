import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthUser {
  name: string;
  role: 'admin' | 'user';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
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
}
