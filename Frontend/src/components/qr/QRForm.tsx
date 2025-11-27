import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, MessageCircle, Image as ImageIcon, Wifi, Eye, EyeOff, FileText } from "lucide-react";
import { QR_CONFIG } from "../../constants";
import type { UseQRGeneratorReturn } from "../../hooks/useQRGenerator";
import type { WiFiSecurity } from "../../types";

interface QRFormProps {
  qrGenerator: UseQRGeneratorReturn;
}

export const QRForm = ({ qrGenerator }: QRFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {
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
    logoPreview,
    outputFormat,
    setOutputFormat,
    qrColor,
    setQrColor,
    loading,
    handleLogoChange,
    generateQRCode,
  } = qrGenerator;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-lg shadow-md transition-colors">
      <div className="space-y-4">
        {/* Tipo de QR */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
          <button
            onClick={() => setType("url")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex-1 sm:flex-none justify-center ${
              type === "url"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Link className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>URL</span>
          </button>
          <button
            onClick={() => setType("whatsapp")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex-1 sm:flex-none justify-center ${
              type === "whatsapp"
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setType("wifi")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex-1 sm:flex-none justify-center ${
              type === "wifi"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Wifi className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>WiFi</span>
          </button>
          <button
            onClick={() => setType("text")}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex-1 sm:flex-none justify-center ${
              type === "text"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{t("form.text")}</span>
          </button>
        </div>

        {/* Campos según el tipo */}
        {type === "text" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("form.textLabel")}
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5 z-10 pointer-events-none" />
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={t("form.textPlaceholder")}
                  className="pl-9 sm:pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border"
                  rows={4}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("form.textHint")}
              </p>
            </div>
          </>
        ) : type === "wifi" ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.wifiSSID")}
                </label>
                <div className="relative">
                  <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5 z-10 pointer-events-none" />
                  <input
                    type="text"
                    value={wifiSSID}
                    onChange={(e) => setWifiSSID(e.target.value)}
                    placeholder={t("form.wifiSSIDPlaceholder")}
                    className="pl-9 sm:pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.wifiPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder={t("form.wifiPasswordPlaceholder")}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 pr-10 text-sm sm:text-base border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    aria-label={showPassword ? t("form.hidePassword") : t("form.showPassword")}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.wifiSecurity")}
                </label>
                <select
                  value={wifiSecurity}
                  onChange={(e) => setWifiSecurity(e.target.value as WiFiSecurity)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Sin contraseña</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="wifiHidden"
                  checked={wifiHidden}
                  onChange={(e) => setWifiHidden(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="wifiHidden"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {t("form.wifiHidden")}
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {type === "url" ? t("form.urlLabel") : t("form.whatsappLabel")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                {type === "url" ? (
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5 z-10 pointer-events-none" />
                ) : (
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 sm:h-5 sm:w-5 z-10 pointer-events-none" />
                )}
                <input
                  type={type === "url" ? "url" : "tel"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    type === "url" ? t("form.urlPlaceholder") : t("form.whatsappPlaceholder")
                  }
                  className="pl-9 sm:pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border relative"
                  style={{
                    isolation: "isolate",
                    contain: "layout style paint",
                  }}
                />
              </div>
            </div>

            {/* Campo de mensaje para WhatsApp */}
            {type === "whatsapp" && (
              <div className="mt-4 isolate">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("form.whatsappMessage")}
                </label>
                <textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder={t("form.whatsappMessagePlaceholder")}
                  className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 border text-sm sm:text-base"
                  rows={3}
                  style={{
                    isolation: "isolate",
                    contain: "layout style paint",
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* Slider de tamaño */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("form.sizeLabel")}
          </label>
          <div
            className="relative"
            onDragStart={(e) => e.preventDefault()}
            onDrag={(e) => e.preventDefault()}
            onDragEnd={(e) => e.preventDefault()}
          >
            <input
              type="range"
              min={QR_CONFIG.MIN_SIZE}
              max={QR_CONFIG.MAX_SIZE}
              step={QR_CONFIG.STEP_SIZE}
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onDragStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              draggable="false"
              className="w-full h-5 bg-transparent cursor-pointer slider select-none"
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("form.lowQuality")}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {qrSize} x {qrSize} Px
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("form.highQuality")}</span>
          </div>
        </div>

        {/* Opción de logo */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="enableLogo"
              checked={enableLogo}
              onChange={(e) => {
                setEnableLogo(e.target.checked);
                if (!e.target.checked) {
                  qrGenerator.setLogoFile(null);
                  qrGenerator.setLogoPreview("");
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="enableLogo"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer"
            >
              <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {t("form.enableLogo")}
            </label>
          </div>

          {enableLogo && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.selectLogo")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("form.logoFormats")}
                </p>
              </div>

              {logoPreview && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("form.logoPreview")}
                  </p>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Preview del logo"
                      className="max-w-[100px] max-h-[100px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selector de color */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("form.colorLabel")}
          </label>
          <div className="flex items-center gap-3 isolate">
            <input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
              style={{
                isolation: "isolate",
                willChange: "auto",
              }}
            />
            <input
              type="text"
              value={qrColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setQrColor(value);
                }
              }}
              placeholder="#000000"
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border font-mono"
              style={{
                isolation: "isolate",
                contain: "layout style paint",
              }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("form.colorHint")}
          </p>
        </div>

        {/* Selector de formato */}
        <div className="mt-6 isolate">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("form.formatLabel")}
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as "jpg" | "png" | "pdf" | "svg")}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border"
            style={{
              isolation: "isolate",
              contain: "layout style paint",
            }}
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
            <option value="svg">SVG</option>
          </select>
        </div>

        <div className="mt-4">
          <button
            onClick={generateQRCode}
            disabled={loading}
            className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base ${
              loading
                ? "bg-gray-400"
                : type === "url"
                ? "bg-blue-600 hover:bg-blue-700"
                : type === "whatsapp"
                ? "bg-green-600 hover:bg-green-700"
                : type === "wifi"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-orange-600 hover:bg-orange-700"
            } text-white rounded-md transition-colors disabled:cursor-not-allowed`}
          >
            {loading ? t("form.generating") : t("form.generateButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

