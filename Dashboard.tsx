import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  AlertTriangle, 
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProductionData } from '../utils/localStorageManager';
import { 
  calculateEfficiency, 
  calculateDefectRate, 
  calculateProductivity,
  calculateOutputPerWorker,
  generateWorkerEfficiencyData,
  generateQualityMetricsData,
  generateEfficiencyData,
  calculateAverageEfficiency,
  calculateAverageDefectRate
} from '../utils/calculationHelpers';
import { ProductionData } from '../types';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import ChartComponent from '../components/ChartComponent';
import FilterBar from '../components/FilterBar';
import { exportToCSV, exportToPDF } from '../utils/exportHelpers';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductionData[]>([]);
  const [today, setToday] = useState('');
  const [lastWeek, setLastWeek] = useState('');

  useEffect(() => {
    const data = getProductionData();
    setProductionData(data);
    setFilteredData(data);
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    setToday(todayStr);
    
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    setLastWeek(lastWeekDate.toISOString().split('T')[0]);
  }, []);

  const getRecentData = () => {
    if (filteredData.length === 0) return [];
    return [...filteredData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredData(productionData);
      return;
    }
    const filtered = productionData.filter(item => 
      item.productId.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    if (!startDate && !endDate) {
      setFilteredData(productionData);
      return;
    }
    
    const filtered = productionData.filter(item => {
      const itemDate = new Date(item.date);
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        return itemDate >= start && itemDate <= end;
      }
      if (startDate) {
        const start = new Date(startDate);
        return itemDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        return itemDate <= end;
      }
      return true;
    });
    
    setFilteredData(filtered);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredData);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredData);
  };

  const navigateToDataEntry = () => {
    navigate('/data-entry');
  };

  const recentData = getRecentData();
  const workerEfficiencyData = generateWorkerEfficiencyData(recentData);
  const qualityMetricsData = generateQualityMetricsData(recentData);
  const efficiencyData = generateEfficiencyData(recentData);
  
  const avgEfficiency = calculateAverageEfficiency(filteredData);
  const avgDefectRate = calculateAverageDefectRate(filteredData);
  
  const totalPlanned = filteredData.reduce((sum, item) => sum + (item.plannedQuantity || 0), 0);
  const totalActual = filteredData.reduce((sum, item) => sum + item.actualQuantity, 0);
  const totalDefects = filteredData.reduce((sum, item) => sum + item.defectCount, 0);
  const totalHours = filteredData.reduce((sum, item) => sum + (item.workMinutes / 60), 0);
  
  const recentAvgEfficiency = calculateAverageEfficiency(recentData);
  const efficiencyTrend = avgEfficiency > 0 ? ((recentAvgEfficiency - avgEfficiency) / avgEfficiency) * 100 : 0;
  
  const recentAvgDefectRate = calculateAverageDefectRate(recentData);
  const defectRateTrend = avgDefectRate > 0 ? ((recentAvgDefectRate - avgDefectRate) / avgDefectRate) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">生産進捗ダッシュボード</h1>
          <p className="text-gray-600">生産データの概要と分析</p>
        </div>
        
        <FilterBar 
          onSearch={handleSearch}
          onDateRangeChange={handleDateRangeChange}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
        
        {filteredData.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">データがありません</h2>
            <p className="text-gray-600 mb-4">
              生産データを入力して、ダッシュボードに表示される分析情報を確認しましょう。
            </p>
            <button 
              onClick={navigateToDataEntry}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              データ入力へ
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashboardCard 
                title="生産効率"
                value={`${avgEfficiency.toFixed(1)}%`}
                icon={<TrendingUp size={24} className="text-blue-600" />}
                trend={efficiencyTrend}
                trendLabel="先週比"
                color="blue"
              />
              
              <DashboardCard 
                title="不良率"
                value={`${avgDefectRate.toFixed(1)}%`}
                icon={<AlertTriangle size={24} className="text-red-600" />}
                trend={defectRateTrend}
                trendLabel="先週比"
                color="red"
              />
              
              <DashboardCard 
                title="総生産数"
                value={totalActual.toLocaleString()}
                icon={<BarChart3 size={24} className="text-green-600" />}
                color="green"
              />
              
              <DashboardCard 
                title="総作業時間"
                value={`${totalHours.toFixed(1)}時間`}
                icon={<Clock size={24} className="text-purple-600" />}
                color="purple"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartComponent 
                data={efficiencyData}
                type="line"
                dataKey="efficiency"
                title="生産効率推移"
                valueSuffix="%"
                yAxisLabel="効率 (%)"
                color="#3b82f6"
              />
              
              <ChartComponent 
                data={qualityMetricsData}
                type="area"
                dataKey="defectRate"
                title="不良率推移"
                valueSuffix="%"
                yAxisLabel="不良率 (%)"
                color="#ef4444"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartComponent 
                data={workerEfficiencyData}
                type="bar"
                dataKey="efficiency"
                title="作業者あたり生産量"
                valueSuffix=" 個/人"
                yAxisLabel="生産量/人"
                color="#10b981"
              />
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">生産サマリー</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-r pr-4">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">計画数量</p>
                      <p className="text-xl font-bold">{totalPlanned.toLocaleString()}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">実績数量</p>
                      <p className="text-xl font-bold">{totalActual.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">不良数</p>
                      <p className="text-xl font-bold">{totalDefects.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">達成率</p>
                      <p className="text-xl font-bold">
                        {totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">生産性</p>
                      <p className="text-xl font-bold">
                        {totalHours > 0 ? (totalActual / totalHours).toFixed(1) : 0} 個/時間
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">不良率</p>
                      <p className="text-xl font-bold">
                        {totalActual > 0 ? ((totalDefects / totalActual) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;