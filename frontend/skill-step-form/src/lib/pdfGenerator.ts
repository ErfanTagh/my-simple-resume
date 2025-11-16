import html2pdf from 'html2pdf.js';

/**
 * Generate PDF from HTML element
 * @param element - The HTML element to convert to PDF
 * @param filename - The filename for the PDF (without .pdf extension)
 */
export const generatePDF = async (element: HTMLElement, filename: string = 'resume') => {
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

