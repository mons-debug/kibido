"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Layers, 
  BarChart3, 
  LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ href, icon, label }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
        isActive 
          ? "bg-white text-blue-700 shadow-sm" 
          : "text-gray-600 hover:bg-white/50 hover:text-blue-700"
      }`}
    >
      <div className="text-lg">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-3">
        <h1 className="text-2xl font-bold text-blue-700">Kibido</h1>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem href="/dashboard" icon={<Home />} label="Overview" />
        <SidebarItem href="/dashboard/products" icon={<Package />} label="Products" />
        <SidebarItem href="/dashboard/orders" icon={<ShoppingBag />} label="Orders" />
        <SidebarItem href="/dashboard/customers" icon={<Users />} label="Customers" />
        <SidebarItem href="/dashboard/categories" icon={<Layers />} label="Categories" />
        <SidebarItem href="/dashboard/analytics" icon={<BarChart3 />} label="Analytics" />
        <SidebarItem href="/dashboard/settings" icon={<Settings />} label="Settings" />
      </nav>

      <div className="mt-auto pt-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-2 p-3 w-full rounded-lg transition-colors text-gray-600 hover:bg-white/50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 