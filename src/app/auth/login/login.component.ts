// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   imports: [],
//   templateUrl: './login.html',
//   styleUrl: './login.scss',
// })
// export class Login {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

    // Mock users — thay bằng API thật sau
    private mockUsers = [
        { email: 'admin@blushbloom.vn', password: 'admin123', name: 'Kiều Biên', role: 'admin' },
        { email: 'lananh@email.com', password: 'user123', name: 'Nguyễn Lan Anh', role: 'user' }
    ];

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
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
        const user = this.mockUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            this.errorMessage = 'Email hoặc mật khẩu không đúng.';
            return;
        }

        // Lưu thông tin user vào localStorage
        localStorage.setItem('bb_user', JSON.stringify({
            name: user.name,
            role: user.role,
            email: user.email
        }));

        // Điều hướng theo role
        if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/home']);
        }
    }
}