import { ProductionData, WorkerEfficiency, QualityMetric, ProductionEfficiency } from '../types';

// 生産性（1時間あたりの生産量）を計算
export const calculateProductivity = (data: ProductionData): number => {
  if (data.workHours === 0) return 0;
  return data.actualQuantity / data.workHours;
};

// 効率（計画量に対する実績の割合）を計算
export const calculateEfficiency = (data: ProductionData): number => {
  if (data.plannedQuantity === 0) return 0;
  return (data.actualQuantity / data.plannedQuantity) * 100;
};

// 不良率（全体生産量に対する不良品の割合）を計算
export const calculateDefectRate = (data: ProductionData): number => {
  if (data.actualQuantity === 0) return 0;
  return (data.defectCount / data.actualQuantity) * 100;
};

// 作業者一人あたりの生産量を計算
export const calculateOutputPerWorker = (data: ProductionData): number => {
  if (data.workers === 0) return 0;
  return data.actualQuantity / data.workers;
};

// 日付ごとの作業効率データを生成
export const generateWorkerEfficiencyData = (data: ProductionData[]): WorkerEfficiency[] => {
  return data.map(item => ({
    date: item.date,
    efficiency: calculateOutputPerWorker(item)
  }));
};

// 日付ごとの品質メトリクスデータを生成
export const generateQualityMetricsData = (data: ProductionData[]): QualityMetric[] => {
  return data.map(item => ({
    date: item.date,
    defectRate: calculateDefectRate(item)
  }));
};

// 日付ごとの生産効率データを生成
export const generateEfficiencyData = (data: ProductionData[]): ProductionEfficiency[] => {
  return data.map(item => ({
    date: item.date,
    efficiency: calculateEfficiency(item)
  }));
};

// 期間内の平均生産効率を計算
export const calculateAverageEfficiency = (data: ProductionData[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + calculateEfficiency(item), 0);
  return sum / data.length;
};

// 期間内の平均不良率を計算
export const calculateAverageDefectRate = (data: ProductionData[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + calculateDefectRate(item), 0);
  return sum / data.length;
};