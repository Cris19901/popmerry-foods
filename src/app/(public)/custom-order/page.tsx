import { getCustomConfig, getCustomOptions, getCustomOptionGroups } from '@/lib/custom-cake';
import CustomOrderClient from './CustomOrderClient';

export const metadata = {
  title: 'Customize Your Banana Cake — PopMerry Foods',
  description: 'Build your perfect banana cake — choose your base, add your flavours, set your sweetness, see the price instantly, and order for your event.',
};

export default async function CustomOrderPage() {
  const [config, options, groups] = await Promise.all([
    getCustomConfig(),
    getCustomOptions(),
    getCustomOptionGroups(),
  ]);
  return <CustomOrderClient config={config} options={options} groups={groups} />;
}
