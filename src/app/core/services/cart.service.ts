import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../shared/models/cart.model';

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
  addToCart(product: any, qty: number = 1, color?: string, size?: string) {
    const currentItems = this.cartItems.value;
    const existingIndex = currentItems.findIndex(i => 
      i.id === product.id && i.color === color && i.size === size
    );

    if (existingIndex > -1) {
      currentItems[existingIndex].qty += qty;
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: qty,
        image: product.image,
        color: color,
        size: size
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
