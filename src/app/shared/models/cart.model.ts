export interface CartItem {
  id: number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  qty: number;
  image: string;
  color?: string;
  colorHex?: string;
  size?: string;
}
