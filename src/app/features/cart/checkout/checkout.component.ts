import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, NavbarComponent],
})
export class CheckoutComponent implements OnInit {

  items: any[] = [];
  subtotal = 0;
  shippingFee = 30000;
  total = 0;

  provinces: any[] = [];
  districts: any[] = [];

  selectedProvince: any = '';
  selectedDistrict: any = '';

  paymentMethod = 'cod';

  ngOnInit() {
    this.loadCart();
    this.loadProvince();
  }

  // ===== CART =====
  loadCart() {
    const data = JSON.parse(localStorage.getItem('bb_cart') || '[]');
    this.items = data;

    this.subtotal = data.reduce((s: number, i: any) => s + i.price * i.qty, 0);
    this.shippingFee = this.subtotal >= 299000 ? 0 : 30000;
    this.total = this.subtotal + this.shippingFee;
  }

  formatPrice(n: number) {
    return n.toLocaleString('vi-VN') + 'đ';
  }

  placeOrder() {
    if (this.items.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    alert('Đặt hàng thành công 💖');
    localStorage.removeItem('bb_cart');
  }

  // ===== LOCATION API =====
  async loadProvince() {
    const res = await fetch('https://provinces.open-api.vn/api/p/');
    this.provinces = await res.json();
  }

  async loadDistrict(code: string) {
    this.districts = [];

    const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
    const data = await res.json();

    this.districts = data.districts;
  }
}