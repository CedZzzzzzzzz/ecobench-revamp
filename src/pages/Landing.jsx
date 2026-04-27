import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌱</span>
              <span className="text-2xl font-bold text-eco-green">EcoBench</span>
            </div>
            <Link 
              to="/signin" 
              className="px-6 py-2 bg-eco-green text-white rounded-full hover:bg-eco-green-dark transition font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-8xl mb-6">🌱</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-eco-green">EcoBench</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A sustainable smart bench that combines renewable-powered device charging, 
            seating, and real-time energy monitoring for PUP Institute of Technology.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signin"
              className="px-8 py-4 bg-eco-green hover:bg-eco-green-dark text-white rounded-full font-bold transition"
            >
              Learn More →
            </Link>
            <Link
              to="/signin"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-white rounded-full font-bold transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">100% renewable solar energy</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🔋</div>
              <h3 className="text-xl font-bold mb-2">Smart Charging</h3>
              <p className="text-gray-600">4 USB charging ports</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-gray-600">Live energy data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 EcoBench. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Polytechnic University of the Philippines - Institute of Technology
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing