"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  UsersRound,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Ajusta estas rutas según dónde estén tus componentes en tu proyecto
import Sidebar from "../../components/Sidebar"; // o "../../components/Sidebar"
import Header from "../../components/Header";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para las métricas reales
  const [metrics, setMetrics] = useState({
    totalEmpleados: 0,
    empleadosActivos: 0,
    totalProyectos: 0,
    proyectosEnProgreso: 0,
    proyectosFinalizados: 0,
    proyectosPlanificacion: 0,
  });

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

    // Cargar foto de perfil para el Header
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

  useEffect(() => {
    // Cargar datos reales de los endpoints para calcular KPIs
    async function fetchAnalyticsData() {
      setIsLoading(true);
      try {
        const [resProyectos, resRecursos] = await Promise.all([
          fetch("/api/proyectos").catch(() => null),
          fetch("/api/recursos").catch(() => null),
        ]);

        const proyectos =
          resProyectos && resProyectos.ok ? await resProyectos.json() : [];
        const recursos =
          resRecursos && resRecursos.ok ? await resRecursos.json() : [];

        // Procesamiento matemático de KPIs
        const arrProyectos = Array.isArray(proyectos) ? proyectos : [];
        const arrRecursos = Array.isArray(recursos) ? recursos : [];

        const activos = arrRecursos.filter(
          (r: any) => r.estado === "Activo" || !r.estado,
        ).length;

        const enProgreso = arrProyectos.filter(
          (p: any) =>
            p.estado === "En Progreso" || p.estado === "En Desarrollo",
        ).length;

        const finalizados = arrProyectos.filter(
          (p: any) => p.estado === "Finalizado" || p.estado === "Completado",
        ).length;

        const planificacion = arrProyectos.filter(
          (p: any) =>
            p.estado === "Planificación" ||
            p.estado === "Pendiente" ||
            !p.estado,
        ).length;

        setMetrics({
          totalEmpleados: arrRecursos.length,
          empleadosActivos: activos,
          totalProyectos: arrProyectos.length,
          proyectosEnProgreso: enProgreso,
          proyectosFinalizados: finalizados,
          proyectosPlanificacion: planificacion,
        });
      } catch (error) {
        console.error("Error al calcular analíticas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalyticsData();
  }, []);

  // Cálculos de porcentajes seguros (evitando división por cero)
  const progresoGlobal =
    metrics.totalProyectos > 0
      ? Math.round(
          (metrics.proyectosFinalizados / metrics.totalProyectos) * 100,
        )
      : 0;

  const capacidadOperativa =
    metrics.totalEmpleados > 0
      ? Math.round((metrics.empleadosActivos / metrics.totalEmpleados) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      <Sidebar
        activeModule="analytics" // Esto hace que el menú brille en la opción correcta
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          profilePhoto={profilePhoto}
          onLogout={handleLogout}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium">
                Calculando métricas de inteligencia de negocios...
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              <header>
                <h1 className="text-3xl font-bold text-slate-900">
                  Dashboard de KPIs
                </h1>
                <p className="text-slate-500 mt-2">
                  Análisis de rendimiento, carga operativa y estado de proyectos
                  en tiempo real.
                </p>
              </header>

              {/* Tarjetas Superiores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FolderKanban size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">
                      Proyectos Totales
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {metrics.totalProyectos}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">
                      Tasa de Éxito
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {progresoGlobal}%
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <UsersRound size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">
                      Fuerza Laboral
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-800">
                      {metrics.empleadosActivos}
                    </p>
                    <span className="text-sm text-slate-500">
                      / {metrics.totalEmpleados}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-500">
                      Carga Activa
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {metrics.proyectosEnProgreso}
                  </p>
                </div>
              </div>

              {/* Gráficos de Barras (Hechos con Tailwind) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribución de Proyectos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-6">
                    Salud del Portafolio
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-600">
                          Finalizados
                        </span>
                        <span className="text-emerald-600 font-bold">
                          {metrics.proyectosFinalizados}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${metrics.totalProyectos ? (metrics.proyectosFinalizados / metrics.totalProyectos) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-600">
                          En Progreso
                        </span>
                        <span className="text-blue-600 font-bold">
                          {metrics.proyectosEnProgreso}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${metrics.totalProyectos ? (metrics.proyectosEnProgreso / metrics.totalProyectos) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-600">
                          En Planificación
                        </span>
                        <span className="text-amber-500 font-bold">
                          {metrics.proyectosPlanificacion}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className="bg-amber-400 h-2.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${metrics.totalProyectos ? (metrics.proyectosPlanificacion / metrics.totalProyectos) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacidad Operativa */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                  <h2 className="text-lg font-bold text-slate-800 mb-6">
                    Análisis de Capacidad (RRHH)
                  </h2>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      {/* Círculo simulado con CSS puro */}
                      <svg
                        viewBox="0 0 36 36"
                        className="w-full h-full transform -rotate-90"
                      >
                        <path
                          className="text-slate-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.8"
                        />
                        <path
                          className="text-indigo-600 transition-all duration-1000"
                          strokeDasharray={`${capacidadOperativa}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.8"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-3xl font-extrabold text-slate-800">
                          {capacidadOperativa}%
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          Disponibles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-indigo-600 mt-0.5" size={18} />
                    <p className="text-sm text-indigo-900">
                      <strong>Diagnóstico del Sistema:</strong> Actualmente
                      cuentas con {metrics.empleadosActivos} recursos activos
                      para manejar {metrics.proyectosEnProgreso} proyectos en
                      progreso.
                      {capacidadOperativa > 80
                        ? " La capacidad es óptima."
                        : " Considera contratar más personal si ingresan nuevos proyectos."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
