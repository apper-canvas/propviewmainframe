class SavedPropertyService {
  constructor() {
    // Initialize ApperClient for saved_property_c table
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'saved_property_c';
  }

  async getAll() {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { 
            "field": { "name": "property_id_c" },
            "referenceField": { "field": { "Name": "Name" } }
          },
          { "field": { "Name": "saved_date_c" } },
          { "field": { "Name": "notes_c" } }
        ],
        "orderBy": [
          {
            "fieldName": "saved_date_c",
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
        console.error("Error fetching saved properties:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const savedProperties = (response.data || []).map(saved => ({
        Id: saved.Id,
        name: saved.Name,
        tags: saved.Tags,
        propertyId: saved.property_id_c?.Id || saved.property_id_c,
        savedDate: saved.saved_date_c || new Date().toISOString(),
        notes: saved.notes_c || ''
      }));

      return savedProperties;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching saved properties:", error?.response?.data?.message);
      } else {
        console.error("Error fetching saved properties:", error.message);
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
          { 
            "field": { "name": "property_id_c" },
            "referenceField": { "field": { "Name": "Name" } }
          },
          { "field": { "Name": "saved_date_c" } },
          { "field": { "Name": "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching saved property with ID ${id}:`, response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const saved = response.data;
      return {
        Id: saved.Id,
        name: saved.Name,
        tags: saved.Tags,
        propertyId: saved.property_id_c?.Id || saved.property_id_c,
        savedDate: saved.saved_date_c || new Date().toISOString(),
        notes: saved.notes_c || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching saved property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching saved property with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(savedPropertyData) {
    try {
      const params = {
        records: [
          {
            Name: savedPropertyData.name || `Saved Property ${Date.now()}`,
            Tags: savedPropertyData.tags || '',
            property_id_c: parseInt(savedPropertyData.propertyId),
            saved_date_c: savedPropertyData.savedDate || new Date().toISOString(),
            notes_c: savedPropertyData.notes || ''
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating saved property:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create saved properties ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            Id: created.Id,
            name: created.Name,
            tags: created.Tags,
            propertyId: created.property_id_c?.Id || created.property_id_c,
            savedDate: created.saved_date_c || new Date().toISOString(),
            notes: created.notes_c || ''
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating saved property:", error?.response?.data?.message);
      } else {
        console.error("Error creating saved property:", error.message);
      }
      throw error;
    }
  }

  async update(id, savedPropertyData) {
    try {
      const updateData = {
        Id: id
      };

      // Only include updateable fields
      if (savedPropertyData.name !== undefined) updateData.Name = savedPropertyData.name;
      if (savedPropertyData.tags !== undefined) updateData.Tags = savedPropertyData.tags;
      if (savedPropertyData.propertyId !== undefined) updateData.property_id_c = parseInt(savedPropertyData.propertyId);
      if (savedPropertyData.savedDate !== undefined) updateData.saved_date_c = savedPropertyData.savedDate;
      if (savedPropertyData.notes !== undefined) updateData.notes_c = savedPropertyData.notes;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating saved property:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update saved properties ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data;
          return {
            Id: updated.Id,
            name: updated.Name,
            tags: updated.Tags,
            propertyId: updated.property_id_c?.Id || updated.property_id_c,
            savedDate: updated.saved_date_c || new Date().toISOString(),
            notes: updated.notes_c || ''
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating saved property:", error?.response?.data?.message);
      } else {
        console.error("Error updating saved property:", error.message);
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
        console.error("Error deleting saved property:", response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete saved properties ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return false;
        }
        
        return true;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting saved property:", error?.response?.data?.message);
      } else {
        console.error("Error deleting saved property:", error.message);
      }
      return false;
    }
  }
}

export const savedPropertyService = new SavedPropertyService();