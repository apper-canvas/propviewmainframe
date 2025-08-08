import mockSavedProperties from "@/services/mockData/savedProperties.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SavedPropertyService {
  constructor() {
    this.savedProperties = [...mockSavedProperties];
  }

  async getAll() {
    await delay(200);
    return [...this.savedProperties];
  }

  async getById(id) {
    await delay(200);
    const savedProperty = this.savedProperties.find(p => p.Id === id);
    return savedProperty ? { ...savedProperty } : null;
  }

  async create(savedPropertyData) {
    await delay(250);
    const newSavedProperty = {
      ...savedPropertyData,
      Id: Math.max(...this.savedProperties.map(p => p.Id), 0) + 1
    };
    this.savedProperties.push(newSavedProperty);
    return { ...newSavedProperty };
  }

  async update(id, savedPropertyData) {
    await delay(250);
    const index = this.savedProperties.findIndex(p => p.Id === id);
    if (index !== -1) {
      this.savedProperties[index] = { ...this.savedProperties[index], ...savedPropertyData };
      return { ...this.savedProperties[index] };
    }
    return null;
  }

  async delete(id) {
    await delay(250);
    const index = this.savedProperties.findIndex(p => p.Id === id);
    if (index !== -1) {
      this.savedProperties.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const savedPropertyService = new SavedPropertyService();