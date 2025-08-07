export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
