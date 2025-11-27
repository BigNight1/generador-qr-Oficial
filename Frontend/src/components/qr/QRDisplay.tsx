import { useTranslation } from "react-i18next";
import { Code2, Download, CheckCircle2, Sparkles } from "lucide-react";
import type { UseQRGeneratorReturn } from "../../hooks/useQRGenerator";

interface QRDisplayProps {
  qrGenerator: UseQRGeneratorReturn;
}

export const QRDisplay = ({ qrGenerator }: QRDisplayProps) => {
  const { t } = useTranslation();
  const { qrCodeImage, selectedSize, handleDownloadQR, outputFormat } = qrGenerator;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-6 rounded-lg shadow-lg transition-colors border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {t("qr.title")}
          </h3>
        </div>
        
      </div>
      {qrCodeImage ? (
        <div className="flex flex-col items-center justify-center">
          {/* Contenedor del QR con borde elegante */}
          <div className="relative mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-inner border-2 border-gray-200 dark:border-gray-600">
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg animate-pulse">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white dark:bg-white p-3 rounded-lg shadow-md">
              <img
                src={qrCodeImage}
                alt="Código QR"
                className="w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] h-auto rounded transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* Información del QR */}
          <div className="w-full mb-6 space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {t("qr.size")}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {selectedSize} × {selectedSize} px
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {t("qr.format")}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">
                  {outputFormat}
                </span>
              </div>
            </div>
          </div>

          {/* Botón de descarga mejorado */}
          <button
            onClick={handleDownloadQR}
            className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
            <span>{t("qr.download")}</span>
          </button>

          {/* Tip adicional */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center max-w-xs">
            {t("qr.tip")}
          </p>
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="mx-auto w-full max-w-[240px] h-[240px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 relative overflow-hidden">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                  <Code2 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold mb-2">
                {t("qr.placeholder")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {t("qr.placeholderText")}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 px-4">
            {t("qr.instructions")}
          </p>
        </div>
      )}
    </div>
  );
};

