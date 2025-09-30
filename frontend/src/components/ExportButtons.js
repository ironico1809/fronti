import * as XLSX from 'xlsx';
import React, { useState, useRef } from 'react';
import Button from './Button';
import './ExportButtons.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

/**
 * Componente para exportar reportes en PDF y Excel - CU-26
 * @param {Object} props
 * @param {Object} props.data - Datos a exportar
 * @param {string} props.fileName - Nombre del archivo (sin extensión)
 * @param {string} props.reportTitle - Título del reporte
 * @param {boolean} props.disabled - Si los botones están deshabilitados
 * @param {Function} props.onExportStart - Callback cuando inicia la exportación
 * @param {Function} props.onExportComplete - Callback cuando termina la exportación
 * @param {Function} props.onExportError - Callback cuando hay error
 */
const ExportButtons = ({
  data = [],
  fileName = 'reporte',
  reportTitle = 'Reporte',
  disabled = false,
  onExportStart = () => {},
  onExportComplete = () => {},
  onExportError = () => {}
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null);
  const chartRef = useRef();

  // Función para exportar a PDF
  // Renderiza el gráfico en un canvas oculto y retorna la imagen base64
  const renderChartToImage = () => {
    return new Promise((resolve) => {
      // Elimina canvas anterior si existe
      if (chartRef.current) {
        chartRef.current.remove();
      }
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 300;
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
      chartRef.current = canvas;
      const ctx = canvas.getContext('2d');
      const labels = data.map(row => row.area || row.nombre || row.id_area || 'Área');
      const values = data.map(row => row.total_reservas || row.reservas || 0);
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Reservas',
            data: values,
            backgroundColor: 'rgba(255,185,2,0.7)',
            borderColor: 'rgba(255,185,2,1)',
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Gráfico de Ocupación', font: { size: 18 } }
          },
          scales: {
            x: { title: { display: true, text: 'Áreas' } },
            y: { title: { display: true, text: 'Reservas' }, beginAtZero: true }
          },
          animation: false,
          responsive: false,
        }
      });
      setTimeout(() => {
        const imgData = canvas.toDataURL('image/png');
        chart.destroy();
        canvas.remove();
        resolve(imgData);
      }, 500); // Espera breve para renderizar
    });
  };

  const exportToPDF = async () => {
    if (disabled || isExporting) return;
    try {
      setIsExporting(true);
      setExportingFormat('PDF');
      onExportStart('PDF');

      if (!data || data.length === 0) {
        throw new Error('No hay datos disponibles para exportar');
      }

      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      // Título y metadatos
      doc.setFontSize(18);
      doc.text(reportTitle, 14, 18);
      doc.setFontSize(11);
      doc.text(`Fecha de generación: ${currentDate}`, 14, 28);
      doc.text(`Número de registros: ${data.length}`, 14, 36);
      doc.text('Exportado desde Smart Condominium', 14, 44);

      // Gráfico de barras
      let y = 54;
      if (data && data.length > 0) {
        const imgData = await renderChartToImage();
        doc.addImage(imgData, 'PNG', 14, y, 180, 80);
        y += 90;
      }

      // Tabla de datos
      const headers = Object.keys(data[0] || {});
      const tableData = data.map(row => headers.map(h => String(row[h] ?? '')));
      autoTable(doc, {
        head: [headers.map(h => h.toUpperCase())],
        body: tableData,
        startY: y,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 185, 2] },
        margin: { left: 14, right: 14 },
      });

      doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
      onExportComplete('PDF', `${fileName}.pdf`);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      onExportError('PDF', error.message || 'Error al generar el archivo PDF');
      alert(`Error al exportar PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  // Función para exportar a Excel
  const exportToExcel = async () => {
    if (disabled || isExporting) return;
    try {
      setIsExporting(true);
      setExportingFormat('Excel');
      onExportStart('Excel');

      if (!data || data.length === 0) {
        throw new Error('No hay datos disponibles para exportar');
      }

      // Preparar datos para la hoja Excel
      const currentDate = new Date().toLocaleDateString();
      const headers = Object.keys(data[0] || {});
      const tableData = data.map(row => {
        const obj = {};
        headers.forEach(h => { obj[h.toUpperCase()] = row[h]; });
        return obj;
      });

      // Crear hoja y libro
      const ws = XLSX.utils.json_to_sheet(tableData, { header: headers.map(h => h.toUpperCase()) });
      // Agregar título y metadatos arriba
      XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'A1' });
      XLSX.utils.sheet_add_aoa(ws, [[`Fecha de generación:`, currentDate]], { origin: `A2` });
      XLSX.utils.sheet_add_aoa(ws, [[`Número de registros:`, data.length]], { origin: `A3` });
      XLSX.utils.sheet_add_aoa(ws, [[`Exportado desde:`, 'Smart Condominium']], { origin: `A4` });
      // Mover tabla de datos hacia abajo
      XLSX.utils.sheet_add_aoa(ws, [headers.map(h => h.toUpperCase())], { origin: `A6` });
      data.forEach((row, i) => {
        XLSX.utils.sheet_add_aoa(ws, [headers.map(h => row[h])], { origin: `A${7 + i}` });
      });

      // Solo exportar la hoja de datos (sin gráfico, por límite de Excel)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      onExportComplete('Excel', `${fileName}.xlsx`);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      onExportError('Excel', error.message || 'Error al generar el archivo Excel');
      alert(`Error al exportar Excel: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  // (Eliminada función generatePDFContent, ahora se usa jsPDF)

  // Generar contenido Excel simulado
  const generateExcelContent = () => {
    const currentDate = new Date().toLocaleDateString();
    const dataCount = Array.isArray(data) ? data.length : Object.keys(data).length;
    
    // Contenido CSV simulado (compatible con Excel)
    let csvContent = `${reportTitle}\n`;
    csvContent += `Fecha de generación,${currentDate}\n`;
    csvContent += `Número de registros,${dataCount}\n`;
    csvContent += `Exportado desde,Smart Condominium\n\n`;
    
    // Agregar headers y datos si es array
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent += headers.join(',') + '\n';
      
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header] || '';
          // Escapar comillas y comas
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        });
        csvContent += values.join(',') + '\n';
      });
    }
    
    return csvContent;
  };

  return (
    <div className="export-buttons">
      <Button
        onClick={exportToPDF}
        disabled={disabled || isExporting}
        className={`export-btn pdf-btn ${isExporting && exportingFormat === 'PDF' ? 'loading' : ''}`}
      >
        {isExporting && exportingFormat === 'PDF' ? (
          <>
            <span className="export-spinner">⟳</span>
            Generando PDF...
          </>
        ) : (
          <>
            📄 Exportar PDF
          </>
        )}
      </Button>

      <Button
        onClick={exportToExcel}
        disabled={disabled || isExporting}
        className={`export-btn excel-btn ${isExporting && exportingFormat === 'Excel' ? 'loading' : ''}`}
      >
        {isExporting && exportingFormat === 'Excel' ? (
          <>
            <span className="export-spinner">⟳</span>
            Generando Excel...
          </>
        ) : (
          <>
            📊 Exportar Excel
          </>
        )}
      </Button>
    </div>
  );
};
export default ExportButtons;