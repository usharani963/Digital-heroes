import './Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signUp } from '../services/authService'

function Signup() {

  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(event) {

    event.preventDefault()

    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {

      const data = await signUp(
        fullName,
        email,
        password
      )

      if (data.session) {

        navigate('/dashboard')

      } else {

        setMessage(
          'Account created successfully. Please check your email to confirm your account.'
        )

      }

    } catch (err) {

      setError(
        err.message || 'Unable to create account.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="signup-page">

      {/* LEFT SECTION */}

      <section className="signup-left">

        <div className="signup-brand">
          <Link to="/">
            Digital Heroes
          </Link>
        </div>

        <div className="signup-content">

          <p className="signup-eyebrow">
            JOIN THE COMMUNITY
          </p>

          <h1>
            Play with
            <span>purpose.</span>
          </h1>

          <p className="signup-description">
            Create your Digital Heroes account,
            support a charity you care about,
            track your golf performance, and take
            part in the monthly draw.
          </p>

        </div>

        <div className="signup-footer">
          Play • Give • Win
        </div>

      </section>


      {/* RIGHT SECTION */}

      <section className="signup-right">

        <div className="signup-card">

          <h2>
            Create your account
          </h2>

          <p className="signup-subtitle">
            Join Digital Heroes and make your game mean more.
          </p>


          {/* ERROR */}

          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {message && (
            <div className="signup-success">
              {message}
            </div>
          )}


          <form
            className="signup-form"
            onSubmit={handleSignup}
          >

            {/* FULL NAME */}

            <div className="signup-form-group">

              <label htmlFor="fullName">
                Full name
              </label>

              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
              />

            </div>


            {/* EMAIL */}

            <div className="signup-form-group">

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

            <div className="signup-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="signup-form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />

            </div>


            {/* TERMS */}

            <div className="terms-row">

              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                I agree to the Digital Heroes
                terms and conditions.
              </label>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >

              {loading
                ? 'Creating account...'
                : 'Create Account'
              }

            </button>

          </form>


          <div className="signup-divider">
            <span>
              OR
            </span>
          </div>


          <p className="login-text">
            Already have an account?

            <Link to="/login">
              Login
            </Link>
          </p>


          <Link
            to="/"
            className="signup-back-home"
          >
            ← Back to Digital Heroes
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Signup