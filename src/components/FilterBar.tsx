import React, { useState } from 'react';
import { Search, Calendar, Download, Printer } from 'lucide-react';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onSearch, 
  onDateRangeChange, 
  onExportCSV,
  onExportPDF
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleDateFilterToggle = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleDateRangeApply = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
    setShowDateFilter(false);
  };

  const handleDateRangeReset = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange('', '');
    setShowDateFilter(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="製品名で検索..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleDateFilterToggle}
            className="ml-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center"
          >
            <Calendar size={18} className="mr-1" />
            <span className="hidden sm:inline">期間</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onExportCSV}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
            title="CSVエクスポート"
          >
            <Download size={18} className="mr-1" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          
          <button
            onClick={onExportPDF}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
            title="PDFエクスポート"
          >
            <Printer size={18} className="mr-1" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>
      
      {showDateFilter && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了日
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={handleDateRangeApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                適用
              </button>
              
              <button
                onClick={handleDateRangeReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;