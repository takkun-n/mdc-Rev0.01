import React, { useState, useEffect } from 'react';
import { ProductionData, Product, Process, Worker } from '../types';
import { 
  getProductionData, 
  addProductionData, 
  updateProductionData, 
  deleteProductionData, 
  filterByDateRange,
  filterByProductName
} from '../utils/localStorageManager';
import Navbar from '../components/Navbar';
import DataEntryForm from '../components/DataEntryForm';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import DetailModal from '../components/DetailModal';
import { exportToCSV, exportToPDF } from '../utils/exportHelpers';

const DataEntry: React.FC = () => {
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductionData[]>([]);
  const [editingData, setEditingData] = useState<ProductionData | undefined>(undefined);
  const [viewingData, setViewingData] = useState<ProductionData | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    loadData();
    loadMasterData();
  }, []);

  const loadData = () => {
    const data = getProductionData();
    setProductionData(data);
    setFilteredData(data);
  };

  const loadMasterData = () => {
    const savedProducts = localStorage.getItem('products');
    const savedProcesses = localStorage.getItem('processes');
    const savedWorkers = localStorage.getItem('workers');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedProcesses) {
      setProcesses(JSON.parse(savedProcesses));
    }
    
    if (savedWorkers) {
      setWorkers(JSON.parse(savedWorkers));
    }
  };

  const handleDataSubmit = (data: ProductionData) => {
    if (editingData) {
      updateProductionData(data);
      setEditingData(undefined);
    } else {
      addProductionData(data);
    }
    loadData();
  };

  const handleEdit = (data: ProductionData) => {
    setEditingData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('このデータを削除してもよろしいですか？')) {
      deleteProductionData(id);
      loadData();
    }
  };

  const handleViewDetails = (data: ProductionData) => {
    setViewingData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewingData(undefined);
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredData(productionData);
      return;
    }
    
    const filtered = filterByProductName(term);
    setFilteredData(filtered);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    if (!startDate && !endDate) {
      setFilteredData(productionData);
      return;
    }
    
    const filtered = filterByDateRange(startDate, endDate);
    setFilteredData(filtered);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredData);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">生産データ管理</h1>
          <p className="text-gray-600">新規データの入力と既存データの閲覧・編集</p>
        </div>
        
        <div className="mb-6">
          <DataEntryForm 
            onSubmit={handleDataSubmit} 
            initialData={editingData}
            isEditing={!!editingData}
            products={products}
            processes={processes}
            workers={workers}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">登録済みデータ一覧</h2>
          
          <FilterBar 
            onSearch={handleSearch}
            onDateRangeChange={handleDateRangeChange}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
          
          <DataTable 
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        </div>
        
        {isModalOpen && viewingData && (
          <DetailModal data={viewingData} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default DataEntry;