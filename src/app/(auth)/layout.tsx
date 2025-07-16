export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}