import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Newche',
    short_name: 'Newche',
    description: '日程調整アプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 24x24 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}