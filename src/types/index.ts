export type ProductCategory = 'banana-cake' | 'croissant' | 'bundle';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  emoji: string;
  imageId: string;
  gradientFrom: string;
  gradientTo: string;
  tag?: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryNote?: string;
}

export interface Order {
  id?: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'paid' | 'preparing' | 'delivered';
  paystackReference?: string;
  createdAt?: string;
}

export interface CustomOrderRequest {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  cakeQuantity: string;
  croissantQuantity: string;
  specialRequirements: string;
}
