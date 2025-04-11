"use client";

// Placeholder data
const products = [
  {
    id: 1,
    name: "Luxury Headphones",
    sales: 148,
    revenue: "$14,800",
    image: "/headphones.jpg", // These are placeholder images
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    sales: 124,
    revenue: "$6,200",
    image: "/earbuds.jpg",
  },
  {
    id: 3,
    name: "Smart Watch",
    sales: 96,
    revenue: "$12,480",
    image: "/smartwatch.jpg",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    sales: 82,
    revenue: "$8,200",
    image: "/speaker.jpg",
  },
  {
    id: 5,
    name: "Phone Case",
    sales: 75,
    revenue: "$1,875",
    image: "/phonecase.jpg",
  }
];

export default function TopProducts() {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            {/* Placeholder for image */}
            <span className="text-xs">Image</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </p>
            <p className="text-xs text-gray-500">
              {product.sales} sales
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {product.revenue}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, (product.sales / 150) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 