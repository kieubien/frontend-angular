export interface Product {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  discountRate?: number;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  description: string;
}
