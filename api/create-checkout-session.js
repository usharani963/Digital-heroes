import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  try {
    // Get logged-in user's access token
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'You must be logged in.'
      })
    }

    const accessToken = authHeader.replace('Bearer ', '')

    // Verify the user with Supabase
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      return res.status(401).json({
        error: 'Invalid or expired session.'
      })
    }

    // Get selected plan
    const { plan } = req.body

    let priceId

    if (plan === 'monthly') {
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID
    } else if (plan === 'yearly') {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID
    } else {
      return res.status(400).json({
        error: 'Invalid subscription plan.'
      })
    }

    if (!priceId) {
      return res.status(500).json({
        error: 'Stripe price is not configured.'
      })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',

      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],

      customer_email: user.email,

      client_reference_id: user.id,

      metadata: {
        user_id: user.id,
        plan: plan
      },

      subscription_data: {
        metadata: {
          user_id: user.id,
          plan: plan
        }
      },

      success_url:
        `${process.env.APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.APP_URL}/subscribe?payment=cancelled`
    })

    return res.status(200).json({
      url: session.url
    })

  } catch (error) {
    console.error('Stripe Checkout Error:', error)

    return res.status(500).json({
      error: error.message || 'Unable to create checkout session.'
    })
  }
}