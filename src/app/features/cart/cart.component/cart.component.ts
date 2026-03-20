import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Cart: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'], 
  standalone: true,
  imports: [CommonModule, FormsModule], 
})
export class CartComponent implements OnInit {

  items: any[] = [];
  couponCode = '';
  couponMessage = '';
  couponStatus = '';

  get subtotal() {
    return Cart.subtotal;
  }

  get total() {
    return Cart.total;
  }

  get shippingFee() {
    return Cart.shippingFee;
  }

  get discount() {
    return Cart.discount;
  }

  ngOnInit() {
    this.renderCart();
  }

  renderCart() {
    this.items = Cart.items;
  }

  updateQty(id: number, color: string, delta: number) {
    Cart.updateQty(
      id,
      color,
      (Cart.items.find((i: any) => i.id === id && i.color === color)?.qty || 0) + delta
    );
    this.renderCart();
  }

  removeItem(id: number, color: string) {
    Cart.remove(id, color);
    this.renderCart();
  }

  applyCoupon() {
    const code = this.couponCode.toUpperCase().trim();

    if (Cart.applyCoupon(code)) {
      this.couponMessage = `✓ Áp dụng mã "${code}" thành công!`;
      this.couponStatus = 'success';
    } else {
      this.couponMessage = '✗ Mã giảm giá không hợp lệ.';
      this.couponStatus = 'error';
    }
  }

  formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}