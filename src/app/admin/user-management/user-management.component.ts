import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách người dùng', err);
      }
    });
  }

  toggleRole(user: User) {
    if (!user.id) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.authService.updateUserRole(user.id, newRole).subscribe(() => {
      user.role = newRole;
    });
  }

  toggleStatus(user: User) {
    if (!user.id) return;
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    this.authService.updateUserStatus(user.id, newStatus).subscribe(() => {
      user.status = newStatus;
    });
  }
}
