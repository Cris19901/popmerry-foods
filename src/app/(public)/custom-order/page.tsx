import { getCustomConfig, getCustomOptions } from '@/lib/custom-cake';
import CustomOrderClient from './CustomOrderClient';

export const metadata = {
  title: 'Build Your Custom Cake — PopMerry Foods',
  description: 'Design your dream cake — choose your flavour, toppings and size, see the price instantly, and order for your event.',
};

export default async function CustomOrderPage() {
  const [config, options] = await Promise.all([getCustomConfig(), getCustomOptions()]);
  return <CustomOrderClient config={config} options={options} />;
}
