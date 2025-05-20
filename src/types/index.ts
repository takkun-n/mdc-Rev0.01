// データ型の定義

export interface ProductionData {
  id: string;
  date: string;
  productId: string;
  processId: string;
  processName: string;
  actualQuantity: number;
  defectCount: number;
  workMinutes: number;
  workerName: string;
  notes: string;
}

export interface Product {
  id: string;
  code: string;
}

export interface Process {
  id: string;
  name: string;
}

export interface Worker {
  id: string;
  name: string;
}

export interface WorkerEfficiency {
  date: string;
  efficiency: number;
}

export interface QualityMetric {
  date: string;
  defectRate: number;
}

export interface ProductionEfficiency {
  date: string;
  efficiency: number;
}