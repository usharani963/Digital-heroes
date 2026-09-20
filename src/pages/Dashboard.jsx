import './Dashboard.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMyProfile, signOut } from '../services/authService'
import {
  getMyScores,
  addScore,
  updateScore,
  deleteScore
} from '../services/scoreService'


function Dashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [scores, setScores] = useState([])

  const [loading, setLoading] = useState(true)
  const [scoreLoading, setScoreLoading] = useState(false)

  const [showScoreForm, setShowScoreForm] = useState(false)

  const [score, setScore] = useState('')
  const [scoreDate, setScoreDate] = useState('')

  const [editingId, setEditingId] = useState(null)

  const [error, setError] = useState('')
  const [scoreError, setScoreError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profileData = await getMyProfile()

        if (!profileData) {
          navigate('/login')
          return
        }

        setProfile(profileData)

        const scoreData = await getMyScores()
        setScores(scoreData)
      } catch (error) {
        console.error('Unable to load dashboard:', error)
        setError(error.message || 'Unable to load dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  async function handleLogout() {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  function openAddScoreForm() {
    setEditingId(null)
    setScore('')
    setScoreDate('')
    setScoreError('')
    setShowScoreForm(true)
  }

  function openEditScoreForm(scoreItem) {
    setEditingId(scoreItem.id)
    setScore(scoreItem.score)
    setScoreDate(scoreItem.score_date)
    setScoreError('')
    setShowScoreForm(true)
  }

  function closeScoreForm() {
    setShowScoreForm(false)
    setEditingId(null)
    setScore('')
    setScoreDate('')
    setScoreError('')
  }

  async function handleScoreSubmit(event) {
    event.preventDefault()
    setScoreError('')

    const numericScore = Number(score)

    if (!scoreDate) {
      setScoreError('Please select a score date.')
      return
    }

    if (numericScore < 1 || numericScore > 45) {
      setScoreError('Stableford score must be between 1 and 45.')
      return
    }

    setScoreLoading(true)

    try {
      if (editingId) {
        await updateScore(editingId, numericScore, scoreDate)
      } else {
        await addScore(numericScore, scoreDate)
      }

      const updatedScores = await getMyScores()
      setScores(updatedScores)

      closeScoreForm()
    } catch (error) {
      console.error('Score operation failed:', error)

      if (error.code === '23505') {
        setScoreError('You already have a score for this date.')
      } else {
        setScoreError(error.message || 'Unable to save score.')
      }
    } finally {
      setScoreLoading(false)
    }
  }

  async function handleDeleteScore(scoreId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this score?'
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteScore(scoreId)

      const updatedScores = await getMyScores()
      setScores(updatedScores)
    } catch (error) {
      console.error('Delete score failed:', error)
      setScoreError(error.message || 'Unable to delete score.')
    }
  }

  function formatScoreDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`)

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    )
  }

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <Link to="/" className="dashboard-logo">
          Digital Heroes
        </Link>

        <div className="dashboard-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/charities">Charities</Link>
          <Link to="/">Home</Link>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      {/* MAIN */}

      <main className="dashboard-main">

        {/* HEADER */}

        <section className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              YOUR DIGITAL HEROES
            </p>

            <h1>
              Welcome back, {profile?.full_name || 'Hero'}!
            </h1>

            <p>
              Track your game, support your charity,
              and see your draw participation.
            </p>
          </div>

		<Link
 			 to="/subscribe"
  			className="dashboard-subscribe-btn"
		>
            Manage Subscription
          </Link>

        </section>


        {/* GENERAL ERROR */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* SUBSCRIPTION */}

        <section className="dashboard-section">

          <h2>Subscription</h2>

          <div className="subscription-card">

            <div className="subscription-info">

              <span className="status-badge">
                Active
              </span>

              <h3>
                Digital Heroes Monthly
              </h3>

              <p>
                Your subscription is active.
              </p>

            </div>

            <div className="subscription-date">

              <span>
                Renewal date
              </span>

              <strong>
                15 October 2026
              </strong>

            </div>

          </div>

        </section>


        {/* SCORE + CHARITY */}

        <section className="dashboard-grid">

          {/* SCORES */}

          <div className="dashboard-card">

            <div className="card-header">

              <div>
                <span className="card-label">
                  PERFORMANCE
                </span>

                <h2>
                  My Scores
                </h2>
              </div>

              <button
                className="card-action"
                onClick={openAddScoreForm}
              >
                + Add Score
              </button>

            </div>


            {/* SCORE FORM */}

            {showScoreForm && (

              <div className="score-form-box">

                <h3>
                  {editingId ? 'Edit Score' : 'Add Score'}
                </h3>

                {scoreError && (
                  <div className="score-error">
                    {scoreError}
                  </div>
                )}

                <form onSubmit={handleScoreSubmit}>

                  <div className="score-form-group">

                    <label htmlFor="score">
                      Stableford Score
                    </label>

                    <input
                      id="score"
                      type="number"
                      min="1"
                      max="45"
                      value={score}
                      onChange={(event) =>
                        setScore(event.target.value)
                      }
                      placeholder="Enter score (1–45)"
                      required
                    />

                  </div>


                  <div className="score-form-group">

                    <label htmlFor="scoreDate">
                      Score Date
                    </label>

                    <input
                      id="scoreDate"
                      type="date"
                      value={scoreDate}
                      onChange={(event) =>
                        setScoreDate(event.target.value)
                      }
                      required
                    />

                  </div>


                  <div className="score-form-actions">

                    <button
                      type="submit"
                      className="save-score-button"
                      disabled={scoreLoading}
                    >
                      {scoreLoading
                        ? 'Saving...'
                        : editingId
                          ? 'Update Score'
                          : 'Add Score'}
                    </button>

                    <button
                      type="button"
                      className="cancel-score-button"
                      onClick={closeScoreForm}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            )}


            {/* SCORE LIST */}

            {scores.length === 0 ? (

              <div className="empty-scores">

                <p>
                  No scores added yet.
                </p>

                <span>
                  Add your first Stableford score.
                </span>

              </div>

            ) : (

              <div className="scores-list">

                {scores.map((scoreItem) => (

                  <div
                    className="score-row"
                    key={scoreItem.id}
                  >

                    <span>
                      {formatScoreDate(scoreItem.score_date)}
                    </span>

                    <strong>
                      {scoreItem.score}
                    </strong>

                    <div className="score-actions">

                      <button
                        onClick={() =>
                          openEditScoreForm(scoreItem)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteScore(scoreItem.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

            <p className="score-note">
              Your latest 5 Stableford scores
            </p>

          </div>


          {/* CHARITY */}

          <div className="dashboard-card charity-card">

            <span className="card-label">
              YOUR IMPACT
            </span>

            <h2>
              My Charity
            </h2>

            <div className="charity-placeholder">

              <div className="charity-icon">
                ♥
              </div>

              <div>

                <h3>
                  Your Selected Charity
                </h3>

                <p>
                  10% of your subscription supports
                  your chosen cause.
                </p>

              </div>

            </div>

            <div className="contribution-box">

              <span>
                Contribution
              </span>

              <strong>
                10%
              </strong>

            </div>

            <button className="secondary-button">
              Change Charity
            </button>

          </div>

        </section>


        {/* DRAW */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="card-label">
                MONTHLY REWARD
              </span>

              <h2>
                Draw Participation
              </h2>

            </div>

            <span className="draw-status">
              ENTERED
            </span>

          </div>

          <div className="draw-card">

            <div className="draw-item">
              <span>Next Draw</span>
              <strong>30 September 2026</strong>
            </div>

            <div className="draw-item">
              <span>Your Entry</span>
              <strong>Active</strong>
            </div>

            <div className="draw-item">
              <span>Draws Entered</span>
              <strong>3</strong>
            </div>

          </div>

        </section>


        {/* WINNINGS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="card-label">
                REWARDS
              </span>

              <h2>
                My Winnings
              </h2>

            </div>

          </div>

          <div className="empty-winnings">

            <div className="trophy">
              ★
            </div>

            <h3>
              No winnings yet
            </h3>

            <p>
              Keep playing and supporting your
              chosen charity. Your next draw could
              be your lucky one.
            </p>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="dashboard-footer">

        <span>
          Digital Heroes
        </span>

        <span>
          Play • Give • Win
        </span>

      </footer>

    </div>
  )
}

export default Dashboard