import { MetadataRoute } from 'next'
import honoClient from './honoRPCClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://litarchive.com' 
    : 'http://localhost:3000'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  // Dynamic community books
  let communityBooks: MetadataRoute.Sitemap = []
  try {
    const communityBooksResponse = await honoClient.community.books["public"].$get()
    if (communityBooksResponse.ok) {
      const books = await communityBooksResponse.json()
      communityBooks = books.map((book: any) => ({
        url: `${baseUrl}/books/${book.slug}`,
        lastModified: book.updatedAt || book.createdAt ? new Date(book.updatedAt || book.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching community books for sitemap:', error)
  }

  // Dynamic articles
  let articles: MetadataRoute.Sitemap = []
  try {
    const articlesResponse = await honoClient.articles.$get({
      query: { search: '' }
    })
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json()
      articles = articlesData.map((article: any) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: article.updatedAt || article.createdAt ? new Date(article.updatedAt || article.createdAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
  }

  // Dynamic community book details
  let communityBookDetails: MetadataRoute.Sitemap = []
  try {
    const communityBooksResponse = await honoClient.community.books["public"].$get()
    if (communityBooksResponse.ok) {
      const books = await communityBooksResponse.json()
      communityBookDetails = books.map((book: any) => ({
        url: `${baseUrl}/community/${book.slug}`,
        lastModified: book.updatedAt || book.createdAt ? new Date(book.updatedAt || book.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching community book details for sitemap:', error)
  }

  return [
    ...staticRoutes,
    ...communityBooks,
    ...articles,
    ...communityBookDetails,
  ]
}