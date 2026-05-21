import { getSupabaseAdmin } from './supabase';
import { products as staticProducts, formatPrice } from './products-data';
import type { Product } from '@/types';

export { formatPrice };

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: row.price as number,
    category: row.category as Product['category'],
    emoji: '',
    imageId: row.image_id as string,
    tag: (row.tag as string | null) ?? undefined,
    isAvailable: row.is_available as boolean,
    gradientFrom: row.gradient_from as string,
    gradientTo: row.gradient_to as string,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return staticProducts;
    return data.map(rowToProduct);
  } catch {
    return staticProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db.from('products').select('*').eq('id', id).single();
    if (error || !data) {
      return staticProducts.find(p => p.id === id) ?? null;
    }
    return rowToProduct(data);
  } catch {
    return staticProducts.find(p => p.id === id) ?? null;
  }
}

export async function isProductsTableReady(): Promise<boolean> {
  try {
    const db = getSupabaseAdmin();
    const { error } = await db.from('products').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
