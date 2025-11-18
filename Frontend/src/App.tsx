import { useState } from "react";
import {
  Code2,
  Link,
  MessageCircle,
  Info,
  HelpCircle,
  Zap,
  Shield,
  Mail,
  Github,
  Linkedin,
  Image as ImageIcon,
  Globe,
  User,
} from "lucide-react";

function App() {
  const [url, setUrl] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("url"); // 'url' o 'whatsapp'
  const [qrSize, setQrSize] = useState(500); // Tamaño del QR (200-2000)
  const [selectedSize, setSelectedSize] = useState(500); // Tamaño seleccionado para mostrar
  const [enableLogo, setEnableLogo] = useState(false); // Activar/desactivar logo
  const [logoFile, setLogoFile] = useState<File | null>(null); // Archivo del logo
  const [logoPreview, setLogoPreview] = useState<string>(""); // Preview del logo
  const [outputFormat, setOutputFormat] = useState<"jpg" | "png" | "pdf">("jpg"); // Formato de salida
  const [qrColor, setQrColor] = useState("#000000"); // Color del QR
  const [language, setLanguage] = useState("es"); // Idioma seleccionado

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar selección de logo
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido");
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("El logo no debe superar los 10MB");
        return;
      }

      setLogoFile(file);
      
      // Crear preview
      const base64 = await fileToBase64(file);
      setLogoPreview(base64);
    }
  };

  const generateQRCode = async () => {
    if (!url) return;

    // Validar que si el logo está habilitado, haya un archivo seleccionado
    if (enableLogo && !logoFile) {
      alert("Por favor, selecciona un logo para agregar al QR");
      return;
    }

    setLoading(true);

    let finalUrl = url;
    if (type === "whatsapp") {
      const cleanNumber = url.replace(/[^\d]/g, "");
      const encodedMessage = encodeURIComponent(whatsappMessage);
      finalUrl = `https://wa.me/${cleanNumber}${
        whatsappMessage ? `?text=${encodedMessage}` : ""
      }`;
    }

    try {
      // Convertir logo a base64 si está habilitado y hay archivo
      let logoBase64 = null;
      if (enableLogo && logoFile) {
        logoBase64 = await fileToBase64(logoFile);
      }

      const response = await fetch(
        "http://localhost:3800/api/generate-qr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            url: finalUrl, 
            size: qrSize,
            logo: logoBase64,
            format: outputFormat,
            color: qrColor
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQrCodeImage(data.qrCode);
        setSelectedSize(data.size || qrSize);
        if (data.warning) {
          alert(data.warning);
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al generar el QR:", error);
      alert("Hubo un problema al generar el código QR");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeImage) return;

    const extension = outputFormat === "jpg" ? "jpg" : outputFormat === "png" ? "png" : "pdf";
    const a = document.createElement("a");
    a.href = qrCodeImage;
    a.download = `qrcode.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoginClick = () => {
    alert("Muy pronto");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Generador QR</span>
            </div>

            {/* Right side - Language and Login */}
            <div className="flex items-center gap-4">
              {/* Selector de idioma */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="pt">🇵🇹 Português</option>
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Botón de inicio de sesión */}
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 flex items-center justify-center gap-2 flex-wrap">
            <Code2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600" />
            <span className="whitespace-nowrap">Generador de Código QR</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Genera códigos QR para URLs o WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              {/* Tipo de QR */}
              <div className="flex gap-2 sm:gap-4 mb-4">
                <button
                  onClick={() => setType("url")}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base flex-1 sm:flex-none justify-center ${
                    type === "url"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
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
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                {type === "url" ? "URL de la página" : "Número de WhatsApp"}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {type === "url" ? (
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  <input
                    type={type === "url" ? "url" : "tel"}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      type === "url" ? "https://ejemplo.com" : "51999999999"
                    }
                    className="pl-9 sm:pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border"
                  />
                </div>
              </div>

              {/* Campo de mensaje para WhatsApp */}
              {type === "whatsapp" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="Escribe un mensaje que se enviará automáticamente..."
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 border text-sm sm:text-base"
                    rows={3}
                  />
                </div>
              )}

              {/* Slider de tamaño */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tamaño del código QR
                </label>
                <div 
                  className="relative"
                  onDragStart={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDragEnd={(e) => e.preventDefault()}
                >
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="25"
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
                    className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer slider select-none"
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">Baja calidad</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {qrSize} x {qrSize} Px
                  </span>
                  <span className="text-xs text-gray-500">Alta calidad</span>
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
                        setLogoFile(null);
                        setLogoPreview("");
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="enableLogo"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    Agregar logo al centro del QR
                  </label>
                </div>

                {enableLogo && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Formatos: PNG, JPG, GIF. Máximo 10MB
                      </p>
                    </div>

                    {logoPreview && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Vista previa del logo:
                        </p>
                        <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-center">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color del código QR
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
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
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border font-mono"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Usa el selector de color o escribe el código hexadecimal
                </p>
              </div>

              {/* Selector de formato */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de salida
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as "jpg" | "png" | "pdf")}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 sm:p-2.5 text-sm sm:text-base border"
                >
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="pdf">PDF</option>
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
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-md transition-colors disabled:cursor-not-allowed`}
                >
                  {loading ? "Generando..." : "Generar QR"}
                </button>
              </div>
            </div>
          </div>

          {/* QR Display Section */}
          <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Código QR Generado
              </h3>
            </div>
            {qrCodeImage ? (
              <div className="text-center">
                <img
                  src={qrCodeImage}
                  alt="Código QR"
                  className="mx-auto my-4 w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[250px] h-auto"
                />
                <p className="text-sm text-gray-600 mb-4">
                  Tamaño: <span className="font-semibold">{selectedSize} x {selectedSize} px</span>
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  Descargar QR
                </button>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto w-full max-w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                  <Code2 className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Código QR
                  </p>
                  <p className="text-xs text-gray-400">
                    Aparecerá aquí
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Configura las opciones y presiona "Generar QR"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          {/* Qué es un código QR */}
          <section className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Info className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                ¿Qué es un código QR?
              </h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Un código QR (Quick Response) es un código de barras bidimensional
              que puede almacenar información como URLs, números de teléfono,
              mensajes de texto y más. Los códigos QR son escaneados fácilmente
              con la cámara de cualquier smartphone, lo que los hace ideales
              para compartir información de forma rápida y sin contacto.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Nuestra herramienta te permite generar códigos QR de forma
              gratuita, sin necesidad de registro y sin límites. Puedes crear
              códigos QR para enlaces web o para iniciar conversaciones de
              WhatsApp con un mensaje predefinido.
            </p>
          </section>

          {/* Cómo usar */}
          <section className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                ¿Cómo usar esta herramienta?
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Selecciona el tipo de QR
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Elige entre generar un código QR para una URL o para
                    WhatsApp. Si eliges WhatsApp, podrás agregar un mensaje que
                    se enviará automáticamente al escanear el código.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Ingresa la información
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Escribe la URL completa (por ejemplo: https://ejemplo.com) o
                    el número de WhatsApp con código de país (por ejemplo:
                    51999999999 para Perú).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Genera y descarga
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Haz clic en "Generar QR" y espera unos segundos. Una vez
                    generado, podrás descargar el código QR en formato PNG para
                    usarlo en tus materiales impresos o digitales.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Casos de uso */}
          <section className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Casos de uso
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Marketing y Publicidad
                </h3>
                <p className="text-gray-700 text-sm">
                  Comparte enlaces a tus productos, promociones o páginas web en
                  folletos, carteles y materiales publicitarios.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Redes Sociales
                </h3>
                <p className="text-gray-700 text-sm">
                  Facilita que tus seguidores accedan a tu perfil de WhatsApp o
                  a tu sitio web desde tus publicaciones.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tarjetas de Presentación
                </h3>
                <p className="text-gray-700 text-sm">
                  Agrega un código QR a tu tarjeta de presentación para que los
                  contactos accedan fácilmente a tu información.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Menús de Restaurantes
                </h3>
                <p className="text-gray-700 text-sm">
                  Proporciona acceso rápido a menús digitales o sistemas de
                  pedidos online mediante códigos QR en las mesas.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Eventos</h3>
                <p className="text-gray-700 text-sm">
                  Comparte información de eventos, formularios de registro o
                  grupos de WhatsApp para participantes.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Soporte al Cliente
                </h3>
                <p className="text-gray-700 text-sm">
                  Ofrece un canal directo de comunicación con WhatsApp para que
                  los clientes contacten fácilmente.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 lg:mt-20 border-t border-gray-200 pt-8 sm:pt-10 pb-6 sm:pb-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-10 mb-6 sm:mb-8">
            <div className="max-w-md">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-600" />
                Generador QR
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Herramienta gratuita para generar códigos QR de forma rápida y
                sencilla. Sin registro, sin límites, sin complicaciones.
              </p>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-semibold text-gray-900 mb-3">
                Características
              </h4>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>100% Gratis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <span>Generación instantánea</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>Sin límites de uso</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <div className="flex justify-center ">
              <div className="flex  items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span>Hecho por</span>
                  <span className="font-semibold text-gray-900">Edu Armas</span>
                  <div className="flex items-center gap-3 ml-2">
                    <a
                      href="https://github.com/BigNight1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="GitHub de Edu Armas"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/edu-armas/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      aria-label="LinkedIn de Edu Armas"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
