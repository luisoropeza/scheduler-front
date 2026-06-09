import { Link } from "@tanstack/react-router";
import { CalendarDays, Users, CalendarCheck } from "lucide-react";

const navItems = [
  { to: "/providers", label: "Providers", icon: Users },
  { to: "/appointments", label: "Appointments", icon: CalendarCheck },
] as const;

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-200">
        <CalendarDays className="h-6 w-6 text-indigo-600" />
        <span className="text-base font-semibold text-gray-900">Scheduler</span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: false }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 [&.active]:bg-indigo-50 [&.active]:text-indigo-700 [&.active]:font-medium"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
