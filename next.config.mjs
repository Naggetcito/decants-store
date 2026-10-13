/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sitio 100% estático: `next build` escribe la web completa en out/, que Netlify sirve tal cual.
  output: "export",
  // La exportación estática no incluye el optimizador de imágenes de Next (necesita un servidor).
  images: { unoptimized: true },
};

export default nextConfig;
