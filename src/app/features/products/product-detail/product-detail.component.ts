import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

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
    private productService: ProductService
  ) { }

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
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product = res;
        this.loadRelatedProducts();
        this.isLoading = false;
        // Scroll to top when product changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.isLoading = false;
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
    // To be implemented with CartService
    console.log('Adding to cart:', this.product.name, 'Qty:', this.quantity);
    alert(`Đã thêm ${this.quantity} ${this.product.name} vào giỏ hàng!`);
  }
}
