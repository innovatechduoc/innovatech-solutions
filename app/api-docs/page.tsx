"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "swagger-ui-react/swagger-ui.css";

// IMPORTANTE: Asegúrate de que la ruta a tus componentes sea la correcta.
// Como este archivo está en app/api-docs/page.tsx, normalmente es con "../"
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Cargamos el componente de forma dinámica para evitar errores en el servidor
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");
    router.push("/login");
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    async function fetchProfilePhoto(userEmail: string) {
      try {
        const res = await fetch(
          `/api/profile?email=${encodeURIComponent(userEmail)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setProfilePhoto(data.profilePhoto || null);
        }
      } catch (err) {
        console.error("Error fetching profile photo:", err);
      }
    }
    fetchProfilePhoto(email);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      {/* Tu menú lateral con el estado 'swagger' iluminado */}
      <Sidebar
        activeModule="swagger"
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Tu cabecera superior */}
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          profilePhoto={profilePhoto}
          onLogout={handleLogout}
        />

        {/* Contenedor principal con scroll independiente */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Cabecera de la tarjeta */}
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h1 className="text-2xl font-bold text-slate-800">
                Documentación API
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Interfaz interactiva de Swagger para el testeo de endpoints
                Serverless.
              </p>
            </div>

            {/* Contenedor del Swagger UI */}
            <div className="p-4">
              <SwaggerUI url="/swagger.json" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
