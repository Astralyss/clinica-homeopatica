import "./globals.css";
import { Roboto } from 'next/font/google'
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { AuthProvider } from '@/utils/hooks/useAuth';
import { CarritoProvider } from '@/utils/context/CarritoContext';

export const metadata = {
  title: "Clínica Homeopática - Consultorio Homeopático Especializado en Pachuca, Hidalgo",
  keywords: [
    "clínica homeopática", 
    "consultorio homeopático", 
    "homeopatía", 
    "medicina natural", 
    "medicina alternativa", 
    "tienda homeopática", 
    "farmacia homeopática",
    "tratamiento homeopático",
    "medicina integral",
    "bienestar natural",
    "salud holística",
    "Pachuca",
    "Hidalgo",
    "medicina biológica",
    "herbolaria",
    "acupuntura",
    "naturismo",
    "medicina ortomolecular"
  ],
  authors: [{ name: "Clínica Homeopática" }],
  description: "Clínica homeopática especializada en Pachuca, Hidalgo. Consultorio homeopático con más de 20 años de experiencia en medicina natural, tratamientos integrales y tienda homeopática. Medicina alternativa para tu bienestar físico y emocional.",
  openGraph: {
    title: "Clínica Homeopática - Consultorio Homeopático Especializado",
    description: "Consultorio homeopático con más de 20 años de experiencia en medicina natural y tratamientos integrales. Tienda homeopática en Pachuca, Hidalgo.",
    type: "website",
    locale: "es_MX",
    siteName: "Clínica Homeopática",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínica Homeopática - Consultorio Homeopático Especializado",
    description: "Consultorio homeopático con más de 20 años de experiencia en medicina natural y tratamientos integrales.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://clinica-homeopatica.com",
  },
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
  variable: '--font-roboto', 
})

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={roboto.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "Clínica Homeopática",
              "alternateName": "Consultorio Homeopático",
              "description": "Consultorio homeopático especializado en medicina natural e integral con más de 20 años de experiencia en Pachuca, Hidalgo.",
              "url": "https://clinica-homeopatica.com",
              "telephone": "+52-771-712-9797",
              "email": "centrohomeopatico@yahoo.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plaza de las Américas local 15 módulo A",
                "addressLocality": "Pachuca",
                "addressRegion": "Hidalgo",
                "addressCountry": "MX"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 20.1006572,
                "longitude": -98.7535665
              },
              "openingHours": [
                "Mo-Fr 11:00-19:00",
                "Su 07:00-08:00"
              ],
              "medicalSpecialty": [
                "Homeopatía",
                "Medicina Natural",
                "Medicina Integral",
                "Herbolaria",
                "Acupuntura",
                "Naturismo",
                "Nutrición",
                "Medicina Ortomolecular",
                "Rehabilitación"
              ],
              "serviceType": [
                "Consulta médica homeopática",
                "Tratamiento homeopático personalizado",
                "Venta de productos homeopáticos",
                "Medicina natural",
                "Bienestar integral"
              ],
              "areaServed": [
                "Pachuca",
                "Hidalgo",
                "México"
              ],
              "foundingDate": "2004",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150"
              }
            })
          }}
        />
      </head>
      <body className={` antialiased`} >
        <AuthProvider>
          <CarritoProvider>
            <Navbar/>
            {children}
            <Footer />
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
