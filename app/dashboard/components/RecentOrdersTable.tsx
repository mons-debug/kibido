"use client";

// Placeholder data
const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    date: "2023-11-15",
    status: "DELIVERED",
    total: "$156.00"
  },
  {
    id: "ORD002",
    customer: "Sarah Smith",
    date: "2023-11-14",
    status: "PROCESSING",
    total: "$243.50"
  },
  {
    id: "ORD003",
    customer: "Michael Johnson",
    date: "2023-11-14",
    status: "SHIPPED",
    total: "$89.99"
  },
  {
    id: "ORD004",
    customer: "Emily Brown",
    date: "2023-11-13",
    status: "PENDING",
    total: "$125.25"
  },
  {
    id: "ORD005",
    customer: "Robert Wilson",
    date: "2023-11-12",
    status: "DELIVERED",
    total: "$310.75"
  }
];

export default function RecentOrdersTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Total</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {order.id}
              </td>
              <td className="px-6 py-4">{order.customer}</td>
              <td className="px-6 py-4">{order.date}</td>
              <td className="px-6 py-4">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "PROCESSING"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "SHIPPED"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">{order.total}</td>
              <td className="px-6 py-4">
                <a href="#" className="text-blue-600 hover:underline mr-4">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 