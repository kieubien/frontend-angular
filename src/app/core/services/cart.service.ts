import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'bb_cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  /* ===== LOAD/SAVE ===== */
  private loadCart() {
    const data = localStorage.getItem(this.CART_KEY);
    if (data) {
      this.cartItems.next(JSON.parse(data));
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    this.cartItems.next(items);
  }

  /* ===== ACTIONS ===== */
  addToCart(product: any, qty: number = 1) {
    // 1. Kiểm tra trạng thái tạm ngưng bán
    if (product.status === 'inactive') {
      alert(`Sản phẩm "${product.name}" hiện đang tạm ngưng bán. Xin lỗi vì sự bất tiện này!`);
      return;
    }

    // 2. Kiểm tra tồn kho đã hết hẳn chưa
    if (product.stock <= 0) {
      alert(`Sản phẩm "${product.name}" hiện đang tạm hết hàng. Vui lòng quay lại sau!`);
      return;
    }
    
    const currentItems = this.cartItems.value;
    const existingIndex = currentItems.findIndex(i => i.id === product.id);

    // Calculate effective price (same as React logic)
    const effectivePrice = Number(product.price);

    if (existingIndex > -1) {
      const newQty = currentItems[existingIndex].qty + qty;
      
      // Stock check from React logic (App.js line 158)
      if (product.stock && newQty > product.stock) {
        alert(`Lỗi: Không thể vượt quá số lượng tồn kho (Còn ${product.stock} sản phẩm)`);
        return;
      }
      
      currentItems[existingIndex].qty = newQty;
      currentItems[existingIndex].price = effectivePrice;
    } else {
      // Stock check for new item
      if (product.stock && qty > product.stock) {
        alert(`Lỗi: Không thể vượt quá số lượng tồn kho (Còn ${product.stock} sản phẩm)`);
        return;
      }

      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: effectivePrice,
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        qty: qty,
        image: product.image,
        stock: product.stock
      };
      currentItems.push(newItem);
    }

    this.saveCart([...currentItems]);
  }

  removeFromCart(id: number, color?: string, size?: string) {
    const updatedItems = this.cartItems.value.filter(i => 
      !(i.id === id && i.color === color && i.size === size)
    );
    this.saveCart(updatedItems);
  }

  updateQty(id: number, delta: number, color?: string, size?: string) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => 
      i.id === id && i.color === color && i.size === size
    );

    if (item) {
      if (delta > 0 && item.stock && item.qty + delta > item.stock) {
        alert(`Lỗi: Không thể vượt quá số lượng tồn kho (Còn ${item.stock} sản phẩm)`);
        return;
      }
      
      item.qty += delta;
      if (item.qty <= 0) {
        this.removeFromCart(id, color, size);
      } else {
        this.saveCart([...currentItems]);
      }
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  /* ===== CALCULATIONS ===== */
  getSubtotal() {
    return this.cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  getCartCount() {
    return this.cartItems.value.reduce((count, item) => count + item.qty, 0);
  }
}
