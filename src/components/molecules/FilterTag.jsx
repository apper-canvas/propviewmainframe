import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FilterTag = ({ label, onRemove, variant = "primary" }) => {
  return (
    <Badge variant={variant} className="pr-1 flex items-center gap-1">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <ApperIcon name="X" className="h-3 w-3" />
      </button>
    </Badge>
  );
};

export default FilterTag;