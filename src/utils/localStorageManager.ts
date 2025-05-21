import { ProductionData } from '../types';

const STORAGE_KEY = 'productionData';

export const getProductionData = (): ProductionData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading production data:', error);
    return [];
  }
};

export const saveProductionData = (data: ProductionData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving production data:', error);
  }
};

export const addProductionData = (data: ProductionData) => {
  try {
    const currentData = getProductionData();
    currentData.push(data);
    saveProductionData(currentData);
    return true;
  } catch (error) {
    console.error('Error adding production data:', error);
    return false;
  }
};

export const updateProductionData = (updatedData: ProductionData) => {
  try {
    const currentData = getProductionData();
    const index = currentData.findIndex(item => item.id === updatedData.id);
    if (index !== -1) {
      currentData[index] = updatedData;
      saveProductionData(currentData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating production data:', error);
    return false;
  }
};

export const deleteProductionData = (id: string) => {
  try {
    const currentData = getProductionData();
    const filteredData = currentData.filter(item => item.id !== id);
    saveProductionData(filteredData);
    return true;
  } catch (error) {
    console.error('Error deleting production data:', error);
    return false;
  }
};

export const filterByDateRange = (startDate: string, endDate: string): ProductionData[] => {
  try {
    const data = getProductionData();
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        end.setHours(23, 59, 59);
        return itemDate >= start && itemDate <= end;
      }
      if (start) return itemDate >= start;
      if (end) {
        end.setHours(23, 59, 59);
        return itemDate <= end;
      }
      return true;
    });
  } catch (error) {
    console.error('Error filtering by date range:', error);
    return [];
  }
};

export const filterByProductName = (term: string): ProductionData[] => {
  try {
    const data = getProductionData();
    const searchTerm = term.toLowerCase();
    return data.filter(item => 
      item.productId.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error filtering by product name:', error);
    return [];
  }
};