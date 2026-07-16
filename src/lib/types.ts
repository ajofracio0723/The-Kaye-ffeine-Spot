export type Role = "admin" | "staff";

export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category_id?: string | null;
  image_url?: string | null;
  is_available: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  loyalty_points: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_name?: string | null;
  served_by?: string | null;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_method?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: Role;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  address: string;
  tax_rate: number;
  currency: string;
}

export interface AppData {
  categories: Category[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
  order_items: OrderItem[];
  profiles: Profile[];
  users: LocalUser[];
  settings: StoreSettings;
}
