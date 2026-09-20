export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string
  owner: string
  createdAt: string
  updatedAt: string
}