import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthUser } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: AuthUser | null = null;
  activeTab: 'profile' | 'orders' = 'profile';

  // Profile Form
  isEditing = false;
  profileForm = {
    first_name: '',
    last_name: '',
    phone: '',
    password: '' // optional
  };
  updatingProfile = false;

  // Orders
  orders: any[] = [];
  loadingOrders = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.profileForm.first_name = user.first_name || '';
        this.profileForm.last_name = user.last_name || '';
        this.profileForm.phone = user.phone || '';
        
        if (this.activeTab === 'orders') {
          this.loadOrders();
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  setTab(tab: 'profile' | 'orders') {
    this.activeTab = tab;
    if (tab === 'orders' && this.user) {
      this.loadOrders();
    }
  }

  updateProfile() {
    if (!this.user || !this.user.id) return;
    this.updatingProfile = true;
    this.authService.updateProfile(this.user.id, this.profileForm).subscribe({
      next: (res) => {
        alert('Cập nhật thông tin thành công!');
        this.updatingProfile = false;
        this.isEditing = false;
        this.profileForm.password = ''; // clear password
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra khi cập nhật thông tin.');
        this.updatingProfile = false;
      }
    });
  }

  loadOrders() {
    if (!this.user || !this.user.id) return;
    this.loadingOrders = true;
    this.orderService.getUserOrders(this.user.id).subscribe({
      next: (res) => {
        this.orders = res;
        this.loadingOrders = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingOrders = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelOrder(order: any) {
    if (order.status !== 'pending') return;
    if (confirm('Bạn có chắc chắn muốn huỷ đơn hàng này? Khách hàng vui lòng lưu ý hành động này không thể hoàn tác.')) {
      this.orderService.userCancelOrder(order.id).subscribe({
        next: () => {
          alert('Đã huỷ đơn hàng thành công.');
          this.loadOrders();
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Có lỗi xảy ra khi huỷ đơn hàng.');
        }
      });
    }
  }

  doLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
