import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/',
          '/login',
        ],
      },
    ],
    sitemap: 'https://valuearch.com/sitemap.xml',
  }
}

