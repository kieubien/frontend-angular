import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  relatedProducts: any[] = [];
  isLoading = true;
  quantity: number = 1;
  activeTab: string = 'desc'; // 'desc' | 'reviews' | 'usage'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  get canBuy(): boolean {
    return this.authService.isLoggedIn() && !this.authService.isAdmin();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(Number(id));
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    console.log('ProductDetail: Loading ID', id);
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        console.log('ProductDetail: Response received', res);
        
        // Handle potential nesting (though service should have handled it)
        if (res && res.data) {
          this.product = res.data;
        } else if (Array.isArray(res)) {
          this.product = res[0];
        } else {
          this.product = res;
        }

        if (this.product) {
          this.loadRelatedProducts();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('ProductDetail Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedProducts(): void {
    // Basic logic: get products from same category or just random ones
    this.productService.getProducts({ limit: 4 }).subscribe(products => {
      this.relatedProducts = products.filter(p => p.id !== this.product.id).slice(0, 4);
    });
  }

  getDiscount(): number {
    if (!this.product?.original_price) return 0;
    return Math.round((1 - this.product.price / this.product.original_price) * 100);
  }

  updateQuantity(val: number): void {
    const newQty = this.quantity + val;
    if (newQty >= 1 && newQty <= (this.product?.stock || 99)) {
      this.quantity = newQty;
    }
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      this.router.navigate(['/login']);
      return;
    }

    if (this.isAdmin) {
      alert('Tài khoản Admin không hỗ trợ tính năng mua hàng.');
      return;
    }

    this.cartService.addToCart(this.product, this.quantity);
    console.log('Added to cart:', this.product.name, 'Qty:', this.quantity);
    
    // Hiển thị thông báo thành công
    alert(`Đã thêm ${this.quantity} ${this.product.name} vào giỏ hàng thành công!`);
  }
}
