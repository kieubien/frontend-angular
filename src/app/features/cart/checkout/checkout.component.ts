import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { CartItem } from '../../../shared/models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, NavbarComponent],
})
export class CheckoutComponent implements OnInit, OnDestroy {

  items: CartItem[] = [];
  private cartSub!: Subscription;

  // Form fields
  customerName = '';
  phone = '';
  email = '';
  address = '';
  selectedProvince = '';
  selectedDistrict = '';
  paymentMethod = 'cod';

  provinces: any[] = [];
  districts: any[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.items = items;
    });
    this.loadProvince();
  }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  /* ===== CALCULATIONS ===== */
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

  /* ===== ACTIONS ===== */
  placeOrder() {
    if (this.items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (!this.customerName || !this.phone || !this.address || !this.selectedProvince) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    // Lấy tên province/district từ code
    const provinceName = this.provinces.find(p => p.code === this.selectedProvince)?.name || '';
    const districtName = this.districts.find(d => d.code === this.selectedDistrict)?.name || '';
    const fullAddress = `${this.address}, ${districtName}, ${provinceName}`;

    const orderPayload: Order = {
      customer_name: this.customerName,
      phone: this.phone,
      shipping_address: fullAddress,
      payment_method: this.paymentMethod.toUpperCase(),
      total_price: this.total,
      status: 'pending',
      user_id: null, // Cần bổ sung nếu có login logic
      OrderItems: this.items.map(i => ({
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

  /* ===== LOCATION API ===== */
  async loadProvince() {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/p/');
      this.provinces = await res.json();
    } catch (error) {
      console.error('Lỗi tải tỉnh/thành:', error);
    }
  }

  async loadDistrict(code: string) {
    if (!code) {
      this.districts = [];
      return;
    }
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
      const data = await res.json();
      this.districts = data.districts;
    } catch (error) {
      console.error('Lỗi tải quận/huyện:', error);
    }
  }
}