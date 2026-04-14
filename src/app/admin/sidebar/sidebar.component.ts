import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, CommonModule] 
})
export class SidebarComponent implements OnInit {
  userName = 'Admin';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('bb_user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userName = user.name || 'Admin';
    }
  }

  logout(): void {
    localStorage.removeItem('bb_user');
    localStorage.removeItem('bb_token');
    this.router.navigate(['/login']);
  }
}