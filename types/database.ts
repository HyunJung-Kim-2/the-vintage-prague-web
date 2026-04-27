export type Role = "admin" | "customer";
export type Category = "bags" | "clothing" | "shoes" | "wallets";
export type Condition = "new" | "s" | "a" | "b";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type Currency = "EUR" | "CZK";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category: Category;
  condition: Condition;
  price: number;
  size: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  position: number;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  status: OrderStatus;
  total_amount: number;
  currency: Currency;
  shipping_address: ShippingAddress | null;
  tracking_number: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
}

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
