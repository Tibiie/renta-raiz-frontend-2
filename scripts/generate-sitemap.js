// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");

const BASE_URL = "https://rentaraiz.co";
const API_URL = `${BASE_URL}/api/v1`;

// ======== Encriptar token (igual que interceptor Angular) ==========
const getEncryptedToken = () => {
  return CryptoJS.AES.encrypt(
    "APP_PORTAL_RENTA_Wm1SaFptbGhhR1pyYUd4aGJHUm0=_YmYyZjMzNjAtMzcwMC00ZDJlLTgyNTktOTI5MzhlN2FhOGM1",
    CryptoJS.enc.Utf8.parse("T0FIUlRBQkNTV0E="),
    {
      iv: CryptoJS.enc.Utf8.parse("VUJTUldLRE1BWQ=="),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString();
};

// ======== Obtener inmuebles desde el backend ==========
const getInmuebles = async () => {
  try {
    const encryptedToken = getEncryptedToken();

    const response = await fetch(
      `${API_URL}/properties/inmuebles?page=0&size=1000`,
      {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    
    return data || []; // porque es pageable
  } catch (err) {
    console.error("❌ Error cargando inmuebles:", err);
    return [];
  }
};

// ======== Generar XML del sitemap ==========
const buildSitemap = async () => {
  const baseUrl = "https://rentaraiz.co"; // dominio de producción
  const inmuebles = await getInmuebles();

  const urls = [
    `${baseUrl}/`, // home
    `${baseUrl}/filtros`,
    `${baseUrl}/contacto`,
    `${baseUrl}/nuestro-equipo`,
    `${baseUrl}/quienes-somos`,
    `${baseUrl}/mapa`,
    `${baseUrl}/blogs`,
    `${baseUrl}/publicar-inmueble`,
    `${baseUrl}/politicas-de-privacidad`,
    `${baseUrl}/avaluos-comerciales`,
    ...inmuebles.map(
      (inmueble) => `${baseUrl}/ver-propiedad/${inmueble.codpro}/0`
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const outDir = path.join(__dirname, "../dist/renta-raiz-frontend-2");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, "sitemap.xml");
  fs.writeFileSync(outPath, sitemap, "utf8");

  console.log(`✅ Sitemap generado en: ${outPath}`);
};

// Ejecutar
buildSitemap();
