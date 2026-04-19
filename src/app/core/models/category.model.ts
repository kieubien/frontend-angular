export interface Category {
  id: number;
  name: string;
  slug: string;

  icon?: string;
  description?: string;
  product_count?: number;
  productCount?: number; // Giữ lại để tránh break code cũ nếu có
}
