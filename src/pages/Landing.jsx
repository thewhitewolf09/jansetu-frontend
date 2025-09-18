// src/pages/Landing.jsx
import PublicAnalytics from "../components/PublicAnalytics";
import heroImage from "../assets/hero.png";

function Landing() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="w-full mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 py-8 gap-8">
          {/* Left: Text */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              JanSetu
              <span className="block text-blue-600">
                Bridging Citizens and Government
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-xl">
              A simple way for citizens to raise issues, and powerful tools for
              authorities to resolve them — building trust through transparency.
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="flex-1 flex justify-center relative">
            <img
              src={heroImage}
              alt="JanSetu digital bridge illustration"
              className="border border-gray-300 rounded-2xl shadow-lg w-full max-w-md md:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
            👩‍👩‍👧
          </div>
          <h3 className="text-xl font-semibold">Citizen Simplicity</h3>
          <p className="text-sm text-gray-600">
            Report in just two taps: Photo, Voice, or Text. Track status with a
            clear progress bar.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl">
            ⚡
          </div>
          <h3 className="text-xl font-semibold">Authority Efficiency</h3>
          <p className="text-sm text-gray-600">
            AI-driven prioritization, live complaint heatmaps, and escalation
            alerts for quick action.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 text-3xl">
            📊
          </div>
          <h3 className="text-xl font-semibold">Public Transparency</h3>
          <p className="text-sm text-gray-600">
            Live stats, complaint density maps, and department rankings for
            accountability.
          </p>
        </div>
      </section>

      {/* Public Analytics Panel */}
      <PublicAnalytics />
    </div>
  );
}

export default Landing;
