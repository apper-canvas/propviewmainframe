import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search by location, address, or zip code..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
      </div>
      <Button type="submit" className="ml-3">
        <ApperIcon name="Search" className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;