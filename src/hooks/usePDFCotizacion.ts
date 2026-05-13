import { useState, createElement } from 'react';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import CotizacionPDF from '../components/CotizacionPDF';
import type { CotizacionPDFProps } from '../components/CotizacionPDF';

/**
 * Fetch + convertir imagen a data URL (base64).
 * Esquiva problemas de CORS de @react-pdf/renderer:
 * el browser sí descarga la imagen vía fetch (subjetos a CORS del servidor),
 * y la convertimos a base64 para que react-pdf la embeba sin más requests.
 *
 * Si falla (CORS bloqueado, 404, timeout), retorna null y el PDF omite la imagen.
 */
async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Pre-carga todas las imágenes de los productos a base64 antes de renderizar el PDF. */
async function preloadCartImages(
  cartItems: CotizacionPDFProps['cartItems'],
): Promise<CotizacionPDFProps['cartItems']> {
  return Promise.all(
    cartItems.map(async item => {
      if (!item.image) return item;
      // Si ya es data URL, no la procesamos
      if (item.image.startsWith('data:')) return item;
      const base64 = await fetchAsBase64(item.image);
      return { ...item, image: base64 ?? undefined };
    }),
  );
}

export function usePDFCotizacion() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async (props: CotizacionPDFProps) => {
    setIsGenerating(true);
    try {
      // Pre-carga imágenes a base64 para esquivar CORS de @react-pdf/renderer
      const cartItemsWithImages = await preloadCartImages(props.cartItems);
      const finalProps: CotizacionPDFProps = { ...props, cartItems: cartItemsWithImages };

      const cotizacionBlob = await pdf(createElement(CotizacionPDF, finalProps)).toBlob();
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
