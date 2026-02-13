export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            ERLV Inc
          </h1>

          <p className="text-xl md:text-2xl text-gray-600">
            Innovation & Technology Solutions
          </p>

          <div className="pt-8 space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-2">AI Solutions</h3>
                <p className="text-gray-700">Cutting-edge artificial intelligence and machine learning</p>
              </div>

              <div className="p-6 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-lg text-indigo-900 mb-2">Cloud Services</h3>
                <p className="text-gray-700">Scalable infrastructure and deployment solutions</p>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-lg text-purple-900 mb-2">Development</h3>
                <p className="text-gray-700">Custom software and application development</p>
              </div>
            </div>
          </div>

          <div className="pt-6 text-gray-500 text-sm">
            © 2026 ERLV Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
