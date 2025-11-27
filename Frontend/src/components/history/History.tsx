import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Code2, Download, Copy, Check } from "lucide-react";
import { getQRHistory, formatDate, clearQRHistory, type QRHistoryItem } from "../../utils/historyUtils";
import { downloadImage } from "../../utils/qrUtils";
import { useState, useEffect } from "react";
import type { OutputFormat } from "../../types";

export const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setHistory(getQRHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm(t("history.confirmClear"))) {
      clearQRHistory();
      setHistory([]);
    }
  };

  const handleDownload = async (image: string, format: OutputFormat, index: number) => {
    try {
      await downloadImage(image, `qrcode-${index + 1}`, format);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert(t("history.downloadError"));
    }
  };

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedIndex(index);
        setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);
      } catch (err) {
        console.error("Error al copiar:", err);
        alert(t("history.copyError"));
      }
      document.body.removeChild(textArea);
    }
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t("history.back")}</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t("history.title")}
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <Code2 className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                {t("history.empty")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t("history.back")}</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t("history.title")}
            </h1>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>{t("history.clear")}</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t("history.subtitle").replace("{{count}}", history.length.toString())}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Imagen del QR */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-center mb-2">
                  <img
                    src={item.image}
                    alt="QR Code"
                    className="w-full max-w-[200px] h-auto rounded"
                  />
                </div>
                {/* Tamaño debajo de la imagen */}
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {t("history.size")}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.size ? `${item.size} × ${item.size} px` : t("history.sizeUnknown")}
                  </p>
                </div>
              </div>

              {/* Información */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {t("history.url")}
                    </p>
                    <button
                      onClick={() => handleCopyUrl(item.url, index)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      title={t("history.copyUrl")}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>{t("history.copied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{t("history.copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white break-all line-clamp-2">
                    {item.url}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {t("history.format")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                      {item.format || "png"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {t("history.date")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>
                {/* Botón de descarga */}
                <button
                  onClick={() => handleDownload(item.image, (item.format || "png") as OutputFormat, index)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-md font-medium text-sm transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  <span>{t("history.download")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

