export interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  image: string;
  description: string;
  sizes: number[];
  isCustomImport?: boolean; // flags if created dynamically by admin
}

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered";
  courierTracking?: string;
  deliveryAddress?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SneakerTelemetryData {
  name: string;
  clicks: number;
  adds: number;
  orders: number;
}
