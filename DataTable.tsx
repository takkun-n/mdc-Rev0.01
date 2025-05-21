import React, { useState } from 'react';
import { ProductionData } from '../types';
import { Edit, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  calculateEfficiency, 
  calculateDefectRate, 
  calculateProductivity,
  calculateOutputPerWorker 
} from '../utils/calculationHelpers';

interface DataTableProps {
  data: ProductionData[];
  onEdit: (data: ProductionData) => void;
  onDelete: (id: string) => void;
  onViewDetails: (data: ProductionData) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const [sortField, setSortField] = useState<keyof ProductionData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof ProductionData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  };

  return (
    <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('date')}
            >
              日付
              {sortField === 'date' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('productName')}
            >
              製品名
              {sortField === 'productName' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('plannedQuantity')}
            >
              計画数量
              {sortField === 'plannedQuantity' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('actualQuantity')}
            >
              実績数量
              {sortField === 'actualQuantity' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort('defectCount')}
            >
              不良数
              {sortField === 'defectCount' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              効率 (%)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              不良率 (%)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.date)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.productName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-right">{item.plannedQuantity.toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap text-right">{item.actualQuantity.toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap text-right">{item.defectCount.toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                {calculateEfficiency(item).toFixed(2)}%
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                {calculateDefectRate(item).toFixed(2)}%
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => onViewDetails(item)}
                    className="text-blue-600 hover:text-blue-800" 
                    title="詳細"
                  >
                    <FileText size={18} />
                  </button>
                  <button 
                    onClick={() => onEdit(item)} 
                    className="text-green-600 hover:text-green-800"
                    title="編集"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="削除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                データがありません。新しいデータを入力してください。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;