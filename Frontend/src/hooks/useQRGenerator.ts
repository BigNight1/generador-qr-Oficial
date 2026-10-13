import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { QRType, OutputFormat, WiFiSecurity, FieldValues } from "../types";
import { QR_TYPE_LIST, getQrTypeById } from "../config/qrTypes";
import { QR_CONFIG } from "../constants";
import { downloadQr, generateQr, type QrResult } from "../lib/qr";
import { fileToBase64, isValidImageFile, isValidFileSize } from "../utils/fileUtils";
import { generateFinalUrl } from "../utils/qrUtils";
import { saveQRToHistory } from "../utils/historyUtils";
import { createQrGenerationGuard } from "../utils/qrGenerationGuard";

export interface UseQRGeneratorReturn {
  // Form state
  url: string;
  setUrl: (url: string) => void;
  whatsappPhone: string;
  setWhatsappPhone: (phone: string) => void;
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
  /** Values of the field-driven types (registry forms), keyed by type id. */
  fieldValues: Record<string, FieldValues>;
  setFieldValue: (typeId: string, name: string, value: string) => void;
  /** Error codes from the last generate attempt, keyed by field name. */
  fieldErrors: Record<string, string>;
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

/** Initial values of every field-driven type: option fields start on their first option. */
const initialFieldValues = (): Record<string, FieldValues> => {
  const all: Record<string, FieldValues> = {};
  for (const entry of QR_TYPE_LIST) {
    if (!entry.form) continue;
    all[entry.id] = Object.fromEntries(
      entry.form.fields.map((field) => [field.name, field.defaultValue ?? field.options?.[0] ?? ""])
    );
  }
  return all;
};

export const useQRGenerator = (): UseQRGeneratorReturn => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>("");
  const [whatsappPhone, setWhatsappPhone] = useState<string>("");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [wifiSSID, setWifiSSID] = useState<string>("");
  const [wifiPassword, setWifiPassword] = useState<string>("");
  const [wifiSecurity, setWifiSecurity] = useState<WiFiSecurity>("WPA");
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValues>>(initialFieldValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [type, setTypeState] = useState<QRType>("url");
  const [qrSize, setQrSize] = useState<number>(QR_CONFIG.DEFAULT_SIZE);
  const [enableLogo, setEnableLogo] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpg");
  const [qrColor, setQrColor] = useState<string>(QR_CONFIG.DEFAULT_COLOR);
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<number>(QR_CONFIG.DEFAULT_SIZE);
  const [loading, setLoading] = useState<boolean>(false);
  // Latest generated code: downloads re-render it in whichever format is selected.
  const lastResult = useRef<QrResult | null>(null);
  const generationGuard = useRef(createQrGenerationGuard());

  const invalidateQrResult = () => {
    generationGuard.current.invalidate();
    setQrCodeImage("");
    lastResult.current = null;
    setLoading(false);
  };

  const updateUrl = (value: string) => {
    invalidateQrResult();
    setUrl(value);
  };
  const updateWhatsappPhone = (value: string) => {
    invalidateQrResult();
    setWhatsappPhone(value);
  };
  const updateWhatsappMessage = (value: string) => {
    invalidateQrResult();
    setWhatsappMessage(value);
  };
  const updateWifiSSID = (value: string) => {
    invalidateQrResult();
    setWifiSSID(value);
  };
  const updateWifiPassword = (value: string) => {
    invalidateQrResult();
    setWifiPassword(value);
  };
  const updateWifiSecurity = (value: WiFiSecurity) => {
    invalidateQrResult();
    setWifiSecurity(value);
  };
  const updateWifiHidden = (value: boolean) => {
    invalidateQrResult();
    setWifiHidden(value);
  };
  const updateTextContent = (value: string) => {
    invalidateQrResult();
    setTextContent(value);
  };
  const updateQrSize = (value: number) => {
    invalidateQrResult();
    setQrSize(value);
  };
  const updateEnableLogo = (value: boolean) => {
    invalidateQrResult();
    setEnableLogo(value);
  };
  const updateLogoFile = (value: File | null) => {
    invalidateQrResult();
    setLogoFile(value);
  };
  const updateQrColor = (value: string) => {
    invalidateQrResult();
    setQrColor(value);
  };

  const setType = (next: QRType) => {
    invalidateQrResult();
    setTypeState(next);
    setFieldErrors({});
  };

  const setFieldValue = (typeId: string, name: string, value: string) => {
    invalidateQrResult();
    setFieldValues((previous) => ({ ...previous, [typeId]: { ...previous[typeId], [name]: value } }));
    setFieldErrors((previous) => {
      if (!(name in previous)) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

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

    invalidateQrResult();
    setLogoFile(file);
    const base64 = await fileToBase64(file);
    setLogoPreview(base64);
  };

  const generateQRCode = async () => {
    const targetUrlOrPhone = type === "whatsapp" ? whatsappPhone : url;
    const form = getQrTypeById(type).form;
    // Field-driven types (registry forms) validate and build their own payload.
    let formPayload: string | null = null;

    if (form) {
      const values = fieldValues[type];
      const { errors } = form.validate(values);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        const firstInvalid = form.fields.find((field) => errors[field.name]);
        if (firstInvalid) document.getElementById(`qr-field-${firstInvalid.name}`)?.focus();
        return;
      }
      setFieldErrors({});
      formPayload = form.buildPayload(values);
    } else if (type === "wifi") {
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
      if (!targetUrlOrPhone) {
        alert(t("errors.urlRequired"));
        return;
      }
    }

    if (enableLogo && !logoFile) {
      alert(t("errors.logoRequired"));
      return;
    }

    const generation = generationGuard.current.begin();
    setQrCodeImage("");
    lastResult.current = null;
    setLoading(true);

    try {
      const finalUrl =
        formPayload ??
        generateFinalUrl(
          type,
          targetUrlOrPhone,
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
      const logoDataUrl = enableLogo && logoFile ? await fileToBase64(logoFile) : null;

      const result = await generateQr({
        content: finalUrl,
        sizePx: qrSize,
        color: qrColor,
        logoDataUrl,
        format: outputFormat,
      });

      if (!generationGuard.current.isCurrent(generation)) return;

      lastResult.current = result;
      setQrCodeImage(result.previewDataUrl);
      setSelectedSize(result.sizePx);

      // Guardar en el historial
      saveQRToHistory(result.previewDataUrl, finalUrl, outputFormat, result.sizePx);

      if (result.logoFailed) {
        alert(t("errors.logoFailed"));
      }
    } catch (error) {
      if (!generationGuard.current.isCurrent(generation)) return;
      console.error("Error al generar el QR:", error);
      const tooLong = error instanceof Error && /too big|cannot contain/i.test(error.message);
      alert(t(tooLong ? "errors.contentTooLong" : "errors.generateError"));
    } finally {
      if (generationGuard.current.isCurrent(generation)) setLoading(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!lastResult.current) return;
    try {
      await downloadQr(lastResult.current, outputFormat, "qrcode");
    } catch (error) {
      console.error("Error al descargar:", error);
      alert(t("errors.generateError"));
    }
  };

  return {
    url,
    setUrl: updateUrl,
    whatsappPhone,
    setWhatsappPhone: updateWhatsappPhone,
    whatsappMessage,
    setWhatsappMessage: updateWhatsappMessage,
    wifiSSID,
    setWifiSSID: updateWifiSSID,
    wifiPassword,
    setWifiPassword: updateWifiPassword,
    wifiSecurity,
    setWifiSecurity: updateWifiSecurity,
    wifiHidden,
    setWifiHidden: updateWifiHidden,
    textContent,
    setTextContent: updateTextContent,
    fieldValues,
    setFieldValue,
    fieldErrors,
    type,
    setType,
    qrSize,
    setQrSize: updateQrSize,
    enableLogo,
    setEnableLogo: updateEnableLogo,
    logoFile,
    setLogoFile: updateLogoFile,
    logoPreview,
    setLogoPreview,
    outputFormat,
    setOutputFormat,
    qrColor,
    setQrColor: updateQrColor,
    qrCodeImage,
    selectedSize,
    loading,
    handleLogoChange,
    generateQRCode,
    handleDownloadQR,
  };
};

