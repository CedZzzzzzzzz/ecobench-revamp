import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FAQ_ITEMS } from '../data/siteData';
import '../styles/pages.css';

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', icon: '🌟', label: 'All Questions' },
    { id: 'general', icon: '📋', label: 'General' },
    { id: 'technical', icon: '⚙️', label: 'Technical' },
    { id: 'charging', icon: '⚡', label: 'Charging' },
    { id: 'maintenance', icon: '🔧', label: 'Maintenance' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard' }
  ];

  const filteredFAQs = useMemo(() => {
    let results = FAQ_ITEMS;

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
      );
    }

    return results;
  }, [selectedCategory, searchTerm]);

  const getBadgeClass = (badgeClass) => {
    const classes = {
      'badge-general': 'bg-blue-100 text-blue-700',
      'badge-technical': 'bg-purple-100 text-purple-700',
      'badge-charging': 'bg-orange-100 text-orange-700',
      'badge-maintenance': 'bg-green-100 text-green-700',
      'badge-dashboard': 'bg-pink-100 text-pink-700'
    };
    return classes[badgeClass] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e2945] via-[#1e2945] to-[#0f0f1e]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="faq-hero relative py-32 px-4 pt-40">
        <div className="absolute inset-0 bg-slate-900 -z-10"></div>

        {/* Floating icons */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {['?', '💡', '?', '⚡', '?', '✨'].map((icon, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-20 font-bold"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
                animation: `float ${12 + i}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="faq-hero-badge">
            <span className="faq-badge-pulse"></span>
            <span>Help Center</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 mb-8">Everything you need to know about EcoBench</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg bg-white/10 backdrop-blur border-2 border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-green-500 transition-all"
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 30px rgba(111, 168, 58, 0.6), 0 0 60px rgba(111, 168, 58, 0.3)';
                e.target.style.borderColor = 'rgb(111, 168, 58)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-8 px-4 bg-[#dfe0e4]">
        {/* Wave Background */}
        <div className="wave-container">
          <div className="wave"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-button flex items-center gap-2 px-4 py-3 rounded-full font-bold transition-all transform ${
                  selectedCategory === category.id
                    ? 'active bg-[#6ea83a] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 shadow-md hover:shadow-lg hover:-translate-y-1 hover:text-white'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto max-w-3xl">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-[#80b843] transition-all"
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="w-full p-6 flex items-start justify-between gap-4 text-left transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getBadgeClass(faq.badgeClass)}`}>
                        {faq.badge}
                      </div>
                      <h3 className={`text-lg font-bold transition-colors ${
                        activeIndex === index ? 'text-[#80b843]' : 'text-gray-900 hover:text-[#80b843]'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center transform transition-transform ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}>
                      <svg
                        className="w-6 h-6 text-[#80b843]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </button>

                  {activeIndex === index && (
                    <div className="px-6 pb-6 border-t-2 border-gray-100">
                      <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg border-l-4 border-[#80b843]">
                        <p className="text-gray-700 leading-relaxed text-base text-justify">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your search or category filters</p>
            </div>
          )}

          {/* FAQ Stats */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '💡', number: '15+', label: 'Questions Answered' },
              { icon: '⚡', number: '24/7', label: 'Support Available' },
              { icon: '🎯', number: '100%', label: 'Satisfaction Goal' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-green-500 hover:shadow-xl transform hover:-translate-y-2 transition-all">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
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
              to="/about"
              className="cta-button-secondary inline-flex items-center gap-2 px-10 py-4 font-bold rounded-full transition-all border-2"
              style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
