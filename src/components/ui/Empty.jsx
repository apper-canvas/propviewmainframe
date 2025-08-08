import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found", 
  message = "Try adjusting your search filters or browse all available properties.",
  action,
  actionLabel = "Clear Filters"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-primary/10 rounded-full p-6 mb-6">
        <ApperIcon name="Home" className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;