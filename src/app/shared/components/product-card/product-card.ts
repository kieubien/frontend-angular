import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(private cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.product, 1);
  }

  getDiscount(): number | null {
    if (!this.product || !this.product.original_price || this.product.original_price <= this.product.price) {
      return null;
    }
    return Math.round(((this.product.original_price - this.product.price) / this.product.original_price) * 100);
  }
}
