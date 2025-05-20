import React, { useState, useEffect } from 'react';
import { ProductionData, Product, Process, Worker } from '../types';

interface DataEntryFormProps {
  onSubmit: (data: ProductionData) => void;
  initialData?: ProductionData;
  isEditing?: boolean;
  products: Product[];
  processes: Process[];
  workers: Worker[];
}

const DEFAULT_FORM_DATA: Omit<ProductionData, 'id'> = {
  date: new Date().toISOString().split('T')[0],
  productId: '',
  processId: '',
  processName: '',
  actualQuantity: 0,
  defectCount: 0,
  workMinutes: 0,
  workerName: '',
  notes: ''
};

const DataEntryForm: React.FC<DataEntryFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEditing = false,
  products,
  processes,
  workers
}) => {
  const [formData, setFormData] = useState<Omit<ProductionData, 'id'>>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        productId: initialData.productId,
        processId: initialData.processId,
        processName: initialData.processName,
        actualQuantity: initialData.actualQuantity,
        defectCount: initialData.defectCount,
        workMinutes: initialData.workMinutes,
        workerName: initialData.workerName,
        notes: initialData.notes
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = '日付を入力してください';
    }
    
    if (!formData.productId) {
      newErrors.productId = '商品を選択してください';
    }

    if (!formData.processId) {
      newErrors.processId = '工程を選択してください';
    }
    
    if (formData.actualQuantity < 0) {
      newErrors.actualQuantity = '実績数量は0以上である必要があります';
    }
    
    if (formData.defectCount < 0) {
      newErrors.defectCount = '不良数は0以上である必要があります';
    }
    
    if (formData.defectCount > formData.actualQuantity) {
      newErrors.defectCount = '不良数は実績数量を超えることはできません';
    }
    
    if (formData.workMinutes < 0) {
      newErrors.workMinutes = '作業時間は0以上である必要があります';
    }
    
    if (!formData.workerName) {
      newErrors.workerName = '作業者を選択してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'processId') {
      const selectedProcess = processes.find(p => p.id === value);
      setFormData({
        ...formData,
        processId: value,
        processName: selectedProcess?.name || ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        id: initialData?.id || crypto.randomUUID(),
        ...formData
      });
      
      if (!isEditing) {
        setFormData(DEFAULT_FORM_DATA);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        {isEditing ? '生産データ編集' : '新規生産データ入力'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              日付
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              商品
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.productId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">商品を選択</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.code}
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-red-500 text-xs mt-1">{errors.productId}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              工程
            </label>
            <select
              name="processId"
              value={formData.processId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.processId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">工程を選択</option>
              {processes.map(process => (
                <option key={process.id} value={process.id}>
                  {process.name}
                </option>
              ))}
            </select>
            {errors.processId && <p className="text-red-500 text-xs mt-1">{errors.processId}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              実績数量
            </label>
            <input
              type="number"
              name="actualQuantity"
              value={formData.actualQuantity}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.actualQuantity ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.actualQuantity && <p className="text-red-500 text-xs mt-1">{errors.actualQuantity}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              不良数
            </label>
            <input
              type="number"
              name="defectCount"
              value={formData.defectCount}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.defectCount ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.defectCount && <p className="text-red-500 text-xs mt-1">{errors.defectCount}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              作業時間（分）
            </label>
            <input
              type="number"
              name="workMinutes"
              value={formData.workMinutes}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.workMinutes ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.workMinutes && <p className="text-red-500 text-xs mt-1">{errors.workMinutes}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              作業者
            </label>
            <select
              name="workerName"
              value={formData.workerName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.workerName ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">作業者を選択</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.name}>
                  {worker.name}
                </option>
              ))}
            </select>
            {errors.workerName && <p className="text-red-500 text-xs mt-1">{errors.workerName}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            メモ
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            rows={3}
            placeholder="特記事項やコメントを入力"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? '更新する' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntryForm;