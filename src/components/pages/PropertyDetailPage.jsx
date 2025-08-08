import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertyGallery from "@/components/organisms/PropertyGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await propertyService.getById(parseInt(id));
      if (!data) {
        setError("Property not found");
        return;
      }
      setProperty(data);
    } catch (err) {
      setError("Failed to load property details. Please try again.");
      console.error("Error loading property:", err);
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
    loadProperty();
    loadSavedProperties();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!property) return;

    try {
      const isCurrentlySaved = savedProperties.some(saved => saved.propertyId === property.Id);
      
      if (isCurrentlySaved) {
        const savedProperty = savedProperties.find(saved => saved.propertyId === property.Id);
        await savedPropertyService.delete(savedProperty.Id);
        setSavedProperties(prev => prev.filter(saved => saved.propertyId !== property.Id));
        toast.success("Property removed from saved");
      } else {
        const newSavedProperty = {
          propertyId: property.Id,
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Loading type="details" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Error 
          message={error || "Property not found"} 
          onRetry={() => navigate("/")}
        />
      </div>
    );
  }

  const isFavorited = savedProperties.some(saved => saved.propertyId === property.Id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
        Back to Properties
      </button>

      {/* Property Gallery */}
      <PropertyGallery images={property.images} address={property.address} />

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                {property.address}
              </h1>
              <p className="text-lg text-gray-600">
                {property.city}, {property.state} {property.zipCode}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="accent" className="bg-accent text-white text-lg font-bold px-4 py-2">
                {formatPrice(property.price)}
              </Badge>
              <Button
                variant="ghost"
                onClick={handleToggleFavorite}
                className="p-3"
              >
                <ApperIcon
                  name="Heart"
                  className={`h-6 w-6 ${
                    isFavorited ? "text-error fill-current" : "text-gray-400"
                  } transition-colors`}
                />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6 text-lg">
            <div className="flex items-center gap-2">
              <ApperIcon name="Bed" className="h-5 w-5 text-gray-500" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Bath" className="h-5 w-5 text-gray-500" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Square" className="h-5 w-5 text-gray-500" />
              <span>{formatSquareFeet(property.squareFeet)} sq ft</span>
            </div>
          </div>

          {/* Status and Type */}
          <div className="flex items-center gap-3 mb-6">
            <Badge className={`${
              property.status === "For Sale" ? "bg-success/10 text-success" :
              property.status === "Sold" ? "bg-error/10 text-error" :
              "bg-warning/10 text-warning"
            }`}>
              {property.status}
            </Badge>
            <Badge variant="primary">
              {property.propertyType}
            </Badge>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ApperIcon name="Check" className="h-4 w-4 text-success" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Specs */}
        <div className="bg-surface rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Price</span>
              <span className="font-semibold text-gray-900">{formatPrice(property.price)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Property Type</span>
              <span className="font-semibold text-gray-900">{property.propertyType}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Bedrooms</span>
              <span className="font-semibold text-gray-900">{property.bedrooms}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Bathrooms</span>
              <span className="font-semibold text-gray-900">{property.bathrooms}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Square Feet</span>
              <span className="font-semibold text-gray-900">{formatSquareFeet(property.squareFeet)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Year Built</span>
              <span className="font-semibold text-gray-900">{property.yearBuilt}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold text-gray-900">{property.status}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Listed Date</span>
              <span className="font-semibold text-gray-900">
                {format(new Date(property.listingDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          {/* Contact Button */}
          <div className="mt-8">
            <Button className="w-full" size="lg">
              <ApperIcon name="Phone" className="h-5 w-5 mr-2" />
              Contact Agent
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetailPage;