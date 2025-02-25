export interface User {
  id: string
  name: string
  email: string
  username: string
  password: string
  role: 'Admin' | 'Super User' | 'Management' | 'User'
  avatar: string
  created_at?: string
  updated_at?: string
}
