import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api/client'

const DEMO_EMAIL = 'demo@taskflow.com'
const DEMO_PASSWORD = 'Demo1234!'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (emailValue: string, passwordValue: string) => {
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', {
        email: emailValue,
        password: passwordValue,
      })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-slate-800 p-8 rounded-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-white">Log in to TaskFlow</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-indigo-600 text-white font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <button
          type="button"
          onClick={() => login(DEMO_EMAIL, DEMO_PASSWORD)}
          disabled={loading}
          className="w-full py-2 rounded border border-indigo-400 text-indigo-300 font-semibold hover:bg-slate-700 disabled:opacity-50"
        >
          Try demo account
        </button>
        <p className="text-xs text-slate-500">
          The first login may take up to a minute while the server wakes up.
        </p>

        <p className="text-sm text-slate-400">
          No account yet?{' '}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login