import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry,
  onToggleFavorite,
  savedProperties = [],
  onClearFilters
}) => {
  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!properties || properties.length === 0) {
    return (
      <Empty
        title="No properties found"
        message="Try adjusting your search filters or browse all available properties."
        action={onClearFilters}
        actionLabel="Clear Filters"
      />
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      {properties.map((property) => (
        <motion.div key={property.Id} variants={item}>
          <PropertyCard
            property={property}
            onToggleFavorite={onToggleFavorite}
            isFavorited={savedProperties.some(saved => saved.propertyId === property.Id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;