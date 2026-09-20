import './Home.css'

function Home() {
  return (
    <div className="home-page">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-container">

          <a href="/" className="logo">
            Digital Heroes
          </a>

          <nav className="nav-links">
            <a href="#home">
              Home
            </a>

            <a href="/charities">
              Charities
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <a href="/login">
              Login
            </a>
          </nav>

          <a
            href="/signup"
            className="nav-subscribe"
          >
            Subscribe
          </a>

        </div>
      </header>


      {/* HERO SECTION */}
      <main>

        <section
          id="home"
          className="hero"
        >
          <div className="hero-container">

            <div className="hero-content">

              <p className="eyebrow">
                PLAY WITH PURPOSE
              </p>

              <h1>
                Your game can
                <span>
                  change lives.
                </span>
              </h1>

              <p className="hero-description">
                Track your golf performance,
                support causes that matter to you,
                and get a chance to win every month.
              </p>

              <div className="hero-buttons">

                <a
                  href="/signup"
                  className="primary-button"
                >
                  Subscribe Now
                </a>

                <a
                  href="/charities"
                  className="secondary-button"
                >
                  Explore Charities
                </a>

              </div>

            </div>


            {/* HERO VISUAL */}
            <div className="hero-visual">

              <div className="visual-background">

                <div className="impact-card">

                  <p>
                    YOUR IMPACT
                  </p>

                  <h3>
                    Every round matters.
                  </h3>

                  <span>
                    Play • Give • Win
                  </span>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* FEATURES */}
        <section className="features">

          <div className="features-container">

            <div className="feature-card">

              <div className="feature-number">
                01
              </div>

              <h3>
                Track Your Game
              </h3>

              <p>
                Record your Stableford scores
                and follow your performance
                over time.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                02
              </div>

              <h3>
                Give Back
              </h3>

              <p>
                Choose a charity and direct part
                of your subscription towards a
                cause you care about.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                03
              </div>

              <h3>
                Monthly Draw
              </h3>

              <p>
                Take part in the monthly draw
                and get your chance to win.
              </p>

            </div>

          </div>

        </section>


        {/* CHARITY SECTION */}
        <section
          id="charities"
          className="charity-section"
        >

          <div className="charity-container">

            <div className="charity-text">

              <p className="eyebrow">
                MAKE AN IMPACT
              </p>

              <h2>
                Your subscription
                <span>
                  gives back.
                </span>
              </h2>

              <p>
                Choose a charity that means
                something to you. A minimum
                of 10% of your subscription goes
                towards your chosen cause.
              </p>

              <a
                href="/charities"
                className="primary-button"
              >
                Explore Charities
              </a>

            </div>


            <div className="charity-stat">

              <div className="stat-number">
                10%
              </div>

              <p>
                Minimum contribution
                to your chosen charity
              </p>

            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="how-section"
        >

          <div className="how-container">

            <p className="eyebrow">
              SIMPLE AS THREE STEPS
            </p>

            <h2>
              Play. Give. Win.
            </h2>


            <div className="steps">

              <div className="step">

                <div className="step-number">
                  1
                </div>

                <h3>
                  Subscribe
                </h3>

                <p>
                  Choose a monthly or yearly
                  membership.
                </p>

              </div>


              <div className="step">

                <div className="step-number">
                  2
                </div>

                <h3>
                  Play & Give
                </h3>

                <p>
                  Track your scores and support
                  your chosen charity.
                </p>

              </div>


              <div className="step">

                <div className="step-number">
                  3
                </div>

                <h3>
                  Enter the Draw
                </h3>

                <p>
                  Take part in the monthly draw
                  and get your chance to win.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* CTA SECTION */}
        <section className="cta-section">

          <div className="cta-container">

            <p className="eyebrow">
              JOIN DIGITAL HEROES
            </p>

            <h2>
              Ready to make your
              <span>
                game mean more?
              </span>
            </h2>

            <p>
              Join Digital Heroes today.
            </p>

            <a
              href="/signup"
              className="primary-button"
            >
              Subscribe Now
            </a>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-container">

          <div>
            <strong>
              Digital Heroes
            </strong>

            <p>
              Play. Give. Win.
            </p>
          </div>


          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="/charities">
              Charities
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

          </div>


          <p className="copyright">
            © 2026 Digital Heroes
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Home