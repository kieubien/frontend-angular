import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
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
  selectedUser: User | null = null;
  showDetailModal = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log('UserManagementComponent: Initializing...');
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        console.log('UserManagementComponent: Loaded users:', data);
        this.users = data || [];
      },
      error: (err) => {
        console.error('UserManagementComponent: Error loading users:', err);
      }
    });
  }

  viewDetail(user: User) {
    console.log('UserManagementComponent: Viewing detail for:', user);
    this.selectedUser = user;
    this.showDetailModal = true;
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedUser = null;
  }

  getActiveCount(): number {
    return this.users.filter(u => u.status !== 'banned').length;
  }

  getBannedCount(): number {
    return this.users.filter(u => u.status === 'banned').length;
  }

  updateRole(user: User, newRole: 'admin' | 'user') {
    if (confirm(`Xác nhận đổi quyền sang ${newRole}?`)) {
      this.authService.updateUserRole(user.id, newRole).subscribe({
        next: () => {
          alert('Cập nhật quyền thành công!');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => alert('Có lỗi xảy ra: ' + (err.error?.message || err.message))
      });
    }
  }

  toggleStatus(user: User) {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    const action = newStatus === 'banned' ? 'Ban' : 'Unban';
    if (confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) {
      this.authService.updateUserStatus(user.id, newStatus).subscribe({
        next: () => {
          alert(`${action} thành công!`);
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => alert('Có lỗi xảy ra: ' + (err.error?.message || err.message))
      });
    }
  }
}
