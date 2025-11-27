import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { QRType, OutputFormat, WiFiSecurity } from "../types";
import { QR_CONFIG } from "../constants";
import { QRService } from "../services/qrService";
import { fileToBase64, isValidImageFile, isValidFileSize } from "../utils/fileUtils";
import { generateFinalUrl, downloadImage } from "../utils/qrUtils";
import { saveQRToHistory } from "../utils/historyUtils";

export interface UseQRGeneratorReturn {
  // Form state
  url: string;
  setUrl: (url: string) => void;
  whatsappMessage: string;
  setWhatsappMessage: (message: string) => void;
  wifiSSID: string;
  setWifiSSID: (ssid: string) => void;
  wifiPassword: string;
  setWifiPassword: (password: string) => void;
  wifiSecurity: WiFiSecurity;
  setWifiSecurity: (security: WiFiSecurity) => void;
  wifiHidden: boolean;
  setWifiHidden: (hidden: boolean) => void;
  textContent: string;
  setTextContent: (text: string) => void;
  type: QRType;
  setType: (type: QRType) => void;
  qrSize: number;
  setQrSize: (size: number) => void;
  enableLogo: boolean;
  setEnableLogo: (enable: boolean) => void;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  logoPreview: string;
  setLogoPreview: (preview: string) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
  qrColor: string;
  setQrColor: (color: string) => void;
  
  // QR state
  qrCodeImage: string;
  selectedSize: number;
  loading: boolean;
  
  // Actions
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  generateQRCode: () => Promise<void>;
  handleDownloadQR: () => Promise<void>;
}

export const useQRGenerator = (): UseQRGeneratorReturn => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [wifiSSID, setWifiSSID] = useState<string>("");
  const [wifiPassword, setWifiPassword] = useState<string>("");
  const [wifiSecurity, setWifiSecurity] = useState<WiFiSecurity>("WPA");
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [type, setType] = useState<QRType>("url");
  const [qrSize, setQrSize] = useState<number>(QR_CONFIG.DEFAULT_SIZE);
  const [enableLogo, setEnableLogo] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpg");
  const [qrColor, setQrColor] = useState<string>(QR_CONFIG.DEFAULT_COLOR);
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<number>(QR_CONFIG.DEFAULT_SIZE);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert(t("errors.invalidImage"));
      return;
    }

    if (!isValidFileSize(file, QR_CONFIG.MAX_LOGO_SIZE)) {
      alert(t("errors.fileTooLarge"));
      return;
    }

    setLogoFile(file);
    const base64 = await fileToBase64(file);
    setLogoPreview(base64);
  };

  const generateQRCode = async () => {
    if (type === "wifi") {
      if (!wifiSSID) {
        alert(t("errors.wifiSSIDRequired"));
        return;
      }
    } else if (type === "text") {
      if (!textContent.trim()) {
        alert(t("errors.textRequired"));
        return;
      }
    } else {
      if (!url) {
        alert(t("errors.urlRequired"));
        return;
      }
    }

    if (enableLogo && !logoFile) {
      alert(t("errors.logoRequired"));
      return;
    }

    setLoading(true);

    try {
      const finalUrl = generateFinalUrl(
        type,
        url,
        whatsappMessage,
        type === "wifi"
          ? {
              ssid: wifiSSID,
              password: wifiPassword,
              security: wifiSecurity,
              hidden: wifiHidden,
            }
          : undefined,
        type === "text" ? textContent : undefined
      );
      let logoBase64 = null;

      if (enableLogo && logoFile) {
        logoBase64 = await fileToBase64(logoFile);
      }

      const response = await QRService.generateQR({
        url: finalUrl,
        size: qrSize,
        logo: logoBase64,
        format: outputFormat,
        color: qrColor,
      });

      setQrCodeImage(response.qrCode);
      const finalSize = response.size ?? qrSize;
      setSelectedSize(finalSize);
      
      // Guardar en el historial
      saveQRToHistory(response.qrCode, finalUrl, outputFormat, finalSize);
      
      if (response.warning) {
        alert(response.warning);
      }
    } catch (error) {
      console.error("Error al generar el QR:", error);
      alert(t("errors.generateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCodeImage) return;
    try {
      await downloadImage(qrCodeImage, "qrcode", outputFormat);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert(t("errors.generateError"));
    }
  };

  return {
    url,
    setUrl,
    whatsappMessage,
    setWhatsappMessage,
    wifiSSID,
    setWifiSSID,
    wifiPassword,
    setWifiPassword,
    wifiSecurity,
    setWifiSecurity,
    wifiHidden,
    setWifiHidden,
    textContent,
    setTextContent,
    type,
    setType,
    qrSize,
    setQrSize,
    enableLogo,
    setEnableLogo,
    logoFile,
    setLogoFile,
    logoPreview,
    setLogoPreview,
    outputFormat,
    setOutputFormat,
    qrColor,
    setQrColor,
    qrCodeImage,
    selectedSize,
    loading,
    handleLogoChange,
    generateQRCode,
    handleDownloadQR,
  };
};

