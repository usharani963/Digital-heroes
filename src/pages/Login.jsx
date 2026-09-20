import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signIn } from '../services/authService'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event) {

    event.preventDefault()

    setError('')
    setLoading(true)

    try {

      await signIn(email, password)

      // Login successful
      navigate('/dashboard')

    } catch (err) {

      setError(
        err.message || 'Invalid email or password.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="login-page">

      {/* LEFT SECTION */}

      <section className="login-left">

        <div className="login-brand">
          <Link to="/">
            Digital Heroes
          </Link>
        </div>

        <div className="login-content">

          <p className="login-eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Your game.
            <span>Your impact.</span>
          </h1>

          <p className="login-description">
            Sign in to track your golf performance,
            support causes that matter to you, and
            take part in the monthly draw.
          </p>

        </div>

        <div className="login-footer">
          Play • Give • Win
        </div>

      </section>


      {/* RIGHT SECTION */}

      <section className="login-right">

        <div className="login-card">

          <h2>
            Welcome back
          </h2>

          <p className="login-subtitle">
            Login to your Digital Heroes account.
          </p>


          {/* ERROR MESSAGE */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="login-form-group">

              <div className="password-row">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#">
                  Forgot password?
                </a>

              </div>

              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? 'Logging in...'
                : 'Login'
              }

            </button>

          </form>


          <div className="login-divider">
            <span>
              OR
            </span>
          </div>


          <p className="signup-text">
            Don't have an account?

            <Link to="/signup">
              Create an account
            </Link>
          </p>


          <Link
            to="/"
            className="back-home"
          >
            ← Back to Digital Heroes
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Login