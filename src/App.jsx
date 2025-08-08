import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import HomePage from "@/components/pages/HomePage";
import PropertyDetailPage from "@/components/pages/PropertyDetailPage";
import SavedPropertiesPage from "@/components/pages/SavedPropertiesPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    propertyTypes: [],
    bedroomsMin: "",
    bathroomsMin: "",
    squareFeetMin: "",
    keywords: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedCount, setSavedCount] = useState(2); // Mock count for header

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header
          onSearch={handleSearch}
          onToggleFilters={handleToggleFilters}
          savedCount={savedCount}
        />
        
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  searchTerm={searchTerm}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  showFilters={showFilters}
                  onToggleFilters={handleToggleFilters}
                />
              }
            />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/saved" element={<SavedPropertiesPage />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;