import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-error/10 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;