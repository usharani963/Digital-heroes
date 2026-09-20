import { supabase } from '../lib/supabase'

export async function getMyScores() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export async function addScore(score, playedAt) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    throw new Error('You must be logged in to add a score.')
  }

  const { data, error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score: Number(score),
      played_at: playedAt
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  // Keep only the latest 5 scores
  const { data: allScores, error: fetchError } = await supabase
    .from('scores')
    .select('id, played_at')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })

  if (fetchError) {
    throw fetchError
  }

  if (allScores.length > 5) {
    const oldScores = allScores.slice(5)
    const oldIds = oldScores.map((item) => item.id)

    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .in('id', oldIds)

    if (deleteError) {
      throw deleteError
    }
  }

  return data
}

export async function updateScore(scoreId, score, playedAt) {
  const { data, error } = await supabase
    .from('scores')
    .update({
      score: Number(score),
      played_at: playedAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', scoreId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteScore(scoreId) {
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId)

  if (error) {
    throw error
  }
}