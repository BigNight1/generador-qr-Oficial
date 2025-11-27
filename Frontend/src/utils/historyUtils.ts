export interface QRHistoryItem {
  image: string;
  url: string;
  date: string; // ISO string
  format?: "jpg" | "png" | "pdf" | "svg"; // Formato usado para generar el QR (opcional para compatibilidad)
  size?: number; // Tamaño del QR en píxeles (opcional para compatibilidad)
}

const STORAGE_KEY = "qr_history";

/**
 * Obtiene el historial de QRs desde localStorage
 */
export const getQRHistory = (): QRHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as QRHistoryItem[];
  } catch (error) {
    console.error("Error al leer el historial:", error);
    return [];
  }
};

/**
 * Guarda un nuevo QR en el historial
 */
export const saveQRToHistory = (
  image: string,
  url: string,
  format: "jpg" | "png" | "pdf" | "svg",
  size: number
): void => {
  try {
    const history = getQRHistory();
    const newItem: QRHistoryItem = {
      image,
      url,
      date: new Date().toISOString(),
      format,
      size,
    };
    history.unshift(newItem); // Agregar al inicio
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error al guardar en el historial:", error);
  }
};

/**
 * Formatea una fecha ISO a formato legible (DD/MM/YYYY HH:mm)
 */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return isoString;
  }
};

/**
 * Limpia todo el historial
 */
export const clearQRHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error al limpiar el historial:", error);
  }
};

