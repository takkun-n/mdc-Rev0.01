import { ProductionData } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data: ProductionData[]) => {
  if (data.length === 0) {
    alert('エクスポートするデータがありません。');
    return;
  }

  const headers = [
    '日付',
    '商品コード',
    '工程',
    '実績数量',
    '不良数',
    '作業時間(分)',
    '作業者',
    'メモ'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.date,
      item.productId,
      item.processName,
      item.actualQuantity,
      item.defectCount,
      item.workMinutes,
      item.workerName,
      `"${item.notes.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `production_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: ProductionData[]) => {
  if (data.length === 0) {
    alert('エクスポートするデータがありません。');
    return;
  }

  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.text('生産データ一覧', 14, 15);
  
  const headers = [
    ['日付', '商品コード', '工程', '実績数量', '不良数', '作業時間(分)', '作業者']
  ];
  
  const rows = data.map(item => [
    item.date,
    item.productId,
    item.processName,
    item.actualQuantity.toString(),
    item.defectCount.toString(),
    item.workMinutes.toString(),
    item.workerName
  ]);

  (doc as any).autoTable({
    head: headers,
    body: rows,
    startY: 25,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [51, 122, 183],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold'
    }
  });

  doc.save(`production_data_${new Date().toISOString().split('T')[0]}.pdf`);
};