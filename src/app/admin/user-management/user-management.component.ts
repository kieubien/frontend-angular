import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/models/user.model';
import { Order } from '../../shared/models/order.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  allOrders: Order[] = [];
  userOrders: Order[] = [];
  selectedUser: User | null = null;
  showDetailModal = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      users: this.authService.getUsers().pipe(catchError(() => of([] as User[]))),
      orders: this.orderService.getOrders().pipe(catchError(() => of([] as Order[])))
    }).subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.allOrders = res.orders || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('UserManagementComponent: Error loading data:', err);
      }
    });
  }

  viewDetail(user: User) {
    this.selectedUser = user;
    if (user.id) {
       this.userOrders = this.allOrders.filter(o => o.user_id === user.id);
    } else {
       this.userOrders = [];
    }
    this.showDetailModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedUser = null;
    this.userOrders = [];
    this.cdr.detectChanges();
  }

  getActiveCount(): number {
    return this.users.filter(u => u.status !== 'banned').length;
  }

  getBannedCount(): number {
    return this.users.filter(u => u.status === 'banned').length;
  }

  updateRole(user: User, newRole: 'admin' | 'user') {
    if (!user.id) return;
    if (confirm(`Xác nhận đổi quyền sang ${newRole}?`)) {
      this.authService.updateUserRole(user.id, newRole).subscribe({
        next: () => {
          alert('Cập nhật quyền thành công!');
          this.loadData();
          this.closeModal();
        },
        error: (err) => alert('Có lỗi xảy ra: ' + (err.error?.message || err.message))
      });
    }
  }

  toggleStatus(user: User) {
    if (!user.id) return;
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    const action = newStatus === 'banned' ? 'Ban' : 'Unban';
    if (confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) {
      this.authService.updateUserStatus(user.id, newStatus).subscribe({
        next: () => {
          alert(`${action} thành công!`);
          this.loadData();
          this.closeModal();
        },
        error: (err) => alert('Có lỗi xảy ra: ' + (err.error?.message || err.message))
      });
    }
  }
}
