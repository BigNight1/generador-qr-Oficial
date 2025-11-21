export type QRType = "url" | "whatsapp";
export type OutputFormat = "jpg" | "png" | "pdf" | "svg";
export type Language = "es" | "en" | "pt";

export interface QRFormData {
  url: string;
  whatsappMessage: string;
  type: QRType;
  qrSize: number;
  enableLogo: boolean;
  logoFile: File | null;
  outputFormat: OutputFormat;
  qrColor: string;
}

export interface QRGenerateRequest {
  url: string;
  size: number;
  logo: string | null;
  format: OutputFormat;
  color: string;
}

export interface QRGenerateResponse {
  qrCode: string;
  size?: number;
  warning?: string;
  error?: string;
}

