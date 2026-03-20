// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.scss',
// })
// export class Dashboard {

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  
}