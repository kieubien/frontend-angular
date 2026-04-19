import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../shared/models/order.model';
import { CartItem } from '../../../shared/models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CheckoutComponent implements OnInit, OnDestroy {

  items: CartItem[] = [];
  private cartSub!: Subscription;

  customerName = '';
  phone = '';
  email = '';
  address = '';
  paymentMethod = 'cod';
  errors: any = {};

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.items = items;
    });
  }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  get subtotal() {
    return this.cartService.getSubtotal();
  }

  get shippingFee() {
    return this.subtotal >= 299000 ? 0 : 30000;
  }

  get total() {
    return this.subtotal + this.shippingFee;
  }

  formatPrice(n: number) {
    return n.toLocaleString('vi-VN') + 'đ';
  }

  placeOrder() {
    this.errors = {};
    if (this.items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    let hasError = false;
    if (!this.customerName.trim()) {
      this.errors.customerName = 'Vui lòng nhập họ và tên';
      hasError = true;
    }
    if (!this.phone.trim()) {
      this.errors.phone = 'Vui lòng nhập số điện thoại';
      hasError = true;
    }
    if (!this.address.trim()) {
      this.errors.address = 'Vui lòng nhập địa chỉ giao hàng cụ thể';
      hasError = true;
    }

    if (hasError) return;

    const fullAddress = this.address.trim();

    const orderPayload: Order = {
      customer_name: this.customerName,
      phone: this.phone,
      shipping_address: fullAddress,
      payment_method: this.paymentMethod.toUpperCase(),
      total_price: this.total,
      status: 'pending',
      user_id: this.authService.currentUserValue?.id || null,
      items: this.items.map(i => ({
        product_id: i.id,
        quantity: i.qty,
        price: i.price
      }))
    };

    this.orderService.checkout(orderPayload).subscribe({
      next: (res) => {
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Blush & Bloom 💖');
        this.cartService.clearCart();
        this.router.navigate(['/']); // Hoặc trang lịch sử/thành công
      },
      error: (err) => {
        alert(err.error?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
      }
    });
  }

}