// データの永続化を管理するユーティリティ関数

import { ProductionData } from '../types';

const STORAGE_KEY = 'productionData';

export const getProductionData = (): ProductionData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProductionData = (data: ProductionData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addProductionData = (data: ProductionData) => {
  const currentData = getProductionData();
  currentData.push(data);
  saveProductionData(currentData);
};

export const updateProductionData = (updatedData: ProductionData) => {
  const currentData = getProductionData();
  const index = currentData.findIndex(item => item.id === updatedData.id);
  if (index !== -1) {
    currentData[index] = updatedData;
    saveProductionData(currentData);
  }
};

export const deleteProductionData = (id: string) => {
  const currentData = getProductionData();
  const filteredData = currentData.filter(item => item.id !== id);
  saveProductionData(filteredData);
};

export const filterByDateRange = (startDate: string, endDate: string): ProductionData[] => {
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
};

export const filterByProductName = (term: string): ProductionData[] => {
  const data = getProductionData();
  const searchTerm = term.toLowerCase();
  return data.filter(item => 
    item.productId.toLowerCase().includes(searchTerm)
  );
};