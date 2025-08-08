import React from "react";

const Loading = ({ type = "grid" }) => {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl shadow-card overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "details") {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-6 w-1/2"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loading;