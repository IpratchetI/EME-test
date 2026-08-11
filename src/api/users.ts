import { apiFetch } from './client'
import type { AppUser, UserRole, UserStatus } from '@/types/user'

interface JsonPlaceholderUser {
  id: number
  name: string
  email: string
  username: string
}

const roles: UserRole[] = ['Admin', 'Manager', 'User', 'Guest']
const statuses: UserStatus[] = ['active', 'inactive', 'pending']
const TOTAL_USERS = 60

function enrichUser(user: JsonPlaceholderUser, index: number): AppUser {
  const day = (index % 28) + 1
  const month = (index % 12) + 1
  const year = 2022 + (index % 4)
  const number = index + 1

  return {
    id: user.id,
    name: `Пользователь ${number}`,
    email: user.email,
    role: roles[index % roles.length],
    status: statuses[index % statuses.length],
    registeredAt: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

function expandUsers(base: JsonPlaceholderUser[]): AppUser[] {
  const expanded: AppUser[] = []
  const batches = Math.ceil(TOTAL_USERS / Math.max(base.length, 1))

  for (let batch = 0; batch < batches; batch += 1) {
    base.forEach((user, index) => {
      const absoluteIndex = batch * base.length + index
      if (absoluteIndex >= TOTAL_USERS) return

      const number = absoluteIndex + 1
      expanded.push(
        enrichUser(
          {
            ...user,
            id: number,
            email: `user${number}@example.com`,
          },
          absoluteIndex,
        ),
      )
    })
  }

  return expanded
}

function createFallbackUsers(): JsonPlaceholderUser[] {
  return Array.from({ length: 10 }, (_, index) => {
    const number = index + 1
    return {
      id: number,
      name: `User ${number}`,
      email: `user${number}@example.com`,
      username: `user${number}`,
    }
  })
}

export async function fetchUsers(): Promise<AppUser[]> {
  try {
    const response = await apiFetch('/users')
    if (!response.ok) {
      throw new Error('Не удалось загрузить пользователей')
    }

    const base = (await response.json()) as JsonPlaceholderUser[]
    if (!Array.isArray(base) || base.length === 0) {
      throw new Error('API вернул пустой список пользователей')
    }

    return expandUsers(base)
  } catch {
    return expandUsers(createFallbackUsers())
  }
}
