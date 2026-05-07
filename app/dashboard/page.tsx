"use client"; // Obligatorio para usar Hooks en Next.js App Router

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  ChevronRight,
  FolderKanban,
  Search,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function InnovatechDashboard() {
  const router = useRouter();
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [resourceCapacity, setResourceCapacity] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");
    router.push("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Elimina la versión antigua que usa variables de entorno o localhost:4000
        // y déjala simplemente así:
        const PROJECT_API_URL = "/api/proyectos";

        const [resProyectos, resRecursos] = await Promise.all([
          fetch(PROJECT_API_URL, { cache: "no-store" }),
          fetch("/api/recursos").catch(() => null),
        ]);

        const dataProyectos = resProyectos.ok ? await resProyectos.json() : [];
        const dataRecursos =
          resRecursos && resRecursos.ok ? await resRecursos.json() : [];

        setActiveProjects(Array.isArray(dataProyectos) ? dataProyectos : []);
        setResourceCapacity(Array.isArray(dataRecursos) ? dataRecursos : []);
      } catch (error) {
        console.error(
          "Error al conectar con la base de datos o el Gateway:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const kpis = [
    {
      label: "Índice de Desempeño",
      value: "92%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Proyectos Activos",
      value: activeProjects.length.toString(),
      icon: FolderKanban,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Recursos Totales",
      value: resourceCapacity.length.toString(),
      icon: UsersRound,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Horas Registradas",
      value: "1,240h",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Cargando módulos de Innovatech...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        activeModule="dashboard"
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          profilePhoto={profilePhoto}
          onLogout={handleLogout}
          searchContent={
            <>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar proyectos, recursos o clientes..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
              />
            </>
          }
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Visión General Organizacional
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Monitoreo en tiempo real de indicadores clave para la toma de
                decisiones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
                >
                  <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
                    <kpi.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {kpi.label}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {kpi.value}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <FolderKanban size={18} className="text-blue-500" />
                    Estado de Proyectos
                  </h3>
                  <Link
                    href="/proyectos"
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                  >
                    Ver Tablero Completo
                    <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="p-5 flex-1">
                  <div className="space-y-4">
                    {activeProjects.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No hay proyectos registrados en la base de datos.
                      </p>
                    ) : (
                      activeProjects.map((project: any) => (
                        <div
                          key={project._id}
                          className="p-4 border border-slate-100 rounded-lg hover:border-blue-100 hover:bg-blue-50/50 transition"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs font-mono text-slate-400">
                                ID: {project._id.slice(-5).toUpperCase()}
                              </span>
                              <h4 className="font-semibold text-slate-800">
                                {project.nombre || project.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {project.cliente} •{" "}
                                {project.equipo?.length || 0} profesionales
                                asignados
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                project.estado === "Completado" ||
                                project.estado === "Finalizado"
                                  ? "bg-green-100 text-green-700"
                                  : project.estado === "En Progreso"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {project.estado || "Pendiente"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <UsersRound size={18} className="text-indigo-500" />
                    Recursos Registrados
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Disponibilidad de equipos multidisciplinarios.
                  </p>
                </div>
                <div className="p-5 flex-1">
                  <div className="space-y-4">
                    {resourceCapacity.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No hay recursos en la base de datos local.
                      </p>
                    ) : (
                      resourceCapacity.map((resource: any) => (
                        <div
                          key={resource._id}
                          className="p-3 border border-slate-100 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {resource.nombre}
                              </p>
                              <p className="text-xs text-slate-500">
                                {resource.especialidad}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                              {resource.horasSemanales}h / sem
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <button className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                      Gestionar Asignaciones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
