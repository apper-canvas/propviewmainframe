class PropertyService {
  constructor() {
    // Initialize ApperClient for property_c table
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'property_c';
  }

  async getAll() {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "address_c" } },
          { "field": { "Name": "city_c" } },
          { "field": { "Name": "state_c" } },
          { "field": { "Name": "zip_code_c" } },
          { "field": { "Name": "price_c" } },
          { "field": { "Name": "property_type_c" } },
          { "field": { "Name": "bedrooms_c" } },
          { "field": { "Name": "bathrooms_c" } },
          { "field": { "Name": "square_feet_c" } },
          { "field": { "Name": "year_built_c" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "images_c" } },
          { "field": { "Name": "features_c" } },
          { "field": { "Name": "listing_date_c" } },
          { "field": { "Name": "status_c" } }
        ],
        "orderBy": [
          {
            "fieldName": "listing_date_c",
            "sorttype": "DESC"
          }
        ],
        "pagingInfo": {
          "limit": 50,
          "offset": 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching properties:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const properties = (response.data || []).map(property => ({
        Id: property.Id,
        name: property.Name,
        tags: property.Tags,
        address: property.address_c || '',
        city: property.city_c || '',
        state: property.state_c || '',
        zipCode: property.zip_code_c || '',
        price: property.price_c || 0,
        propertyType: property.property_type_c || '',
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        squareFeet: property.square_feet_c || 0,
        yearBuilt: property.year_built_c || 0,
        description: property.description_c || '',
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        features: property.features_c ? property.features_c.split('\n').filter(feat => feat.trim()) : [],
        listingDate: property.listing_date_c || new Date().toISOString(),
        status: property.status_c || 'For Sale'
      }));

      return properties;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error("Error fetching properties:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "address_c" } },
          { "field": { "Name": "city_c" } },
          { "field": { "Name": "state_c" } },
          { "field": { "Name": "zip_code_c" } },
          { "field": { "Name": "price_c" } },
          { "field": { "Name": "property_type_c" } },
          { "field": { "Name": "bedrooms_c" } },
          { "field": { "Name": "bathrooms_c" } },
          { "field": { "Name": "square_feet_c" } },
          { "field": { "Name": "year_built_c" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "images_c" } },
          { "field": { "Name": "features_c" } },
          { "field": { "Name": "listing_date_c" } },
          { "field": { "Name": "status_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching property with ID ${id}:`, response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const property = response.data;
      return {
        Id: property.Id,
        name: property.Name,
        tags: property.Tags,
        address: property.address_c || '',
        city: property.city_c || '',
        state: property.state_c || '',
        zipCode: property.zip_code_c || '',
        price: property.price_c || 0,
        propertyType: property.property_type_c || '',
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        squareFeet: property.square_feet_c || 0,
        yearBuilt: property.year_built_c || 0,
        description: property.description_c || '',
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        features: property.features_c ? property.features_c.split('\n').filter(feat => feat.trim()) : [],
        listingDate: property.listing_date_c || new Date().toISOString(),
        status: property.status_c || 'For Sale'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching property with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(propertyData) {
    try {
      const params = {
        records: [
          {
            Name: propertyData.name || propertyData.address || '',
            Tags: propertyData.tags || '',
            address_c: propertyData.address || '',
            city_c: propertyData.city || '',
            state_c: propertyData.state || '',
            zip_code_c: propertyData.zipCode || '',
            price_c: parseFloat(propertyData.price) || 0,
            property_type_c: propertyData.propertyType || '',
            bedrooms_c: parseInt(propertyData.bedrooms) || 0,
            bathrooms_c: parseFloat(propertyData.bathrooms) || 0,
            square_feet_c: parseInt(propertyData.squareFeet) || 0,
            year_built_c: parseInt(propertyData.yearBuilt) || 0,
            description_c: propertyData.description || '',
            images_c: Array.isArray(propertyData.images) ? propertyData.images.join('\n') : propertyData.images || '',
            features_c: Array.isArray(propertyData.features) ? propertyData.features.join('\n') : propertyData.features || '',
            listing_date_c: propertyData.listingDate || new Date().toISOString(),
            status_c: propertyData.status || 'For Sale'
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating property:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create properties ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating property:", error?.response?.data?.message);
      } else {
        console.error("Error creating property:", error.message);
      }
      throw error;
    }
  }

  async update(id, propertyData) {
    try {
      const updateData = {
        Id: id
      };

      // Only include updateable fields
      if (propertyData.name !== undefined) updateData.Name = propertyData.name;
      if (propertyData.tags !== undefined) updateData.Tags = propertyData.tags;
      if (propertyData.address !== undefined) updateData.address_c = propertyData.address;
      if (propertyData.city !== undefined) updateData.city_c = propertyData.city;
      if (propertyData.state !== undefined) updateData.state_c = propertyData.state;
      if (propertyData.zipCode !== undefined) updateData.zip_code_c = propertyData.zipCode;
      if (propertyData.price !== undefined) updateData.price_c = parseFloat(propertyData.price);
      if (propertyData.propertyType !== undefined) updateData.property_type_c = propertyData.propertyType;
      if (propertyData.bedrooms !== undefined) updateData.bedrooms_c = parseInt(propertyData.bedrooms);
      if (propertyData.bathrooms !== undefined) updateData.bathrooms_c = parseFloat(propertyData.bathrooms);
      if (propertyData.squareFeet !== undefined) updateData.square_feet_c = parseInt(propertyData.squareFeet);
      if (propertyData.yearBuilt !== undefined) updateData.year_built_c = parseInt(propertyData.yearBuilt);
      if (propertyData.description !== undefined) updateData.description_c = propertyData.description;
      if (propertyData.images !== undefined) {
        updateData.images_c = Array.isArray(propertyData.images) ? propertyData.images.join('\n') : propertyData.images;
      }
      if (propertyData.features !== undefined) {
        updateData.features_c = Array.isArray(propertyData.features) ? propertyData.features.join('\n') : propertyData.features;
      }
      if (propertyData.listingDate !== undefined) updateData.listing_date_c = propertyData.listingDate;
      if (propertyData.status !== undefined) updateData.status_c = propertyData.status;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating property:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update properties ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating property:", error?.response?.data?.message);
      } else {
        console.error("Error updating property:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting property:", response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete properties ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return false;
        }
        
        return true;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting property:", error?.response?.data?.message);
      } else {
        console.error("Error deleting property:", error.message);
      }
      return false;
    }
  }
}

export const propertyService = new PropertyService();