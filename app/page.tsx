import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Intelligent Logger
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Smart workout tracking with evidence-based progression
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link
            href="/login"
            className="block bg-blue-500 text-white text-center py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="block bg-white border-2 border-blue-500 text-blue-500 text-center py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Track Every Set</h3>
            <p className="text-gray-600">
              Log weight, reps, and RIR (Reps in Reserve) for optimal progression
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-lg mb-2">Smart Suggestions</h3>
            <p className="text-gray-600">
              Get automatic progression recommendations based on your performance
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Volume Optimization</h3>
            <p className="text-gray-600">
              Stay in the optimal volume range based on research-backed guidelines
            </p>
          </div>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-bold text-lg mb-2">Mobile-First Design</h3>
          <p className="text-gray-700">
            Designed for the gym floor. Large touch targets, quick logging, and instant feedback.
          </p>
        </div>
      </div>
    </div>
  );
}
