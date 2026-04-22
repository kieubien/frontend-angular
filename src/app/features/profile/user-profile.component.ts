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
    address: '',
    password: '', // new password
    old_password: '' // required if changing password
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
        // Pre-fill from session first
        this.profileForm.first_name = user.first_name || '';
        this.profileForm.last_name = user.last_name || '';
        this.profileForm.phone = user.phone || '';
        this.profileForm.address = user.address || '';

        // Fetch full profile from DB to get latest data including phone
        this.authService.getProfile(user.id!).subscribe({
          next: (userData) => {
            if (userData) {
              console.log('Profile Data Loaded:', userData);
              
              // Map fields carefully
              this.profileForm.first_name = userData.first_name || '';
              this.profileForm.last_name = userData.last_name || '';
              this.profileForm.phone = userData.phone || userData.phone_number || userData.sdt || '';
              this.profileForm.address = userData.address || '';
              
              // Sync this.user as well
              this.user = { 
                ...this.user!, 
                ...userData,
                phone: userData.phone || userData.phone_number || userData.sdt,
                name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || this.user?.name
              };
              this.cdr.detectChanges();
            }
          },
          error: (err) => console.error('Error fetching profile:', err)
        });
        
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

    // Frontend validation for password change
    if (this.profileForm.password && this.profileForm.password.trim() !== '') {
      if (!this.profileForm.old_password || this.profileForm.old_password.trim() === '') {
        alert('Vui lòng nhập mật khẩu cũ để xác nhận việc thay đổi mật khẩu.');
        return;
      }
    }

    this.updatingProfile = true;
    this.authService.updateProfile(this.user.id, this.profileForm).subscribe({
      next: (res) => {
        this.updatingProfile = false;
        this.isEditing = false;
        this.profileForm.password = '';
        this.profileForm.old_password = '';
        this.cdr.detectChanges();
        alert('Cập nhật thông tin thành công!');
      },
      error: (err) => {
        this.updatingProfile = false;
        this.cdr.detectChanges();
        console.error(err);
        alert(err.error?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
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
