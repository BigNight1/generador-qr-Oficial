import "dotenv/config";
import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import sharp from "sharp";

const app = express();

// Configurar CORS: permite localhost en desarrollo y el dominio de producción
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3000"
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.get('/api', (req, res) => {
  res.json({ message: 'API QR funcionando' });
});

const addLogoToSVG = async (svgString, logoDataURL, qrSize) => {
  const logoBuffer = Buffer.from(logoDataURL.split(',')[1], 'base64');
  
  const logoMetadata = await sharp(logoBuffer).metadata();
  const logoWidth = logoMetadata.width;
  const logoHeight = logoMetadata.height;
  
  const maxLogoSize = Math.floor(qrSize * 0.25);
  const padding = Math.floor(qrSize * 0.02);
  
  let newLogoWidth = maxLogoSize;
  let newLogoHeight = maxLogoSize;
  
  if (logoWidth > logoHeight) {
    newLogoHeight = Math.floor((maxLogoSize * logoHeight) / logoWidth);
  } else if (logoHeight > logoWidth) {
    newLogoWidth = Math.floor((maxLogoSize * logoWidth) / logoHeight);
  }
  
  // Redimensionar logo y convertirlo a base64
  const resizedLogo = await sharp(logoBuffer)
    .resize(newLogoWidth, newLogoHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  const logoBase64 = resizedLogo.toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;
  
  // Crear fondo blanco para el logo
  const backgroundWidth = newLogoWidth + (padding * 2);
  const backgroundHeight = newLogoHeight + (padding * 2);
  
  const whiteBackground = await sharp({
    create: {
      width: backgroundWidth,
      height: backgroundHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{
      input: resizedLogo,
      top: padding,
      left: padding
    }])
    .png()
    .toBuffer();
  
  const backgroundBase64 = whiteBackground.toString('base64');
  const backgroundDataUri = `data:image/png;base64,${backgroundBase64}`;
  
  // Calcular posición del logo en el centro del QR
  const logoX = (qrSize - backgroundWidth) / 2;
  const logoY = (qrSize - backgroundHeight) / 2;
  
  // Insertar el logo en el SVG
  const logoImageTag = `<image href="${backgroundDataUri}" x="${logoX}" y="${logoY}" width="${backgroundWidth}" height="${backgroundHeight}"/>`;
  
  // Insertar antes del cierre del tag <svg>
  const svgWithLogo = svgString.replace('</svg>', `${logoImageTag}</svg>`);
  
  return svgWithLogo;
};

const addLogoToQR = async (qrDataURL, logoDataURL, qrSize, format = 'png') => {
  const qrBuffer = Buffer.from(qrDataURL.split(',')[1], 'base64');
  const logoBuffer = Buffer.from(logoDataURL.split(',')[1], 'base64');
  
  const logoMetadata = await sharp(logoBuffer).metadata();
  const logoWidth = logoMetadata.width;
  const logoHeight = logoMetadata.height;
  
  const maxLogoSize = Math.floor(qrSize * 0.25);
  const padding = Math.floor(qrSize * 0.02);
  
  let newLogoWidth = maxLogoSize;
  let newLogoHeight = maxLogoSize;
  
  if (logoWidth > logoHeight) {
    newLogoHeight = Math.floor((maxLogoSize * logoHeight) / logoWidth);
  } else if (logoHeight > logoWidth) {
    newLogoWidth = Math.floor((maxLogoSize * logoWidth) / logoHeight);
  }
  
  const resizedLogo = await sharp(logoBuffer)
    .resize(newLogoWidth, newLogoHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  const backgroundWidth = newLogoWidth + (padding * 2);
  const backgroundHeight = newLogoHeight + (padding * 2);
  
  const whiteBackground = await sharp({
    create: {
      width: backgroundWidth,
      height: backgroundHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{
      input: resizedLogo,
      top: padding,
      left: padding
    }])
    .png()
    .toBuffer();
  
  const logoX = Math.floor((qrSize - backgroundWidth) / 2);
  const logoY = Math.floor((qrSize - backgroundHeight) / 2);
  
  let finalImage;
  let mimeType;
  
  if (format === 'jpg' || format === 'jpeg') {
    finalImage = await sharp(qrBuffer)
      .resize(qrSize, qrSize)
      .composite([{
        input: whiteBackground,
        top: logoY,
        left: logoX
      }])
      .jpeg({ quality: 90 })
      .toBuffer();
    mimeType = 'image/jpeg';
  } else if (format === 'pdf') {
    finalImage = await sharp(qrBuffer)
      .resize(qrSize, qrSize)
      .composite([{
        input: whiteBackground,
        top: logoY,
        left: logoX
      }])
      .png()
      .toBuffer();
    mimeType = 'image/png';
  } else {
    finalImage = await sharp(qrBuffer)
      .resize(qrSize, qrSize)
      .composite([{
        input: whiteBackground,
        top: logoY,
        left: logoX
      }])
      .png()
      .toBuffer();
    mimeType = 'image/png';
  }
  
  return `data:${mimeType};base64,${finalImage.toString('base64')}`;
};

const generateQRHandler = async (req, res) => {
  const { url, size = 148, logo, format = 'jpg', color = '#000000' } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL es requerida" });
  }

  try {
    let finalQRImage;
    
    // Si el formato es SVG, generar directamente como SVG
    if (format === 'svg') {
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: size,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: color,
          light: '#FFFFFF'
        }
      });
      
      if (logo) {
        try {
          const svgWithLogo = await addLogoToSVG(svgString, logo, size);
          finalQRImage = `data:image/svg+xml;base64,${Buffer.from(svgWithLogo).toString('base64')}`;
        } catch (logoError) {
          console.error("Error procesando logo en SVG:", logoError);
          finalQRImage = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
          return res.json({ 
            qrCode: finalQRImage, 
            size: size,
            warning: "No se pudo agregar el logo, se generó el QR sin logo"
          });
        }
      } else {
        finalQRImage = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
      }
    } else {
      // Para otros formatos (PNG, JPG, PDF), usar el método anterior
      const qrCodeImage = await QRCode.toDataURL(url, {
        width: size,
        height: size,
        margin: 1,
        errorCorrectionLevel: 'H',
        type: 'image/png',
        color: {
          dark: color,
          light: '#FFFFFF'
        }
      });
      
      finalQRImage = qrCodeImage;
      
      if (logo) {
        try {
          finalQRImage = await addLogoToQR(qrCodeImage, logo, size, format);
        } catch (logoError) {
          console.error("Error procesando logo:", logoError);
          return res.json({ 
            qrCode: qrCodeImage, 
            size: size,
            warning: "No se pudo agregar el logo, se generó el QR sin logo"
          });
        }
      } else {
        if (format === 'jpg' || format === 'jpeg') {
          const qrBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
          const jpgBuffer = await sharp(qrBuffer).jpeg({ quality: 90 }).toBuffer();
          finalQRImage = `data:image/jpeg;base64,${jpgBuffer.toString('base64')}`;
        } else if (format === 'pdf') {
          finalQRImage = qrCodeImage;
        }
      }
    }
    
    res.json({ qrCode: finalQRImage, size: size });
  } catch (error) {
    console.error("Error generando el QR:", error);
    res.status(500).json({ error: "Error generando el código QR" });
  }
};

app.post("/api/generate-qr", (generateQRHandler));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

export default app; 