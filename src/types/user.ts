export type UserRole = 'Admin' | 'Manager' | 'User' | 'Guest'
export type UserStatus = 'active' | 'inactive' | 'pending'

export interface AppUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  registeredAt: string
}

export type UserSortKey = 'name' | 'email' | 'registeredAt'
export type SortOrder = 'ascend' | 'descend'
