import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, NavbarComponent],
})
export class CartComponent implements OnInit {

  items: any[] = [];
  couponCode = '';
  couponMessage = '';
  couponStatus = '';

  discount = 0;
  shippingFee = 30000;

  ngOnInit() {
    this.loadCart();
  }

  /* ===== LOAD CART ===== */
  loadCart() {
    const data = localStorage.getItem('cart');
    this.items = data ? JSON.parse(data) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  /* ===== GETTERS ===== */
  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get total() {
    return this.subtotal - this.discount + this.shippingFee;
  }

  /* ===== UPDATE QTY ===== */
  updateQty(id: number, color: string, delta: number) {
    const item = this.items.find(i => i.id === id && i.color === color);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
      this.removeItem(id, color);
      return;
    }

    this.saveCart();
  }

  /* ===== REMOVE ===== */
  removeItem(id: number, color: string) {
    this.items = this.items.filter(i => !(i.id === id && i.color === color));
    this.saveCart();
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

  /* ===== FORMAT ===== */
  formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}