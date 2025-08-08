import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterTag from "@/components/molecules/FilterTag";

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key, value, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...(prev[key] || []), value]
        : (prev[key] || []).filter(item => item !== value)
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceMin: "",
      priceMax: "",
      propertyTypes: [],
      bedroomsMin: "",
      bathroomsMin: "",
      squareFeetMin: "",
      keywords: ""
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  const getActiveFilterTags = () => {
    const tags = [];
    
    if (localFilters.priceMin || localFilters.priceMax) {
      const min = localFilters.priceMin ? `$${parseInt(localFilters.priceMin).toLocaleString()}` : "0";
      const max = localFilters.priceMax ? `$${parseInt(localFilters.priceMax).toLocaleString()}` : "∞";
      tags.push({ key: "price", label: `${min} - ${max}` });
    }
    
    if (localFilters.propertyTypes?.length > 0) {
      localFilters.propertyTypes.forEach(type => {
        tags.push({ key: `type_${type}`, label: type });
      });
    }
    
    if (localFilters.bedroomsMin) {
      tags.push({ key: "bedrooms", label: `${localFilters.bedroomsMin}+ bedrooms` });
    }
    
    if (localFilters.bathroomsMin) {
      tags.push({ key: "bathrooms", label: `${localFilters.bathroomsMin}+ bathrooms` });
    }
    
    if (localFilters.squareFeetMin) {
      tags.push({ key: "sqft", label: `${parseInt(localFilters.squareFeetMin).toLocaleString()}+ sq ft` });
    }
    
    if (localFilters.keywords) {
      tags.push({ key: "keywords", label: `"${localFilters.keywords}"` });
    }
    
    return tags;
  };

  const removeFilterTag = (key) => {
    if (key === "price") {
      setLocalFilters(prev => ({ ...prev, priceMin: "", priceMax: "" }));
    } else if (key.startsWith("type_")) {
      const type = key.replace("type_", "");
      handleArrayFilterChange("propertyTypes", type, false);
    } else if (key === "bedrooms") {
      setLocalFilters(prev => ({ ...prev, bedroomsMin: "" }));
    } else if (key === "bathrooms") {
      setLocalFilters(prev => ({ ...prev, bathroomsMin: "" }));
    } else if (key === "sqft") {
      setLocalFilters(prev => ({ ...prev, squareFeetMin: "" }));
    } else if (key === "keywords") {
      setLocalFilters(prev => ({ ...prev, keywords: "" }));
    }
  };

  const propertyTypes = ["House", "Condo", "Townhouse", "Apartment", "Land"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              {/* Active Filters */}
              {getActiveFilterTags().length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {getActiveFilterTags().map((tag) => (
                      <FilterTag
                        key={tag.key}
                        label={tag.label}
                        onRemove={() => removeFilterTag(tag.key)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={localFilters.priceMin}
                        onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                      <Input
                        type="number"
                        placeholder="No max"
                        value={localFilters.priceMax}
                        onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                          checked={localFilters.propertyTypes?.includes(type) || false}
                          onChange={(e) => handleArrayFilterChange("propertyTypes", type, e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Bedrooms
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={localFilters.bedroomsMin}
                    onChange={(e) => handleFilterChange("bedroomsMin", e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Bathrooms
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={localFilters.bathroomsMin}
                    onChange={(e) => handleFilterChange("bathroomsMin", e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="1.5">1.5+</option>
                    <option value="2">2+</option>
                    <option value="2.5">2.5+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Square Feet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Square Feet
                  </label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={localFilters.squareFeetMin}
                    onChange={(e) => handleFilterChange("squareFeetMin", e.target.value)}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Keywords
                  </label>
                  <Input
                    placeholder="e.g., pool, garage, fireplace..."
                    value={localFilters.keywords}
                    onChange={(e) => handleFilterChange("keywords", e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;