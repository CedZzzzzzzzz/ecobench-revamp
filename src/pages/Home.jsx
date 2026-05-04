import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FEATURES, SITE_TAGLINE } from '../data/siteData';
import '../styles/pages.css';

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    { src: '/assets/img/slide1.png', alt: 'EcoBench in campus environment' },
    { src: '/assets/img/slide2.png', alt: 'Solar-powered charging station' },
    { src: '/assets/img/slide3.png', alt: 'Students using EcoBench' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = (index) => {
    setSlideIndex(index % slides.length);
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Slideshow */}
        <div className="slideshow-container absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide fade absolute inset-0 ${
                index === slideIndex ? 'active' : ''
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className="slide-overlay absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
            </div>
          ))}
        </div>

        {/* Particles */}
        <div className="particles absolute inset-0 z-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle absolute w-4 h-4 bg-green-400 rounded-full opacity-20 animate-pulse" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + i}s ease-in-out infinite`
              }}
            ></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/50 rounded-full mb-6 backdrop-blur">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold uppercase tracking-wider">Sustainable Innovation</span>
          </div>

          <div className="hero-logo-wrapper mb-6 flex justify-center">
            <Link to="/home">
              <img src="assets/img/EcoBench Logo.png" alt="EcoBench" className="hero-logo" />
            </Link>
          </div>

          <p className="hero-description text-lg md:text-l leading-relaxed mb-8 text-gray-100">
            A sustainable smart bench that combines renewable-powered device charging, seating,
            and real-time energy monitoring for the use of Polytechnic University of the Philippines 
            Institute of Technology.
          </p>

          <div className="hero-buttons flex gap-4 justify-center flex-wrap mb-12">
            <Link
              to="/faqs"
              className="px-12 py-4 bg-eco-green hover:bg-eco-green-dark text-white rounded-full font-bold transition"
            >
              Learn More →
            </Link>
            <Link
              to="/contact"
              className="px-12 py-4 bg-white/20 backdrop-blur-md border-2 border-white/50 hover:bg-white/30 text-white rounded-full font-bold transition"
            >
              Get in Touch
            </Link>
          </div>

          {/* Slideshow Dots */}
          <div className="slideshow-dots flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => currentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === slideIndex
                    ? 'bg-green-400 w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6">
          <div className="section-header text-center mb-16 w-full">
            <span className="section-label text-olivegreen-600 font-semibold uppercase tracking-wider text-sm">What We Offer</span>
            <h2 className="font-bold text-gray-900 mt-2 mb-4 whitespace-normal" style={{ fontSize: '3.5rem' }}>Key Features</h2>
            <p className="text-gray-600" style={{ fontSize: '1.25rem' }}>Combining sustainability with smart technology</p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="feature-card group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300 -z-10"></div>
                
                <div className="text-5xl font-bold mb-4 opacity-60 text-slate-300" style={{ 
                  textAlign: 'right'
                }}>0{index + 1}</div>
                
                <div className="feature-icon-wrapper relative mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all`} style={{ 
                    backgroundColor: '#F8F8EA'
                  }}>
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-600 mb-4">{feature.description}</p>

                <div className="feature-stats flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-2xl font-bold" style={{ 
                      background: 'linear-gradient(to right, #f4c430, #86AD39)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{feature.stat}</div>
                    <div className="text-xs text-gray-500 font-medium">{feature.stat_label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="feature-highlights grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Fast Charging', desc: 'Quick power delivery' },
              { icon: '🔒', title: 'Secure Design', desc: 'Anti-theft protection' },
              { icon: '🌤️', title: 'Weather Resistant', desc: 'All-season durability' }
            ].map((item, index) => (
              <div key={index} className="highlight-card bg-white/50 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: '#F8F8EA' }}>{item.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 -z-10"></div>
        {/* Upper Left Glow - Hidden on mobile */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl -z-10 hidden md:block"></div>
        {/* Lower Right Glow - Hidden on mobile */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-500/30 rounded-full blur-3xl -z-10 hidden md:block"></div>

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
