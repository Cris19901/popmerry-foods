import { getSupabaseAdmin } from '@/lib/supabase';
import ReviewsAdminClient from './ReviewsAdminClient';

async function getReviews() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return <ReviewsAdminClient reviews={reviews} />;
}
