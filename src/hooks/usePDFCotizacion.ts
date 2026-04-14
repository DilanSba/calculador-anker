import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import { createElement } from 'react';
import CotizacionPDF from '../components/CotizacionPDF';
import type { CotizacionPDFProps } from '../components/CotizacionPDF';

export function usePDFCotizacion() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async (props: CotizacionPDFProps) => {
    setIsGenerating(true);
    try {
      const cotizacionBlob = await pdf(createElement(CotizacionPDF, props)).toBlob();
      const cotizacionBytes = await cotizacionBlob.arrayBuffer();

      const templateResponse = await fetch('/plantilla-anker.pdf');

      if (!templateResponse.ok) {
        // No template found — download just the cotización
        const blob = new Blob([cotizacionBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cotizacion-Anker-${Date.now()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      const templateBytes = await templateResponse.arrayBuffer();
      const templatePdf = await PDFDocument.load(templateBytes);
      const cotizacionPdf = await PDFDocument.load(cotizacionBytes);
      const [cotizacionPage] = await templatePdf.copyPages(cotizacionPdf, [0]);
      templatePdf.insertPage(1, cotizacionPage);

      const finalPdfBytes = await templatePdf.save();
      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cotizacion-Anker-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { downloadPDF, isGenerating };
}
