import { supabase } from '../lib/supabase'

// Get the currently logged-in user's subscription
export async function getMySubscription() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}


// Get subscription status
export async function getSubscriptionStatus() {
  const subscription = await getMySubscription()

  if (!subscription) {
    return {
      isActive: false,
      status: 'inactive',
      plan: null
    }
  }

  return {
    isActive: subscription.status === 'active',
    status: subscription.status,
    plan: subscription.plan,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end
  }
}


// Save subscription
// NOTE: This is useful for development/testing.
// In the final Stripe flow, subscription status should
// be updated securely by the Stripe webhook/backend.
export async function saveSubscription({
  plan,
  status = 'active'
}) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    throw new Error('You must be logged in.')
  }

  if (!['monthly', 'yearly'].includes(plan)) {
    throw new Error('Invalid subscription plan.')
  }

  if (
    ![
      'active',
      'inactive',
      'cancelled',
      'past_due',
      'expired'
    ].includes(status)
  ) {
    throw new Error('Invalid subscription status.')
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: user.id,
        plan,
        status,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id'
      }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}


// Cancel subscription
// This updates the database status for development.
// Actual Stripe cancellation should be handled by Stripe.
export async function cancelSubscription() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    throw new Error('You must be logged in.')
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}