// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-product-management',
//   imports: [],
//   templateUrl: './product-management.html',
//   styleUrl: './product-management.scss',
// })
// export class ProductManagement {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-product-management',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-management.html',
    styleUrls: ['./product-management.scss']
})
export class ProductManagementComponent {
  
}