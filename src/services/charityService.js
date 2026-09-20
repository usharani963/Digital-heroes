import { supabase } from '../lib/supabase'

// Get all charities
export async function getCharities() {
  const { data, error } = await supabase
    .from('charities')
    .select('*')
    .order('featured', { ascending: false })
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
}


// Get the logged-in user's selected charity
export async function getMyCharitySelection() {
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
    .from('charity_selections')
    .select(`
      *,
      charities (*)
    `)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}


// Save or update the user's charity selection
export async function saveCharitySelection(
  charityId,
  contributionPercentage
) {
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

  const percentage = Number(contributionPercentage)

  // PRD requirement: minimum 10%
  if (percentage < 10) {
    throw new Error(
      'Contribution percentage must be at least 10%.'
    )
  }

  if (percentage > 100) {
    throw new Error(
      'Contribution percentage cannot exceed 100%.'
    )
  }

  const { data, error } = await supabase
    .from('charity_selections')
    .upsert(
      {
        user_id: user.id,
        charity_id: charityId,
        contribution_percentage: percentage,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id'
      }
    )
    .select(`
      *,
      charities (*)
    `)
    .single()

  if (error) {
    throw error
  }

  return data
}