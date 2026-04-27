import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CONTACT_INFO } from '../data/siteData';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const officeHours = [
  { day: 'Monday - Friday', time: '8:00 AM - 5:00 PM' },
  { day: 'Saturday', time: '9:00 AM - 12:00 PM' },
  { day: 'Sunday', time: 'Closed', inactive: true }
];

const quickContacts = [
  {
    title: 'Phone / GCash',
    value: CONTACT_INFO.gcash,
    href: `tel:${CONTACT_INFO.gcash}`,
    note: 'Available for donations',
    icon: faPhone,
    iconClass: 'text-lime-700',
    hover: 'hover:border-lime-500 hover:shadow-lime-100/70'
  },
  {
    title: 'Email Us',
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    note: 'We reply within 24 hours',
    icon: faEnvelope,
    iconClass: 'text-sky-600',
    hover: 'hover:border-sky-500 hover:shadow-sky-100/70'
  },
  {
    title: 'Visit Us',
    value: `${CONTACT_INFO.location.name}\n${CONTACT_INFO.location.department}`,
    note: CONTACT_INFO.location.address,
    icon: faLocationDot,
    iconClass: 'text-amber-500',
    hover: 'hover:border-amber-400 hover:shadow-amber-100/70'
  }
];

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    className: 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600'
  },
  {
    label: 'Instagram',
    href: '#',
    className: 'bg-gradient-to-r from-orange-400 via-pink-600 to-fuchsia-700 hover:brightness-95'
  },
  {
    label: 'Twitter',
    href: '#',
    className: 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <Navbar />

      <section className="relative min-h-[520px] overflow-hidden bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f0f1e_100%)]
                           px-4 pb-28 pt-32 md:min-h-[600px] md:pb-36 md:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[12%] top-[22%] h-2 w-2 animate-pulse rounded-full bg-lime-400/70 shadow-[0_0_24px_rgba(163,230,53,0.9)]"></div>
          <div
            className="absolute left-[68%] top-[28%] h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-300/70 shadow-[0_0_24px_rgba(253,224,71,0.85)]"
            style={{ animationDelay: '0.7s' }}
          ></div>
          <div
            className="absolute left-[35%] top-[58%] h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300/70 shadow-[0_0_20px_rgba(190,242,100,0.85)]"
            style={{ animationDelay: '1.2s' }}
          ></div>
          <div
            className="absolute left-[82%] top-[48%] h-2 w-2 animate-pulse rounded-full bg-emerald-300/70 shadow-[0_0_22px_rgba(110,231,183,0.85)]"
            style={{ animationDelay: '1.8s' }}
          ></div>
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl"></div>
          <div className="absolute bottom-6 right-0 h-48 w-48 rounded-full bg-yellow-300/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-yellow-300 backdrop-blur-md md:text-xs">
            <span className="h-2 w-2 rounded-full bg-lime-300"></span>
            Let&apos;s Connect
          </div>

          <h1 className="mx-auto mb-5 max-w-5xl bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-5xl font-black leading-[0.95] text-transparent sm:text-6xl md:text-7xl">
            Get in Touch
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl md:text-2xl">
            We&apos;d love to hear from you. Whether you have a question, feedback, or just want to say hello.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full translate-y-px text-slate-50">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full">
            <path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,
                53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,
                120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      <section className="px-4 pb-10 pt-6 md:pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {quickContacts.map((item) => (
              <article
                key={item.title}
                className={`relative rounded-2xl border border-transparent bg-white p-5 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${item.hover}`}
              >
                <div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 rounded-t-2xl bg-gradient-to-r from-lime-500 to-amber-400 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-100 to-amber-100 text-2xl shadow-sm">
                   <FontAwesomeIcon icon={item.icon} className={item.iconClass} />
                </div>
                <h3 className="mb-2 font-['Space_Grotesk'] text-lg font-bold text-slate-900">{item.title}</h3>

                {item.href ? (
                  <a href={item.href} className="mb-1 block break-all text-sm font-bold text-[#6FA83A] hover:text-[#5a8a2f] sm:text-base">
                    {item.value}
                  </a>
                ) : (
                  <div className="space-y-0.5 text-sm font-semibold text-[#6FA83A] hover:text-[#5a8a2f] sm:text-base">
                    {item.value.split('\n').map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-sm italic text-slate-500">{item.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-amber-400"></div>
              <div className="p-5 sm:p-6">
                <div className="mb-6 text-center">
                  <div className="mb-3 text-6xl">✉️</div>
                  <h2 className="mb-2 bg-gradient-to-r from-lime-600 to-amber-500 bg-clip-text font-['Space_Grotesk'] text-2xl font-extrabold text-transparent sm:text-3xl">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-slate-500 sm:text-base">
                    Fill out the form below and we&apos;ll get back to you as soon as possible
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">👤 Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">📧 Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">📱 Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63 912 345 6789"
                      className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">💬 Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">📝 Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share your thoughts, questions, or feedback..."
                      rows="5"
                      className="min-h-[132px] w-full resize-y rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-600 to-lime-500 px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(101,163,13,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(101,163,13,0.38)] sm:text-base"
                  >
                    <span>Send Message</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>

                  {submitted && (
                    <div className="flex items-center gap-3 rounded-2xl border-2 border-lime-500 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Thank you! Your message has been sent successfully.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                <h3 className="mb-4 font-['Space_Grotesk'] text-xl font-bold text-slate-900">🕐 Office Hours</h3>
                <div className="space-y-3">
                  {officeHours.map((item) => (
                    <div
                      key={item.day}
                      className={`flex items-start justify-between gap-3 rounded-2xl px-4 py-3 ${item.inactive ? 'bg-slate-50 opacity-50' : 'bg-slate-50'}`}
                    >
                      <span className="text-sm font-semibold text-slate-800">{item.day}</span>
                      <span className={`text-right text-sm font-bold ${item.inactive ? 'text-slate-400' : 'text-[#6FA83A]'}`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                <h3 className="mb-2 font-['Space_Grotesk'] text-xl font-bold text-slate-900"> 🌐 Follow Us</h3>
                <p className="mb-4 text-sm text-slate-500">Stay connected on social media</p>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`block rounded-2xl px-4 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 ${social.className}`}
                    >
                      {social.label === 'Facebook' && '📘 '}
                      {social.label === 'Instagram' && '📷 '}
                      {social.label === 'Twitter' && '𝕏 '}
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                <h3 className="mb-2 font-['Space_Grotesk'] text-xl font-bold text-slate-900">🤔 Have Questions?</h3>
                <p className="mb-4 text-sm text-slate-500">Check out our FAQs for quick answers</p>
                <Link
                  to="/faqs"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-lime-600 to-lime-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(101,163,13,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(101,163,13,0.32)]"
                >
                  <span>Visit FAQ Page</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </aside>
          </div>

          <section className="mt-8 md:mt-10 overflow-hidden rounded-3xl bg-white shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-lime-50 to-amber-50 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div className="text-4xl">📍</div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">Find Us Here</h2>
                <p className="text-sm text-slate-600 sm:text-base">
                  {CONTACT_INFO.location.name} - {CONTACT_INFO.location.department}
                </p>
              </div>
            </div>

            <div className="h-[320px] w-full md:h-[380px]">
              <iframe
                title="EcoBench Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.356842735937!2d121.00849131483457!3d14.599578889796948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7c3c5a9e905%3A0xe8d7f166c088784!2sPolytechnic%20University%20of%20the%20Philippines!5e0!3m2!1sen!2sph!4v1705892775188!5m2!1sen!2sph"
                className="h-full w-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        </div>
      </section>

      {}
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
              to="/about"
              className="cta-button-primary inline-flex items-center gap-2 px-10 py-4 font-bold rounded-full transition-all"
              style={{ backgroundColor: '#86AD39', color: 'white' }}
            >
              <span>About Us</span>
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

      <Footer />
    </div>
  );
}
