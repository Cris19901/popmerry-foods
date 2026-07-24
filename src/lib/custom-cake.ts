import { getSupabaseAdmin } from './supabase';

export interface CustomOption {
  id: string;
  group_name: string;
  name: string;
  description: string | null;
  price_delta: number;
  is_available: boolean;
  sort_order: number;
}

export interface CustomOptionGroup {
  name: string;
  selection_type: 'single' | 'multi';
  required: boolean;
  sort_order: number;
}

export interface CustomConfig {
  base_price: number;
  base_label: string;
  lead_time_days: number;
}

const DEFAULT_CONFIG: CustomConfig = {
  base_price: 15000,
  base_label: 'Standard custom cake',
  lead_time_days: 5,
};

export async function getCustomConfig(): Promise<CustomConfig> {
  try {
    const db = getSupabaseAdmin();
    const { data } = await db.from('custom_config').select('*').eq('id', 1).single();
    if (!data) return DEFAULT_CONFIG;
    return { base_price: data.base_price, base_label: data.base_label, lead_time_days: data.lead_time_days };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function getCustomOptions(includeUnavailable = false): Promise<CustomOption[]> {
  try {
    const db = getSupabaseAdmin();
    let query = db.from('custom_options').select('*').order('group_name').order('sort_order');
    if (!includeUnavailable) query = query.eq('is_available', true);
    const { data } = await query;
    return (data as CustomOption[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCustomOptionGroups(): Promise<CustomOptionGroup[]> {
  try {
    const db = getSupabaseAdmin();
    const { data } = await db.from('custom_option_groups').select('*').order('sort_order');
    return (data as CustomOptionGroup[]) ?? [];
  } catch {
    return [];
  }
}

/** True when the custom_options / custom_config tables exist (migration run). */
export async function isCustomCakeReady(): Promise<boolean> {
  try {
    const db = getSupabaseAdmin();
    const { error } = await db.from('custom_options').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
