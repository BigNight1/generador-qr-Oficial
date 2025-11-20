import { useTranslation } from "react-i18next";
import { Code2, Shield, Zap, Github, Linkedin, Facebook, FacebookIcon } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-gray-200 dark:border-gray-700 pt-8 sm:pt-10 pb-6 sm:pb-8 transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-10 mb-6 sm:mb-8">
        <div className="max-w-md">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {t("header.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {t("footer.description")}
          </p>
        </div>

        <div className="md:ml-auto">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t("footer.features")}
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>{t("footer.free")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <span>{t("footer.instant")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{t("footer.unlimited")}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <span>{t("footer.madeBy")}</span>
              <span className="font-semibold text-gray-900 dark:text-white">Edu Armas</span>
              <div className="flex items-center gap-3 ml-2">
                <a
                  href="https://github.com/BigNight1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="GitHub de Edu Armas"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/edu-armas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="LinkedIn de Edu Armas"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61558087662014"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Facebook BigNight"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

