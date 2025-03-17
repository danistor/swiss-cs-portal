import { Link, Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full relative">
      {/* Hidden checkbox for CSS-only toggle */}
      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />

      {/* Mobile menu toggle button - only visible on small screens */}
      <label
        htmlFor="mobile-menu-toggle"
        className="md:hidden bg-gray-200 p-2 m-2 rounded-md cursor-pointer z-10 flex items-center justify-center"
      >
        <span className="peer-checked:hidden">Open Menu</span>
        <span className="hidden peer-checked:block">Close Menu</span>
      </label>

      {/* Sidebar - responsive with CSS-only toggle */}
      <div className="
        bg-gray-100 p-4 gap-4 flex flex-col
        fixed md:static top-0 left-0 h-screen w-64
        -translate-x-full peer-checked:translate-x-0 md:translate-x-0
        transition-transform duration-300 ease-in-out
        z-20 md:z-auto
      ">
        <h1 className="text-2xl font-bold mt-12 md:mt-0">Customer Support Portal</h1>
        <Link to="/" className="p-2 hover:bg-gray-200 rounded">Dashboard</Link>
        <Link to="/tickets/list" className="p-2 hover:bg-gray-200 rounded">Tickets</Link>
        <Link to="/tickets/new" className="p-2 hover:bg-gray-200 rounded">New Ticket</Link>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}