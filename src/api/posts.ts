import { apiFetch } from './client'
import type { Post } from '@/types/post'

interface JsonPlaceholderPost {
  userId: number
  id: number
  title: string
  body: string
}

function localizePost(post: JsonPlaceholderPost): Post {
  return {
    userId: post.userId,
    id: post.id,
    title: `Элемент #${post.id}`,
    body: `Тут будет элемент ${post.id}.`,
  }
}

function createFallbackPosts(page: number, limit: number): Post[] {
  const start = (page - 1) * limit
  return Array.from({ length: limit }, (_, index) => {
    const id = start + index + 1
    return localizePost({
      userId: 1,
      id,
      title: '',
      body: '',
    })
  })
}

export async function fetchPosts(page: number, limit = 10): Promise<Post[]> {
  try {
    const response = await apiFetch(`/posts?_page=${page}&_limit=${limit}`)
    if (!response.ok) {
      throw new Error('Не удалось загрузить посты')
    }

    const posts = (await response.json()) as JsonPlaceholderPost[]
    return posts.map(localizePost)
  } catch {
    if (page > 2) return []
    return createFallbackPosts(page, limit)
  }
}
