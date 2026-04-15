export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price: number;
  Product?: any; // To hold product details if included in response
}

export interface Order {
  id?: number;
  user_id?: number | null;
  total_price: number;
  status: 'pending' | 'shipping' | 'done' | 'cancelled';
  payment_method: string;
  shipping_address: string;
  customer_name: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
  OrderItems?: OrderItem[];
}
