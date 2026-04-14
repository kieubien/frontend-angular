import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  isLoading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(Number(id)).subscribe({
        next: (res) => {
          this.product = res;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  getDiscount(): number {
    if (!this.product?.original_price) return 0;
    return Math.round((1 - this.product.price / this.product.original_price) * 100);
  }

  addToCart() {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(this.product, this.quantity);
      alert(`Đã thêm ${this.quantity} sản phẩm "${this.product.name}" vào giỏ hàng!`);
    }
  }

  updateQuantity(delta: number) {
    if (this.quantity + delta >= 1) {
      this.quantity += delta;
    }
  }
}
