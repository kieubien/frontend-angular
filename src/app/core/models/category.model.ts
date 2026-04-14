export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  parentId?: number; // Giữ lại để tránh break code cũ nếu có
  icon?: string;
  description?: string;
  product_count?: number;
  productCount?: number; // Giữ lại để tránh break code cũ nếu có
}
