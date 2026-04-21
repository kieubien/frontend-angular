import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  get canBuy(): boolean {
    // Show buttons for everyone (Guests, Customers, Admins)
    return true;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  addToCart() {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.isAdmin) {
      alert('Admin không có quyền mua hàng.');
      return;
    }

    this.cartService.addToCart(this.product, 1);
  }

  getDiscount(): number | null {
    if (!this.product || !this.product.original_price || this.product.original_price <= this.product.price) {
      return null;
    }
    return Math.round(((this.product.original_price - this.product.price) / this.product.original_price) * 100);
  }
}
