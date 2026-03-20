// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-order-management',
//   imports: [],
//   templateUrl: './order-management.html',
//   styleUrl: './order-management.scss',
// })
// export class OrderManagement {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-order-management',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './order-management.html',
    styleUrls: ['./order-management.scss']
})
export class OrderManagementComponent {
  
}