import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft, Copy, Check } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { useState } from "react";

export const Donations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{t("history.back")}</span>
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <Heart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("donations.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("donations.subtitle")}
            </p>
          </div>

          {/* Mensaje: no es necesario donar */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              {t("donations.notRequired")}
            </p>
          </div>

          {/* Mensaje humano */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
              👋 {t("donations.greeting")}
            </p>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-4">
              {t("donations.role")}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("donations.message")}
            </p>
          </div>

       

          {/* Métodos de donación */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("donations.methodsTitle")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Yape */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 w-full text-left">Yape</h3>
                <div className="mb-4 p-3 bg-white dark:bg-gray-700/50 rounded-xl shadow-inner">
                  <img
                    src="/QRyape.jpeg"
                    alt="QR Yape"
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 w-full text-left">
                  {t("donations.yapeNumber")}
                </p>
                <div className="flex items-center gap-2 w-full">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm truncate font-mono font-semibold text-gray-900 dark:text-white">
                    {t("donations.yapePlaceholder")}
                  </code>
                  <button
                    onClick={() => handleCopy(t("donations.yapePlaceholder"), "yape")}
                    className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 transition-colors"
                    title={t("history.copy")}
                  >
                    {copiedId === "yape" ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Plin */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 w-full text-left">Plin</h3>
                <div className="mb-4 p-3 bg-white dark:bg-gray-700/50 rounded-xl shadow-inner">
                  <img
                    src="/QRplin.jpeg"
                    alt="QR Plin"
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 w-full text-left">
                  {t("donations.plinNumber")}
                </p>
                <div className="flex items-center gap-2 w-full">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm truncate font-mono font-semibold text-gray-900 dark:text-white">
                    {t("donations.plinPlaceholder")}
                  </code>
                  <button
                    onClick={() => handleCopy(t("donations.plinPlaceholder"), "plin")}
                    className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 transition-colors"
                    title={t("history.copy")}
                  >
                    {copiedId === "plin" ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* PayPal */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:col-span-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">PayPal</h3>
                <a
                  href={t("donations.paypalLink")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg overflow-hidden transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  title={t("donations.paypalCta")}
                >
                  <img
                    src="/DonateWithPaypal.png"
                    alt={t("donations.paypalCta")}
                    className="h-12 sm:h-14 w-auto object-contain"
                  />
                </a>
              </div>

              {/* Binance Pay - ocupa todo el ancho */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 sm:col-span-2 w-full">
                <div className="flex flex-col items-center shrink-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 w-full text-left sm:text-center">
                    Binance Pay
                  </h3>
                  <div className="p-3 bg-white dark:bg-gray-700/50 rounded-xl shadow-inner">
                    <img
                      src="/qrBinancePay.jpeg"
                      alt="QR Binance Pay"
                      className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {t("donations.binancePayHint")}
                  </p>
                </div>
                <div className="flex-1 w-full sm:w-auto flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t("donations.binancePayIdLabel")}
                  </p>
                  <div className="flex items-center gap-2 w-full max-w-xs sm:max-w-none justify-center sm:justify-start">
                    <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-base font-mono font-semibold text-gray-900 dark:text-white">
                      835276198
                    </code>
                    <button
                      onClick={() => handleCopy("835276198", "binance")}
                      className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 transition-colors"
                      title={t("history.copy")}
                    >
                      {copiedId === "binance" ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transparencia */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t("donations.transparencyTitle")}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• {t("donations.transparency1")}</li>
              <li>• {t("donations.transparency2")}</li>
              <li>• {t("donations.transparency3")}</li>
            </ul>
          </div>

          {/* Gracias + CTA */}
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t("donations.thanks")}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("donations.backToGenerator")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
