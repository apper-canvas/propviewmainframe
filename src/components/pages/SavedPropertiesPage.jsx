import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { propertyService } from "@/services/api/propertyService";
import { toast } from "react-toastify";

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const [savedData, propertiesData] = await Promise.all([
        savedPropertyService.getAll(),
        propertyService.getAll()
      ]);
      
      setSavedProperties(savedData);
      setProperties(propertiesData);
    } catch (err) {
      setError("Failed to load saved properties. Please try again.");
      console.error("Error loading saved properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveFromSaved = async (propertyId) => {
    try {
      const savedProperty = savedProperties.find(saved => saved.propertyId === propertyId);
      if (savedProperty) {
        await savedPropertyService.delete(savedProperty.Id);
        setSavedProperties(prev => prev.filter(saved => saved.propertyId !== propertyId));
        toast.success("Property removed from saved");
      }
    } catch (err) {
      toast.error("Failed to remove property");
      console.error("Error removing property:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">Properties you've saved for later viewing</p>
        </div>
        <Loading type="grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">Properties you've saved for later viewing</p>
        </div>
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  // Get property details for saved properties
  const savedPropertyDetails = savedProperties
    .map(saved => {
      const property = properties.find(p => p.Id === saved.propertyId);
      return property ? { ...property, savedDate: saved.savedDate } : null;
    })
    .filter(Boolean);

  if (savedPropertyDetails.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">Properties you've saved for later viewing</p>
        </div>
        <Empty
          title="No saved properties yet"
          message="Start browsing properties and save your favorites to see them here."
          action={() => window.location.href = "/"}
          actionLabel="Browse Properties"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Saved Properties
        </h1>
        <p className="text-gray-600">
          {savedPropertyDetails.length} {savedPropertyDetails.length === 1 ? "property" : "properties"} saved
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedPropertyDetails.map((property) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PropertyCard
              property={property}
              onToggleFavorite={handleRemoveFromSaved}
              isFavorited={true}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SavedPropertiesPage;