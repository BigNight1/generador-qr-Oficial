import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/layout/Hero";
import { QRForm } from "./components/qr/QRForm";
import { QRDisplay } from "./components/qr/QRDisplay";
import { WhatIsQR } from "./components/sections/WhatIsQR";
import { HowToUse } from "./components/sections/HowToUse";
import { UseCases } from "./components/sections/UseCases";
import { ComingSoonModal } from "./components/common/ComingSoonModal";
import { History } from "./components/history/History";
import { useQRGenerator } from "./hooks/useQRGenerator";

function Home() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const qrGenerator = useQRGenerator();

  const handleLoginClick = () => {
    setShowComingSoonModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <Hero />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <QRForm qrGenerator={qrGenerator} />
            <QRDisplay qrGenerator={qrGenerator} />
          </div>

          {/* Información adicional */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <WhatIsQR />
            <HowToUse />
            <UseCases />
          </div>

          <Footer />
        </div>

        <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} />
      </div>
    </>
  );
}

function App() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleLoginClick = () => {
    setShowComingSoonModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onLoginClick={handleLoginClick} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>

      <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} />
    </div>
  );
}

export default App;
