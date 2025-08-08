import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ onSearch, onToggleFilters, savedCount = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (searchTerm) => {
    if (onSearch) {
      onSearch(searchTerm);
    }
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-200 ${
        isScrolled ? "shadow-sm border-b border-gray-100" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <ApperIcon name="Home" className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-primary">
              PropView
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onToggleFilters}
              className="hidden md:flex"
            >
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <Link to="/saved">
              <Button variant="ghost" className="relative">
                <ApperIcon name="Heart" className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Saved</span>
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {savedCount > 99 ? "99+" : savedCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={onToggleFilters}
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;