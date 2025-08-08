import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import FilterPanel from "@/components/organisms/FilterPanel";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { toast } from "react-toastify";

const HomePage = ({ 
  searchTerm, 
  filters, 
  onFiltersChange, 
  showFilters, 
  onToggleFilters 
}) => {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = async () => {
    try {
      const saved = await savedPropertyService.getAll();
      setSavedProperties(saved);
    } catch (err) {
      console.error("Error loading saved properties:", err);
    }
  };

  useEffect(() => {
    loadProperties();
    loadSavedProperties();
  }, []);

  const handleToggleFavorite = async (propertyId) => {
    try {
      const isCurrentlySaved = savedProperties.some(saved => saved.propertyId === propertyId);
      
      if (isCurrentlySaved) {
        const savedProperty = savedProperties.find(saved => saved.propertyId === propertyId);
        await savedPropertyService.delete(savedProperty.Id);
        setSavedProperties(prev => prev.filter(saved => saved.propertyId !== propertyId));
        toast.success("Property removed from saved");
      } else {
        const newSavedProperty = {
          propertyId: propertyId,
          savedDate: new Date().toISOString(),
          notes: ""
        };
        const created = await savedPropertyService.create(newSavedProperty);
        setSavedProperties(prev => [...prev, created]);
        toast.success("Property saved successfully");
      }
    } catch (err) {
      toast.error("Failed to update saved properties");
      console.error("Error toggling favorite:", err);
    }
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
    onFiltersChange(clearedFilters);
  };

  // Filter properties based on current filters and search term
const filteredProperties = properties.filter(property => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (property.address || '').toLowerCase().includes(searchLower) ||
        (property.city || '').toLowerCase().includes(searchLower) ||
        (property.state || '').toLowerCase().includes(searchLower) ||
        (property.zipCode || '').includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Price filters
    if (filters.priceMin && property.price < parseInt(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && property.price > parseInt(filters.priceMax)) {
      return false;
    }

    // Property type filter
    if (filters.propertyTypes?.length > 0) {
      if (!filters.propertyTypes.includes(property.propertyType)) {
        return false;
      }
    }

    // Bedrooms filter
    if (filters.bedroomsMin && property.bedrooms < parseInt(filters.bedroomsMin)) {
      return false;
    }

    // Bathrooms filter
    if (filters.bathroomsMin && property.bathrooms < parseFloat(filters.bathroomsMin)) {
      return false;
    }

    // Square feet filter
    if (filters.squareFeetMin && property.squareFeet < parseInt(filters.squareFeetMin)) {
      return false;
    }

    // Keywords filter
    if (filters.keywords) {
      const keywordsLower = filters.keywords.toLowerCase();
      const matchesKeywords = 
        (property.description || '').toLowerCase().includes(keywordsLower) ||
        (property.features || []).some(feature => (feature || '').toLowerCase().includes(keywordsLower));
      
      if (!matchesKeywords) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PropertyGrid
          properties={filteredProperties}
          loading={loading}
          error={error}
          onRetry={loadProperties}
          onToggleFavorite={handleToggleFavorite}
          savedProperties={savedProperties}
          onClearFilters={handleClearFilters}
        />
      </motion.div>

      <FilterPanel
        isOpen={showFilters}
        onClose={onToggleFilters}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default HomePage;