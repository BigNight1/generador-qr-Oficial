import type { QRType, OutputFormat } from "../types";
import { jsPDF } from "jspdf";

/**
 * Genera la URL final para WhatsApp
 * @param phoneNumber - Número de teléfono
 * @param message - Mensaje opcional
 * @returns URL de WhatsApp
 */
export const generateWhatsAppUrl = (phoneNumber: string, message?: string): string => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

/**
 * Genera la URL final según el tipo
 * @param type - Tipo de QR (url o whatsapp)
 * @param url - URL o número de teléfono
 * @param message - Mensaje para WhatsApp (opcional)
 * @returns URL final
 */
export const generateFinalUrl = (type: QRType, url: string, message?: string): string => {
  if (type === "whatsapp") {
    return generateWhatsAppUrl(url, message);
  }
  return url;
};

/**
 * Convierte una imagen base64 a ImageData para jsPDF
 * @param base64 - String base64 de la imagen
 * @returns Promise con ImageData
 */
const base64ToImageData = (base64: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Genera y descarga un PDF con el código QR
 * @param imageUrl - URL base64 de la imagen QR
 * @param filename - Nombre del archivo
 */
export const downloadAsPDF = async (imageUrl: string, filename: string): Promise<void> => {
  try {
    const img = await base64ToImageData(imageUrl);
    
    // Crear PDF con tamaño A4 (210x297 mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calcular el tamaño de la imagen para que quepa en el PDF
    // Dejar márgenes de 20mm en cada lado
    const maxWidth = pdfWidth - 40;
    const maxHeight = pdfHeight - 40;
    
    // Mantener la proporción de la imagen
    const imgAspectRatio = img.width / img.height;
    let imgWidth = maxWidth;
    let imgHeight = maxWidth / imgAspectRatio;
    
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = maxHeight * imgAspectRatio;
    }
    
    // Centrar la imagen en el PDF
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;
    
    // Agregar la imagen al PDF
    pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight);
    
    // Descargar el PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw new Error("No se pudo generar el PDF");
  }
};

/**
 * Descarga una imagen desde una URL base64
 * @param imageUrl - URL base64 de la imagen
 * @param filename - Nombre del archivo
 * @param extension - Extensión del archivo (jpg, png, pdf, svg)
 */
export const downloadImage = async (
  imageUrl: string,
  filename: string,
  extension: OutputFormat
): Promise<void> => {
  if (extension === "pdf") {
    await downloadAsPDF(imageUrl, filename);
    return;
  }

  if (extension === "svg") {
    // Para SVG, decodificar el base64 y crear un blob
    try {
      // Extraer el base64 del data URI
      const base64Match = imageUrl.match(/base64,(.+)$/);
      if (!base64Match) {
        throw new Error("Formato de imagen SVG inválido");
      }
      
      const base64Data = base64Match[1];
      const svgString = atob(base64Data);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpiar el URL del blob
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar SVG:", error);
      throw new Error("No se pudo descargar el archivo SVG");
    }
    return;
  }

  // Para JPG y PNG, usar el método tradicional
  const a = document.createElement("a");
  a.href = imageUrl;
  a.download = `${filename}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

