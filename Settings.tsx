import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Trash2, Plus, X, FileSpreadsheet } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getProductionData, saveProductionData } from '../utils/localStorageManager';
import { Product, Process, Worker } from '../types';

const Settings: React.FC = () => {
  const [backupTime, setBackupTime] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [productImportSuccess, setProductImportSuccess] = useState(false);
  const [productImportError, setProductImportError] = useState('');
  const [processImportSuccess, setProcessImportSuccess] = useState(false);
  const [processImportError, setProcessImportError] = useState('');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [processes, setProcesses] = useState<Process[]>(() => {
    const saved = localStorage.getItem('processes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('workers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newProduct, setNewProduct] = useState({ code: '' });
  const [newProcess, setNewProcess] = useState({ name: '' });
  const [newWorker, setNewWorker] = useState({ name: '' });
  
  useEffect(() => {
    const lastBackup = localStorage.getItem('lastBackupTime');
    if (lastBackup) {
      setBackupTime(lastBackup);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('processes', JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  const handleAddProduct = () => {
    if (newProduct.code) {
      setProducts([...products, { 
        id: crypto.randomUUID(),
        code: newProduct.code
      }]);
      setNewProduct({ code: '' });
    }
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleProductFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductImportSuccess(false);
    setProductImportError('');
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split(/\r?\n/);
        const newProducts: Product[] = [];
        const existingCodes = new Set(products.map(p => p.code));
        
        for (let i = 0; i < lines.length; i++) {
          const code = lines[i].trim();
          if (!code) continue;
          
          if (existingCodes.has(code)) {
            setProductImportError(`商品コード "${code}" は既に存在します`);
            return;
          }
          
          newProducts.push({
            id: crypto.randomUUID(),
            code: code
          });
          existingCodes.add(code);
        }
        
        if (newProducts.length === 0) {
          setProductImportError('有効な商品コードが見つかりませんでした');
          return;
        }
        
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setProductImportSuccess(true);
        event.target.value = '';
      } catch (error) {
        console.error('Product import error:', error);
        setProductImportError('データの読み込み中にエラーが発生しました');
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleProcessFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProcessImportSuccess(false);
    setProcessImportError('');
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split(/\r?\n/);
        const newProcesses: Process[] = [];
        const existingNames = new Set(processes.map(p => p.name));
        
        for (let i = 0; i < lines.length; i++) {
          const name = lines[i].trim();
          if (!name) continue;
          
          if (existingNames.has(name)) {
            setProcessImportError(`工程名 "${name}" は既に存在します`);
            return;
          }
          
          newProcesses.push({
            id: crypto.randomUUID(),
            name: name
          });
          existingNames.add(name);
        }
        
        if (newProcesses.length === 0) {
          setProcessImportError('有効な工程名が見つかりませんでした');
          return;
        }
        
        setProcesses(prevProcesses => [...prevProcesses, ...newProcesses]);
        setProcessImportSuccess(true);
        event.target.value = '';
      } catch (error) {
        console.error('Process import error:', error);
        setProcessImportError('データの読み込み中にエラーが発生しました');
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleAddProcess = () => {
    if (newProcess.name) {
      setProcesses([...processes, { 
        id: crypto.randomUUID(),
        name: newProcess.name
      }]);
      setNewProcess({ name: '' });
    }
  };

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const handleAddWorker = () => {
    if (newWorker.name) {
      setWorkers([...workers, { 
        id: crypto.randomUUID(),
        name: newWorker.name
      }]);
      setNewWorker({ name: '' });
    }
  };

  const handleRemoveWorker = (id: string) => {
    setWorkers(workers.filter(w => w.id !== id));
  };

  const handleExportData = () => {
    const data = getProductionData();
    if (data.length === 0) {
      alert('エクスポートするデータがありません。');
      return;
    }
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `production_data_backup_${dateString}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    const timeString = now.toLocaleString('ja-JP');
    localStorage.setItem('lastBackupTime', timeString);
    setBackupTime(timeString);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportSuccess(false);
    setImportError(false);
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          throw new Error('無効なデータ形式です');
        }
        
        const shouldMerge = window.confirm(
          'インポートしたデータを既存のデータとマージしますか？\n' + 
          '「はい」: データを追加します（重複IDは上書き）\n' +
          '「いいえ」: 既存のデータをすべて置き換えます'
        );
        
        if (shouldMerge) {
          const existingData = getProductionData();
          const newIds = new Set(data.map(item => item.id));
          const nonDuplicateData = existingData.filter(item => !newIds.has(item.id));
          saveProductionData([...nonDuplicateData, ...data]);
        } else {
          saveProductionData(data);
        }
        
        setImportSuccess(true);
        event.target.value = '';
      } catch (error) {
        console.error('Import error:', error);
        setImportError(true);
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (clearConfirm) {
      saveProductionData([]);
      setClearConfirm(false);
      alert('すべてのデータが削除されました');
    } else {
      setClearConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">設定</h1>
          <p className="text-gray-600">データのバックアップと管理設定</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold mb-4 text-blue-900">商品マスター</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">商品コードの一括インポート</h3>
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                      transition duration-200 flex items-center justify-center gap-2 cursor-pointer">
                      <FileSpreadsheet size={18} />
                      CSVファイルを選択
                      <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleProductFileImport}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                {productImportSuccess && (
                  <p className="text-green-600 text-sm mt-2">
                    商品コードを正常にインポートしました。
                  </p>
                )}
                {productImportError && (
                  <p className="text-red-600 text-sm mt-2">
                    {productImportError}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  1行に1つの商品コードが記載されたCSVファイルをアップロードしてください。
                </p>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({ code: e.target.value })}
                  placeholder="商品コード"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition duration-200 flex items-center gap-1"
                >
                  <Plus size={18} />
                  <span>追加</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{product.code}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold mb-4 text-blue-900">工程マスター</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">工程名の一括インポート</h3>
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                      transition duration-200 flex items-center justify-center gap-2 cursor-pointer">
                      <FileSpreadsheet size={18} />
                      CSVファイルを選択
                      <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleProcessFileImport}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                {processImportSuccess && (
                  <p className="text-green-600 text-sm mt-2">
                    工程名を正常にインポートしました。
                  </p>
                )}
                {processImportError && (
                  <p className="text-red-600 text-sm mt-2">
                    {processImportError}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  1行に1つの工程名が記載されたCSVファイルをアップロードしてください。
                </p>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newProcess.name}
                  onChange={(e) => setNewProcess({ name: e.target.value })}
                  placeholder="工程名"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddProcess}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition duration-200 flex items-center gap-1"
                >
                  <Plus size={18} />
                  <span>追加</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {processes.map(process => (
                  <div
                    key={process.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{process.name}</span>
                    <button
                      onClick={() => handleRemoveProcess(process.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold mb-4 text-blue-900">作業者マスター</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ name: e.target.value })}
                  placeholder="作業者名"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddWorker}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition duration-200 flex items-center gap-1"
                >
                  <Plus size={18} />
                  <span>追加</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {workers.map(worker => (
                  <div
                    key={worker.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{worker.name}</span>
                    <button
                      onClick={() => handleRemoveWorker(worker.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold mb-4 text-blue-900">データ管理</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">データのエクスポート</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    現在のデータをJSONファイルとしてバックアップします。
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    データをエクスポート
                  </button>
                  
                  {backupTime && (
                    <p className="text-xs text-gray-500 mt-2">
                      最終バックアップ: {backupTime}
                    </p>
                  )}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium mb-2">データのインポート</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    バックアップしたJSONファイルからデータを復元します。
                  </p>
                  <label className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                    transition duration-200 flex items-center justify-center gap-2 cursor-pointer">
                    <Upload size={18} />
                    ファイルを選択
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                  
                  {importSuccess && (
                    <p className="text-green-600 text-sm mt-2">
                      データのインポートに成功しました。
                    </p>
                  )}
                  
                  {importError && (
                    <p className="text-red-600 text-sm mt-2">
                      データのインポートに失敗しました。ファイル形式を確認してください。
                    </p>
                  )}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium mb-2">データの削除</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    すべての生産データを削除します。この操作は元に戻せません。
                  </p>
                  <button
                    onClick={handleClearData}
                    className={`w-full px-4 py-3 ${
                      clearConfirm ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                    } text-white rounded-lg transition duration-200 flex items-center justify-center gap-2`}
                  >
                    <Trash2 size={18} />
                    {clearConfirm ? '本当に削除しますか？' : 'すべてのデータを削除'}
                  </button>
                  
                  {clearConfirm && (
                    <p className="text-red-600 text-sm mt-2">
                      この操作は元に戻せません。もう一度ボタンをクリックして確定してください。
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold mb-4 text-blue-900">アプリ情報</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">バージョン情報</h3>
                  <p className="text-sm text-gray-600">
                    生産進捗管理アプリケーション v1.1.0
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-md font-medium mb-2">使い方ガイド</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">基本操作</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>「データ入力」タブから新しい生産データを入力できます</li>
                      <li>「ダッシュボード」では生産状況の概要が確認できます</li>
                      <li>商品マスターと作業者マスターを設定してからデータ入力を行ってください</li>
                      <li>定期的にデータをバックアップすることをお勧めします</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;