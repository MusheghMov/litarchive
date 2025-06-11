import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://litarchive.com' 
    : 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/books',
          '/books/*',
          '/articles',
          '/articles/*',
          '/community',
          '/community/*',
        ],
        disallow: [
          '/studio',
          '/studio/*',
          '/profile',
          '/profile/*',
          '/lists/*',
          '/api/*',
          '/_next/*',
          '/admin/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/books',
          '/books/*',
          '/articles',
          '/articles/*',
          '/community',
          '/community/*',
        ],
        disallow: [
          '/studio',
          '/studio/*',
          '/profile',
          '/profile/*',
          '/lists/*',
          '/api/*',
          '/_next/*',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}