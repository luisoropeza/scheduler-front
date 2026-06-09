import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "../components/layout/Sidebar";

const RootLayout = () => (
  <div className="flex h-screen bg-gray-50 text-gray-900">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
