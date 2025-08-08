import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const PropertyCard = ({ property, onToggleFavorite, isFavorited }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(property.Id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat("en-US").format(sqft);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-card hover:shadow-lift transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
          alt={property.address}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="accent" className="bg-accent text-white font-semibold">
            {formatPrice(property.price)}
          </Badge>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <ApperIcon
            name={isFavorited ? "Heart" : "Heart"}
            className={`h-5 w-5 ${
              isFavorited ? "text-error fill-current" : "text-gray-400"
            } transition-colors`}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 text-gray-800">
            {property.status}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {property.address}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {property.city}, {property.state} {property.zipCode}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ApperIcon name="Bed" className="h-4 w-4" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Bath" className="h-4 w-4" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span>{formatSquareFeet(property.squareFeet)} sq ft</span>
          </div>
          <div className="text-sm text-gray-500">
            {property.propertyType}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;