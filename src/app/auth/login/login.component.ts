import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FooterComponent } from '../../shared/components/footer/footer';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage = '';

  private mockUsers = [
    { email: 'admin@blushbloom.vn', password: 'admin123', name: 'Kiều Biên', role: 'admin' },
    { email: 'lananh@email.com',    password: 'user123',  name: 'Nguyễn Lan Anh', role: 'user' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
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
      next: (res) => {
        const token = res.token;
        // Tách Payload từ JWT ra để lấy role, email, name
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);

        localStorage.setItem('bb_token', token);
        localStorage.setItem('bb_user', JSON.stringify({
          name: `${payload.first_name || ''} ${payload.last_name || ''}`.trim(),
          role: payload.role === 1 || payload.role === 'admin' ? 'admin' : 'user',
          email: payload.email
        }));

        if (payload.role === 1 || payload.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email hoặc mật khẩu không đúng.';
      }
    });
  }
}