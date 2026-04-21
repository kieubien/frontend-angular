import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;

  items: CartItem[] = [];
  private cartSub!: Subscription;

  provinces: any[] = [];
  districts: any[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.items = items;
    });
    this.loadProvince();
  }

  initForm() {
    const user = this.authService.currentUserValue;
    // Fallback logic for name
    let fullName = '';
    if (user) {
      if (user.first_name && user.last_name) {
        fullName = `${user.first_name} ${user.last_name}`;
      } else {
        fullName = user.name;
      }
    }

    this.checkoutForm = this.fb.group({
      customerName: [fullName, Validators.required],
      phone: [user?.phone || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      paymentMethod: ['COD', Validators.required]
    });

    // Listen to province changes to load districts
    this.checkoutForm.get('province')?.valueChanges.subscribe(code => {
      this.loadDistrict(code);
      this.checkoutForm.get('district')?.setValue('');
    });
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

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      alert('Vui lòng điền đúng và đầy đủ thông tin giao hàng!');
      return;
    }

    const formVal = this.checkoutForm.value;

    // Lấy tên province/district từ code
    const provinceName = this.provinces.find(p => p.code === formVal.province)?.name || '';
    const districtName = this.districts.find(d => d.code === formVal.district)?.name || '';
    const fullAddress = `${formVal.address}, ${districtName}, ${provinceName}`;

    const orderPayload: Order = {
      customer_name: formVal.customerName,
      phone: formVal.phone,
      shipping_address: fullAddress,
      payment_method: formVal.paymentMethod,
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
      next: (res: any) => {
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Blush & Bloom 💖');
        this.cartService.clearCart();
        this.router.navigate(['/']); 
      },
      error: (err: any) => {
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