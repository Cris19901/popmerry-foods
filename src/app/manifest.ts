import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PopMerry Foods',
    short_name: 'PopMerry',
    description: 'Handcrafted banana cakes, artisan croissants, and freshly popped popcorn delivered to your door.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A0800',
    theme_color: '#b45309',
    orientation: 'portrait',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
