import mockProperties from "@/services/mockData/properties.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.properties = [...mockProperties];
  }

  async getAll() {
    await delay(300);
    return [...this.properties];
  }

  async getById(id) {
    await delay(200);
    const property = this.properties.find(p => p.Id === id);
    return property ? { ...property } : null;
  }

  async create(propertyData) {
    await delay(300);
    const newProperty = {
      ...propertyData,
      Id: Math.max(...this.properties.map(p => p.Id), 0) + 1,
      listingDate: new Date().toISOString()
    };
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, propertyData) {
    await delay(300);
    const index = this.properties.findIndex(p => p.Id === id);
    if (index !== -1) {
      this.properties[index] = { ...this.properties[index], ...propertyData };
      return { ...this.properties[index] };
    }
    return null;
  }

  async delete(id) {
    await delay(300);
    const index = this.properties.findIndex(p => p.Id === id);
    if (index !== -1) {
      this.properties.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const propertyService = new PropertyService();