import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Charities.css'

import {
  getCharities,
  getMyCharitySelection,
  saveCharitySelection
} from '../services/charityService'

function Charities() {
  const [charities, setCharities] = useState([])
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [contributionPercentage, setContributionPercentage] = useState(10)

  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadCharities()
  }, [])

  async function loadCharities() {
    try {
      setLoading(true)
      setError('')

      const [charityData, selectionData] = await Promise.all([
        getCharities(),
        getMyCharitySelection()
      ])

      setCharities(charityData)

      if (selectionData) {
        setSelectedCharity(selectionData.charity_id)
        setContributionPercentage(
          selectionData.contribution_percentage
        )
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load charities.')
    } finally {
      setLoading(false)
    }
  }

  function handleSelectCharity(charityId) {
    setSelectedCharity(charityId)
    setSuccess('')
    setError('')
  }

  async function handleSave() {
    try {
      setError('')
      setSuccess('')

      if (!selectedCharity) {
        setError('Please select a charity first.')
        return
      }

      const percentage = Number(contributionPercentage)

      if (percentage < 10 || percentage > 100) {
        setError(
          'Contribution percentage must be between 10% and 100%.'
        )
        return
      }

      setSaving(true)

      await saveCharitySelection(
        selectedCharity,
        percentage
      )

      setSuccess(
        'Your charity selection has been saved successfully.'
      )
    } catch (err) {
      console.error(err)
      setError(
        err.message || 'Failed to save charity selection.'
      )
    } finally {
      setSaving(false)
    }
  }

  const filteredCharities = charities.filter((charity) =>
    charity.name
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="charities-loading">
        Loading charities...
      </div>
    )
  }

  return (
    <div className="charities-page">

      <div className="charities-container">

        {/* HEADER */}

        <div className="charities-header">

          <p className="eyebrow">
            MAKE AN IMPACT
          </p>

          <h1>
            Choose a charity
          </h1>

          <p>
            Choose a cause that matters to you.
            At least 10% of your subscription can
            go towards your chosen cause.
          </p>

        </div>


        {/* SEARCH */}

        <input
          type="text"
          className="charity-search"
          placeholder="Search charities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        {/* ERROR */}

        {error && (
          <div className="charity-message charity-error">
            {error}
          </div>
        )}


        {/* CHARITY GRID */}

        <div className="charities-grid">

          {filteredCharities.length === 0 ? (

            <div className="no-charities">
              No charities found.
            </div>

          ) : (

            filteredCharities.map((charity) => {

              const isSelected =
                selectedCharity === charity.id

              return (
                <div
                  key={charity.id}
                  className={`charity-card ${
                    isSelected ? 'selected' : ''
                  }`}
                >

                  <div className="charity-image-wrapper">

                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      className="charity-image"
                    />

                    {charity.featured && (
                      <div className="featured-badge">
                        Featured
                      </div>
                    )}

                  </div>


                  <div className="charity-content">

                    <h2>
                      {charity.name}
                    </h2>

                    <p className="charity-description">
                      {charity.description}
                    </p>

                    {charity.upcoming_golf_day && (
                      <div className="golf-day">
                        Upcoming Golf Day:{' '}
                        {charity.upcoming_golf_day}
                      </div>
                    )}

                    <button
                      type="button"
                      className={`select-charity-button ${
                        isSelected
                          ? 'selected-button'
                          : ''
                      }`}
                      onClick={() =>
                        handleSelectCharity(charity.id)
                      }
                    >
                      {isSelected
                        ? 'Selected'
                        : 'Select Charity'}
                    </button>

                  </div>

                </div>
              )
            })
          )}

        </div>


        {/* CONTRIBUTION */}

        <div className="contribution-section">

          <h2>
            Your charity contribution
          </h2>

          <p>
            Choose what percentage of your
            subscription you want to contribute.
            The minimum is 10%.
          </p>

          <input
            type="number"
            className="contribution-input"
            min="10"
            max="100"
            value={contributionPercentage}
            onChange={(e) =>
              setContributionPercentage(e.target.value)
            }
          />

          <span> %</span>


          <button
            type="button"
            className="save-charity-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Charity Selection'}
          </button>


          {success && (
            <div className="charity-message charity-success">
              {success}
            </div>
          )}

        </div>


        {/* BACK TO DASHBOARD */}

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Back to Dashboard
        </Link>

      </div>

    </div>
  )
}

export default Charities