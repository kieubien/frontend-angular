import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('UserManagementComponent: Initializing...');
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        console.log('UserManagementComponent: Loaded users:', data);
        this.users = data || [];
        this.cdr.detectChanges(); // Force UI update
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
}
