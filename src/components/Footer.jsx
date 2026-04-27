import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social media icons - monochrome SVG
  const SocialIcons = () => (
    <div className="flex gap-3 mt-6 pl-1">
      {/* Facebook */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-slate-800 text-gray-400 hover:text-eco-green hover:bg-slate-700 transition p-2 rounded"
        title="Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* Twitter/X */}
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-slate-800 text-gray-400 hover:text-eco-green hover:bg-slate-700 transition p-2 rounded"
        title="Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-slate-800 text-gray-400 hover:text-eco-green hover:bg-slate-700 transition p-2 rounded"
        title="Instagram"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7a5 5 0 100 10 5 5 0 000-10z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      </a>
    </div>
  );

  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-gray-700">
      <div className="container mx-auto px-6 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="mb-6">
              <img src="assets/img/EcoBench%20Logo.png" alt="EcoBench" className="h-12" />
            </div>
            <SocialIcons />
          </div>

          {/* Right Section - Links grouped together */}
          <div className="grid grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/home" className="text-gray-400 hover:text-eco-green transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-gray-400 hover:text-eco-green transition">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-eco-green transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-eco-green transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h3 className="text-white font-bold mb-4">For Users</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/faqs" className="text-gray-400 hover:text-eco-green transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-eco-green transition">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold mb-4">Get In Touch</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">
                  <strong>Email:</strong> eco@ecobench.gmail.ph
                </li>
                <li className="text-gray-400">
                  <strong>Location:</strong> Polytechnic University of the Philippines, Manila
                </li>
                <li className="text-gray-400 mt-4">
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 grid place-items-center">
            <div className="text-sm text-gray-400 justify-center">
              <p>&copy; {currentYear} EcoBench. All rights reserved. | Sustainable Innovation for Polytechnic University of the Philippines</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
