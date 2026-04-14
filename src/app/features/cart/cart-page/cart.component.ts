import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../shared/models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CartComponent implements OnInit, OnDestroy {

  items: CartItem[] = [];
  private cartSub!: Subscription;

  couponCode = '';
  couponMessage = '';
  couponStatus = '';

  discount = 0;
  shippingFee = 30000;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.items = items;
      this.updateTotal(); // Cập nhật phí ship dựa trên subtotal mới
    });
  }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  /* ===== ACTIONS ===== */
  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQty(id: number, delta: number, color?: string) {
    this.cartService.updateQty(id, delta, color);
  }

  removeItem(id: number, color?: string) {
    if (confirm('Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?')) {
      this.cartService.removeFromCart(id, color);
    }
  }

  /* ===== CALCULATIONS ===== */
  get subtotal() {
    return this.cartService.getSubtotal();
  }

  get total() {
    return this.subtotal - this.discount + this.shippingFee;
  }

  private updateTotal() {
    // Miễn phí vận chuyển cho đơn hàng trên 299k
    this.shippingFee = this.subtotal >= 299000 ? 0 : 30000;
  }

  /* ===== COUPON ===== */
  applyCoupon() {
    const code = this.couponCode.toUpperCase().trim();

    if (code === 'SALE10') {
      this.discount = this.subtotal * 0.1;
      this.couponMessage = `✓ Áp dụng mã "${code}" thành công!`;
      this.couponStatus = 'success';
    } else {
      this.discount = 0;
      this.couponMessage = '✗ Mã giảm giá không hợp lệ.';
      this.couponStatus = 'error';
    }
  }

  /* ===== NAVIGATION ===== */
  goToCheckout() {
    if (this.items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  /* ===== FORMAT ===== */
  formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}