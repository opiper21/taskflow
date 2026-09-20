import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import type { Task, TaskStatus } from '../types/task'

function Dashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get<Task[]>('/tasks')
        setTasks(res.data)
      } catch (err) {
        console.error('Failed to load tasks', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    setAdding(true)
    try {
      const res = await api.post<Task>('/tasks', { title })
      setTasks((prev) => [res.data, ...prev])
      setTitle('')
    } catch (err) {
      console.error('Failed to add task', err)
    } finally {
      setAdding(false)
    }
  }

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      const res = await api.put<Task>(`/tasks/${id}`, { status })
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)))
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800">
        <h1 className="text-xl font-bold text-white">TaskFlow</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600"
        >
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-2xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Your tasks</h2>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-slate-800 text-white outline-none"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-slate-400">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 rounded bg-slate-800 text-white"
              >
                <span
                    className={`wrap-break-word ${
                     task.status === 'done' ? 'line-through text-slate-400' : ''
                        }`}
                      >
                     {task.title}
                </span>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value as TaskStatus)
                    }
                    className="px-2 py-1 rounded bg-slate-700 text-white outline-none"
                  >
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default Dashboard