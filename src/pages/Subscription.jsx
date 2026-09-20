import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Subscription.css'

import { supabase } from '../lib/supabase'
import { getMySubscription } from '../services/subscriptionService'

function Subscription() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    try {
      const data = await getMySubscription()
      setSubscription(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubscribe(plan) {
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          plan
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Unable to start checkout.'
        )
      }

      window.location.href = result.url
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  const isActive = subscription?.status === 'active'

  return (
    <div className="subscription-page">

      <div className="subscription-container">

        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="subscription-header">

          <span className="section-label">
            MEMBERSHIP
          </span>

          <h1>
            Choose your <span>membership</span>
          </h1>

          <p>
            Play your best. Support meaningful causes.
            Get your chance to win every month.
          </p>

        </div>

        {isActive && (
          <div className="current-subscription">

            <div>
              <strong>
                Your subscription is active
              </strong>

              <p>
                Current plan:{' '}
                {subscription.plan === 'monthly'
                  ? 'Monthly'
                  : 'Yearly'}
              </p>
            </div>

            <span className="active-badge">
              ACTIVE
            </span>

          </div>
        )}

        {loading ? (
          <div className="subscription-loading">
            Loading membership options...
          </div>
        ) : (
          <div className="plans-grid">

            {/* MONTHLY PLAN */}

            <div className="plan-card">

              <div className="plan-top">
                <span className="plan-name">
                  MONTHLY
                </span>
              </div>

              <div className="plan-price">
                <span className="currency">
                  ₹
                </span>

                <span className="amount">
                  299
                </span>

                <span className="period">
                  / month
                </span>
              </div>

              <p className="plan-description">
                Flexible membership for players who want
                to participate month by month.
              </p>

              <div className="plan-divider"></div>

              <ul className="plan-features">

                <li>
                  ✓ Monthly draw participation
                </li>

                <li>
                  ✓ Track your latest 5 scores
                </li>

                <li>
                  ✓ Choose your charity
                </li>

                <li>
                  ✓ Minimum 10% charity contribution
                </li>

                <li>
                  ✓ Eligible for monthly prizes
                </li>

              </ul>

              <button
                className="subscribe-button"
                disabled={isActive}
                onClick={() => handleSubscribe('monthly')}
              >
                {isActive && subscription.plan === 'monthly'
                  ? 'Current Plan'
                  : 'Subscribe Monthly'}
              </button>

            </div>


            {/* YEARLY PLAN */}

            <div className="plan-card featured-plan">

              <div className="popular-badge">
                BEST VALUE
              </div>

              <div className="plan-top">
                <span className="plan-name">
                  YEARLY
                </span>
              </div>

              <div className="plan-price">

                <span className="currency">
                  ₹
                </span>

                <span className="amount">
                  2,999
                </span>

                <span className="period">
                  / year
                </span>

              </div>

              <p className="plan-description">
                One simple yearly membership with
                continuous access to the monthly draws.
              </p>

              <div className="plan-divider"></div>

              <ul className="plan-features">

                <li>
                  ✓ Monthly draw participation
                </li>

                <li>
                  ✓ Track your latest 5 scores
                </li>

                <li>
                  ✓ Choose your charity
                </li>

                <li>
                  ✓ Minimum 10% charity contribution
                </li>

                <li>
                  ✓ Eligible for monthly prizes
                </li>

              </ul>

              <button
                className="subscribe-button featured-button"
                disabled={isActive}
                onClick={() => handleSubscribe('yearly')}
              >
                {isActive && subscription.plan === 'yearly'
                  ? 'Current Plan'
                  : 'Subscribe Yearly'}
              </button>

            </div>

          </div>
        )}

        <div className="subscription-note">

          <strong>
            Every membership makes an impact.
          </strong>

          <p>
            At least 10% of your subscription contribution
            goes to the charity you choose.
          </p>

        </div>

      </div>

    </div>
  )
}

export default Subscription