export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  icon?: string;
  description?: string;
  productCount?: number;
}
