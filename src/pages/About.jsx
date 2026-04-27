import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TEAM_MEMBERS, PROJECT_STATS, CORE_VALUES } from '../data/siteData';
import '../styles/pages.css';

export default function About() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-decoration">
          {/* Floating Icons */}
          <div className="floating-elements">
            <div className="float-element" style={{ '--x': '10%', '--y': '20%', '--delay': '0s' }}>🌱</div>
            <div className="float-element" style={{ '--x': '85%', '--y': '15%', '--delay': '1s' }}>⚡</div>
            <div className="float-element" style={{ '--x': '15%', '--y': '70%', '--delay': '2s' }}>💡</div>
            <div className="float-element" style={{ '--x': '80%', '--y': '75%', '--delay': '3s' }}>🔋</div>
            <div className="float-element" style={{ '--x': '50%', '--y': '50%', '--delay': '1.5s' }}>♻️</div>
          </div>
        </div>

        <div className="container">
          <div className="about-hero-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              Our Story
            </div>
            <h1 className="glitch-text" data-text="Meet the Team Behind EcoBench">Meet the Team Behind EcoBench</h1>
            <div className="typewriter-wrapper">
              <p className="typewriter-text">Five passionate students united by a vision to create a greener campus</p>
            </div>
            {/* Animated Scroll Arrow */}
            <div className="scroll-arrow-container">
              <div className="scroll-arrow">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-grid">
            {PROJECT_STATS.map((stat, index) => (
              <div key={index} className="stat-item" style={{ '--delay': `${index * 0.1}s` }}>
                <div className="stat-icon-large">{stat.icon}</div>
                <div className="stat-details">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-description">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What Drives Us</span>
            <h2>Mission & Vision</h2>
          </div>

          <div className="mission-vision-grid">
            {/* Mission Card */}
            <div className="mission-card">
              <div className="card-icon-wrapper">
                <div className="card-icon-bg"></div>
                <div className="card-icon">🎯</div>
              </div>
              <h2>Our Mission</h2>
              <p>To revolutionize campus infrastructure by integrating renewable energy solutions that provide both functionality and sustainability. We aim to create smart benches that serve as charging stations while promoting environmental awareness.</p>
              <div className="mission-highlights">
                <div className="highlight-item">✓ Clean Energy Integration</div>
                <div className="highlight-item">✓ Smart Campus Solutions</div>
                <div className="highlight-item">✓ Environmental Advocacy</div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="mission-card">
              <div className="card-icon-wrapper">
                <div className="card-icon-bg"></div>
                <div className="card-icon">🔭</div>
              </div>
              <h2>Our Vision</h2>
              <p>A future where every campus facility harnesses clean energy, reducing carbon footprints while enhancing student experience. EcoBench is our step toward making sustainability accessible and practical.</p>
              <div className="mission-highlights">
                <div className="highlight-item">✓ Zero-Carbon Campus</div>
                <div className="highlight-item">✓ Enhanced Student Life</div>
                <div className="highlight-item">✓ Accessible Sustainability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values-section">
        <div className="values-bg-pattern"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-label light">Foundation</span>
            <h2 style={{ color: 'white' }}>Our Core Values</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>The principles that guide everything we do</p>
          </div>

          <div className="values-grid">
            {CORE_VALUES.map((value, index) => (
              <div key={index} className="value-card" style={{ '--delay': `${index * 0.15}s` }}>
                <div className="value-icon-wrapper">
                  <div className="value-icon">{value.icon}</div>
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
                <div className="value-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="team-section">
        <div className="team-bg-decoration">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-dots"></div>
        </div>

        <div className="container">
          <div className="section-header">
            <span className="section-label">The Innovators</span>
            <h2>Meet Our Team</h2>
            <p>The minds behind EcoBench's sustainable technology</p>
          </div>

          <div className="team-grid">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="team-card" data-color={member.color} style={{ '--delay': `${index * 0.15}s` }}>
                <div className="team-card-inner">
                  {/* Front of card */}
                  <div className="team-card-front">
                    <div className="team-image-wrapper">
                      <div className="team-image-bg"></div>
                      <img src={member.image} alt={member.name} className="team-image" />
                      <div className="team-overlay">
                        <div className="flip-hint">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="team-info">
                      <h3>{member.name}</h3>
                      <p className="team-role">{member.role}</p>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div className="team-card-back">
                    <div className="team-back-content">
                      <div className="team-member-number">{String(index + 1).padStart(2, '0')}</div>
                      <h3>{member.name}</h3>
                      <p className="team-bio">{member.bio}</p>

                      <div className="team-expertise">
                        <h4>Expertise</h4>
                        <div className="expertise-tags">
                          {member.expertise.map((skill, i) => (
                            <span key={i} className="expertise-tag">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <div className="team-social">
                        {member.social.facebook && (
                          <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          </a>
                        )}
                        {member.social.github && (
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section relative py-24 px-4 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 -z-10"></div>

        {/* Glow Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-500/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="cta-icon-float w-24 h-24 rounded-full flex items-center justify-center text-5xl" style={{ backgroundColor: 'rgba(60, 60, 60, 0.6)' }}>
              💬
            </div>
          </div>
          
          <div className="inline-block px-6 py-2 mb-8" style={{ backgroundColor: 'rgba(111, 168, 58, 0.2)', border: '1px solid #86AD39', borderRadius: '9999px' }}>
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#f4c430' }}>Get In Touch</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 text-white">Want to Learn More?</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions about our project, suggestions for improvement, or opportunities for collaboration, feel free to reach out.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/contact"
              className="cta-button-primary inline-flex items-center gap-2 px-10 py-4 font-bold rounded-full transition-all"
              style={{ backgroundColor: '#86AD39', color: 'white' }}
            >
              <span>Contact Us</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10H16M16 10L10 4M16 10L10 16" />
              </svg>
            </Link>
            <Link
              to="/faqs"
              className="cta-button-secondary inline-flex items-center gap-2 px-10 py-4 font-bold rounded-full transition-all border-2"
              style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
            >
              View FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
