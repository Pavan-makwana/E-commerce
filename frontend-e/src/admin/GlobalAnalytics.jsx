import { useState } from "react";


const GlobalAnalytics = () => {
  const [categoryData] = useState([
    { label: "Electronics", value: 150000, color: "bg-blue-500" },
    { label: "Fashion", value: 80000, color: "bg-pink-500" },
    { label: "Home", value: 45000, color: "bg-green-500" },
    { label: "Books", value: 20000, color: "bg-yellow-500" },
  ]);

  // Determine the max value to scale the bars correctly
  const maxVal = Math.max(...categoryData.map((d) => d.value));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800">Platform Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sales by Category Chart */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-gray-700">Revenue by Category</h3>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600 bg-gray-50">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          {/* CSS Bar Chart */}
          <div className="flex items-end justify-around h-64 border-b border-gray-200 pb-2 relative">
             {/* Y-Axis Guidelines */}
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-gray-900 w-full h-0"></div>
                <div className="border-t border-gray-900 w-full h-0"></div>
                <div className="border-t border-gray-900 w-full h-0"></div>
                <div className="border-t border-gray-900 w-full h-0"></div>
             </div>

            {categoryData.map((item) => (
              <div key={item.label} className="flex flex-col items-center group w-1/5 z-10">
                
                {/* Tooltip on Hover */}
                <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 absolute -mt-8">
                  ₹{item.value.toLocaleString()}
                </div>

                {/* The Bar */}
                <div
                  className={`w-full ${item.color} rounded-t-md transition-all duration-700 ease-out hover:opacity-80 shadow-sm`}
                  style={{ height: `${(item.value / maxVal) * 100}%`, minHeight: "10px" }}
                ></div>
                
                {/* Label */}
                <p className="mt-3 font-semibold text-gray-600 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 font-mono">₹{(item.value / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-700 mb-6">Performance Highlights</h3>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                    <div>
                        <p className="text-green-600 font-bold text-sm uppercase">Top Selling Category</p>
                        <p className="text-2xl font-extrabold text-gray-800">Electronics</p>
                    </div>
                    <span className="text-3xl">💻</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div>
                        <p className="text-orange-600 font-bold text-sm uppercase">Pending Returns</p>
                        <p className="text-2xl font-extrabold text-gray-800">12 Requests</p>
                    </div>
                    <button className="text-sm bg-white border border-orange-200 px-3 py-1 rounded text-orange-600 hover:bg-orange-100 transition">View</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                        <p className="text-blue-600 font-bold text-sm uppercase">New Users (This Week)</p>
                        <p className="text-2xl font-extrabold text-gray-800">+124</p>
                    </div>
                    <span className="text-green-500 font-bold text-sm">↑ 12%</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalAnalytics;