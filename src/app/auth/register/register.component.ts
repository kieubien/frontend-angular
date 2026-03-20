// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-register',
//   imports: [],
//   templateUrl: './register.html',
//   styleUrl: './register.scss',
// })
// export class Register {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    showPassword = false;
    errorMessage = '';

    // Password strength
    strengthScore = 0;
    strengthPercent = '0%';
    strengthColor = '';
    strengthLabel = '';

    constructor(private fb: FormBuilder, private router: Router) {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            agree: [false, Validators.requiredTrue],
            newsletter: [true]
        });
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    checkStrength(pw: string): void {
        if (!pw) {
            this.strengthScore = 0;
            return;
        }

        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        const percents = ['0%', '25%', '50%', '75%', '100%'];
        const colors = ['', '#E24B4A', '#BA7517', '#378ADD', '#1D9E75'];
        const labels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];

        this.strengthScore = score;
        this.strengthPercent = percents[score];
        this.strengthColor = colors[score];
        this.strengthLabel = labels[score];
    }

    doRegister(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();

            if (!this.registerForm.get('agree')?.value) {
                this.errorMessage = 'Bạn cần đồng ý điều khoản để tiếp tục.';
            } else {
                this.errorMessage = 'Vui lòng nhập đầy đủ thông tin bắt buộc.';
            }
            return;
        }

        const { firstName, lastName, email } = this.registerForm.value;

        // Lưu user vào localStorage
        localStorage.setItem('bb_user', JSON.stringify({
            name: `${firstName} ${lastName}`,
            role: 'user',
            email
        }));

        // Điều hướng về trang chủ sau khi đăng ký
        this.router.navigate(['/home']);
    }
}