import { Link, Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="flex flex-row content-around no-wrap gap-10">
      <div className="bg-gray-100 p-4 gap-4 flex flex-col">
        <h1 className="text-2xl font-bold">Customer Support Portal</h1>
        <Link to="/">Dashboard</Link>
        <Link to="/tickets/list">Tickets</Link>
        <Link to="/tickets/new">New Ticket</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}