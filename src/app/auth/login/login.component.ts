import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  doLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<any>('http://localhost:3000/users/login', { email, password }).subscribe({
      next: (res: any) => {
        console.log('Login Response:', res);

        const token = res.token || res.data?.token;
        
        if (!token) {
          console.error('Không tìm thấy token trong phản hồi API');
          this.errorMessage = 'Lỗi hệ thống: Không nhận được token từ máy chủ.';
          return;
        }

        try {

          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          console.log('Decoded Payload:', payload);

          const displayName = (payload.first_name || payload.last_name) 
            ? `${payload.first_name || ''} ${payload.last_name || ''}`.trim()
            : (payload.name || payload.email?.split('@')[0] || 'Người dùng');

          const user: AuthUser = {
            id: payload.id,
            name: displayName,
            role: payload.role === 1 || payload.role === 'admin' ? 'admin' : 'user',
            email: payload.email
          };

          this.authService.setSession(token, user);

          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        } catch (e) {
          console.error('Lỗi giải mã token:', e);
          this.errorMessage = 'Lỗi hệ thống: Cấu trúc token không hợp lệ.';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || err.error?.message || 'Email hoặc mật khẩu không đúng.';
      }
    });
  }
}