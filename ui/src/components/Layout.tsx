import { NavLink, Outlet } from 'react-router'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-gray-200 bg-white">
        <div className="p-4">
          <h1 className="text-lg font-bold text-indigo-600">Order Transformer</h1>
        </div>
        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}
