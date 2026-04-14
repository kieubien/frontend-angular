import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      firstName:  ['', [Validators.required]],
      lastName:   ['', [Validators.required]],
      email:      ['', [Validators.required, Validators.email]],
      phone:      ['', [Validators.required]],
      password:   ['', [Validators.required, Validators.minLength(8)]],
      agree:      [false, [Validators.requiredTrue]],
      newsletter: [true]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  checkStrength(pw: string): void {
    if (!pw) { this.strengthScore = 0; return; }

    let score = 0;
    if (pw.length >= 8)           score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw))  score++;

    const percents = ['0%', '25%', '50%', '75%', '100%'];
    const colors   = ['', '#E24B4A', '#BA7517', '#378ADD', '#1D9E75'];
    const labels   = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];

    this.strengthScore   = score;
    this.strengthPercent = percents[score];
    this.strengthColor   = colors[score];
    this.strengthLabel   = labels[score];
  }

  doRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = !this.registerForm.get('agree')?.value
        ? 'Bạn cần đồng ý điều khoản để tiếp tục.'
        : 'Vui lòng nhập đầy đủ thông tin bắt buộc.';
      return;
    }

    const { firstName, lastName, email, phone, password, newsletter } = this.registerForm.value;
    
    const body = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      password: password,
      newsletter: newsletter ? 1 : 0
    };

    this.http.post<any>('http://localhost:3000/users/register', body).subscribe({
      next: (res: any) => {
        alert('Đăng ký thành công! Mời bạn đăng nhập.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || err.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      }
    });
  }
}