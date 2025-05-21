import React from 'react';
import { ProductionData } from '../types';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  calculateEfficiency, 
  calculateDefectRate, 
  calculateProductivity,
  calculateOutputPerWorker 
} from '../utils/calculationHelpers';

interface DetailModalProps {
  data: ProductionData;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ data, onClose }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  };

  const efficiency = calculateEfficiency(data);
  const defectRate = calculateDefectRate(data);
  const productivity = calculateProductivity(data);
  const outputPerWorker = calculateOutputPerWorker(data);

  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDefectRateColor = (value: number) => {
    if (value <= 3) return 'text-green-500';
    if (value <= 8) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">生産データ詳細</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm text-gray-500 uppercase">製品名</h3>
              <p className="text-lg font-semibold">{data.productName}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 uppercase">日付</h3>
              <p className="text-lg">{formatDate(data.date)}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 uppercase">計画数量</h3>
              <p className="text-lg">{data.plannedQuantity.toLocaleString()} 個</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 uppercase">実績数量</h3>
              <p className="text-lg">{data.actualQuantity.toLocaleString()} 個</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 uppercase">不良数</h3>
              <p className="text-lg">{data.defectCount.toLocaleString()} 個</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 uppercase">作業時間</h3>
              <p className="text-lg">{data.workHours} 時間</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 uppercase">作業者数</h3>
              <p className="text-lg">{data.workers} 人</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm text-gray-500 uppercase mb-3">計算された指標</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-sm text-gray-500">生産効率</h4>
                <p className={`text-xl font-bold ${getEfficiencyColor(efficiency)}`}>
                  {efficiency.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  計画数量に対する実績の割合
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-sm text-gray-500">不良率</h4>
                <p className={`text-xl font-bold ${getDefectRateColor(defectRate)}`}>
                  {defectRate.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  実績数量に対する不良品の割合
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-sm text-gray-500">時間あたり生産性</h4>
                <p className="text-xl font-bold text-blue-600">
                  {productivity.toFixed(2)} 個/時間
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  時間あたりの生産数量
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="text-sm text-gray-500">作業者あたり生産量</h4>
                <p className="text-xl font-bold text-blue-600">
                  {outputPerWorker.toFixed(2)} 個/人
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  作業者一人あたりの生産数量
                </p>
              </div>
            </div>
          </div>
          
          {data.notes && (
            <div>
              <h3 className="text-sm text-gray-500 uppercase mb-2">メモ</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line">{data.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;