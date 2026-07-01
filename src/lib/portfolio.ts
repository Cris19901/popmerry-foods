import { getSupabaseAdmin } from './supabase';

export interface PortfolioItem {
  id: string;
  image_url: string;
  image_path: string;
  title: string;
  event_type: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export async function getPortfolio(onlyVisible = true): Promise<PortfolioItem[]> {
  try {
    const db = getSupabaseAdmin();
    let query = db.from('portfolio').select('*').order('sort_order').order('created_at', { ascending: false });
    if (onlyVisible) query = query.eq('is_visible', true);
    const { data } = await query;
    return (data as PortfolioItem[]) ?? [];
  } catch {
    return [];
  }
}

export async function isPortfolioReady(): Promise<boolean> {
  try {
    const db = getSupabaseAdmin();
    const { error } = await db.from('portfolio').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
