import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-blue-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-primary-600/10 backdrop-blur-sm border border-primary-600/20 rounded-full">
              <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-primary-400">Evidence-Based Training Science</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none">
              <span className="text-white">Train</span>
              <br />
              <span className="bg-gradient-to-r from-primary-500 via-pink-500 to-primary-600 text-transparent bg-clip-text">Smarter</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered workout tracking with intelligent progression and volume optimization
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/register"
                className="group relative px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 shadow-xl shadow-primary-600/20 hover:shadow-2xl hover:shadow-primary-600/30 hover:-translate-y-0.5"
              >
                Start Training Free
                <svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Setup in 60 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.05] rounded-3xl p-8 hover:border-primary-600/30 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">RIR Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Track Reps in Reserve for precise progressive overload and fatigue management
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.05] rounded-3xl p-8 hover:border-blue-600/30 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Powered</h3>
              <p className="text-gray-400 leading-relaxed">
                Get intelligent workout suggestions powered by Claude AI and your training data
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.05] rounded-3xl p-8 hover:border-green-600/30 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Volume Science</h3>
              <p className="text-gray-400 leading-relaxed">
                Optimize training volume with Renaissance Periodization research guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.05] rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your training?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of lifters using science-based training
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 shadow-xl shadow-primary-600/20 hover:shadow-2xl hover:shadow-primary-600/30"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
