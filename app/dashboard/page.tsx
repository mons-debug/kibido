import StatCard from "./components/StatCard";
import RecentOrdersTable from "./components/RecentOrdersTable";
import RevenueChart from "./components/RevenueChart";
import TopProducts from "./components/TopProducts";
import { 
  ShoppingBag, 
  PackageCheck, 
  Users, 
  CreditCard 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Orders" 
          value="156" 
          change="+12%" 
          trend="up"
          icon={<ShoppingBag className="h-8 w-8 text-blue-600" />} 
        />
        <StatCard 
          title="Products in Stock" 
          value="432" 
          change="+8%" 
          trend="up"
          icon={<PackageCheck className="h-8 w-8 text-green-600" />} 
        />
        <StatCard 
          title="New Customers" 
          value="78" 
          change="+24%" 
          trend="up"
          icon={<Users className="h-8 w-8 text-purple-600" />}
        />
        <StatCard 
          title="Total Revenue" 
          value="$12,456" 
          change="+18%" 
          trend="up"
          icon={<CreditCard className="h-8 w-8 text-orange-600" />} 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <RevenueChart />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
            <TopProducts />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
} 