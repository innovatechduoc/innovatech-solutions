"use client"; // Obligatorio para usar Hooks en Next.js App Router

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  BarChart3,
  Search,
  Bell,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function InnovatechDashboard() {
  // 1. Estados para almacenar los datos reales de Mongo
  const [activeProjects, setActiveProjects] = useState([]);
  const [resourceCapacity, setResourceCapacity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch a tus API Routes (BFF)
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Llamamos al Project Service y Resource Service
        const [resProyectos, resRecursos] = await Promise.all([
          fetch("/api/proyectos"),
          fetch("/api/recursos"),
        ]);

        const dataProyectos = await resProyectos.json();
        const dataRecursos = await resRecursos.json();

        setActiveProjects(dataProyectos);
        setResourceCapacity(dataRecursos);
      } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    cargarDatos();
  }, []);

  // 3. KPIs Dinámicos calculados en base a la BD
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
        Cargando módulos de Innovatech...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar (Sin cambios) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              I
            </div>
            <h1 className="text-xl font-bold tracking-tight">Innovatech</h1>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck size={12} className="text-green-400" /> JWT Auth Active
          </p>
        </div>

        <div className="px-4 py-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Módulos Principales
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-lg transition"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard Central</span>
          </a>
          <Link
            href="/proyectos"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition"
          >
            <FolderKanban size={20} />
            <span className="font-medium">Gestión de Proyectos</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition"
          >
            <UsersRound size={20} />
            <span className="font-medium">Recursos y Capacidad</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition"
          >
            <BarChart3 size={20} />
            <span className="font-medium">Analítica y KPIs</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Sin cambios) */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar proyectos, recursos o clientes..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
              DR
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
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

            {/* Modulo 3: Analítica */}
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
              {/* Modulo 1: Gestión de Proyectos */}
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
                              {/* Asegúrate de que las propiedades coincidan con tu modelo Mongoose (ej: project.nombre) */}
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
                                project.estado === "Completado"
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

              {/* Modulo 2: Gestión de Recursos */}
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
                        No hay recursos en la base de datos.
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
