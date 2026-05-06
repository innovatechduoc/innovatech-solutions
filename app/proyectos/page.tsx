"use client";

import React, { useState, useEffect } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  DollarSign,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  ShieldCheck,
  LayoutDashboard,
  UsersRound,
  BarChart3,
  ChevronRight,
  Bell,
  X,
} from "lucide-react";
import Link from "next/link";

interface Project {
  _id?: string;
  id?: string;
  nombre: string;
  cliente: string;
  description?: string;
  estado: string;
  progress?: number;
  fechaInicio: string;
  endDate?: string;
  teamSize?: number;
  budget?: number;
  spent?: number;
  location?: string;
  priority?: string;
}

export default function ProyectosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Estados de carga y datos
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    estado: "Planificación",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

  const fetchProyectos = async () => {
    try {
      const res = await fetch("/api/proyectos", { cache: "no-store" });

      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowNewProjectModal(false);
        setFormData({
          nombre: "",
          cliente: "",
          estado: "Planificación",
          fechaInicio: new Date().toISOString().split("T")[0],
        });
        setIsLoading(true);
        fetchProyectos();
      } else {
        alert("Error al crear el proyecto.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  // Función para eliminar el proyecto
  const handleEliminar = async (id: string) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/proyectos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProyectos(); // Refrescamos la lista
      } else {
        alert("Error al eliminar el proyecto de la base de datos.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const pName = project.nombre || "";
    const pClient = project.cliente || "";
    const pStatus = project.estado || "Planificación";
    const matchesSearch =
      pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pClient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "Todos" || pStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          badge: "bg-emerald-100",
        };
      case "En Tiempo":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          badge: "bg-blue-100",
        };
      case "En Progreso":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          badge: "bg-indigo-100",
        };
      case "Riesgo Leve":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          badge: "bg-amber-100",
        };
      case "Planificación":
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          badge: "bg-slate-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          badge: "bg-gray-100",
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado":
        return <CheckCircle2 className="w-4 h-4" />;
      case "En Tiempo":
        return <TrendingUp className="w-4 h-4" />;
      case "Riesgo Leve":
        return <AlertCircle className="w-4 h-4" />;
      case "En Progreso":
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string = "Media") => {
    switch (priority) {
      case "Crítica":
        return "bg-red-100 text-red-700";
      case "Alta":
        return "bg-orange-100 text-orange-700";
      case "Media":
        return "bg-yellow-100 text-yellow-700";
      case "Baja":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Cargando proyectos desde MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      {/* Sidebar */}
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
        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard Central</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-lg transition"
          >
            <FolderKanban size={20} />
            <span className="font-medium">Gestión de Proyectos</span>
          </a>
          {/* ... resto de navegación */}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          {/* ... barra de búsqueda superior */}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">
                  Gestión de Proyectos
                </h1>
              </div>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" /> Nuevo Proyecto
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                "Todos",
                "Planificación",
                "En Progreso",
                "En Tiempo",
                "Riesgo Leve",
                "Completado",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"}`}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
                <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">
                  No se encontraron proyectos en la Base de Datos
                </p>
              </div>
            ) : (
              <div className="grid gap-6 mb-12">
                {filteredProjects.map((project) => {
                  const statusColors = getStatusColor(project.estado);
                  return (
                    <div
                      key={project._id}
                      className={`${statusColors.bg} border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">
                                {project.nombre}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors.badge}`}
                              >
                                {getStatusIcon(project.estado)} {project.estado}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">
                              Cliente: {project.cliente}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">
                              Progreso Estimado
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {project.progress || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-300 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* SECCIÓN DE ACCIONES: Botón Eliminar */}
                        <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 border-opacity-50">
                          <button
                            onClick={() => handleEliminar(project._id!)}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MODAL PARA CREAR PROYECTO --- */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Crear Nuevo Proyecto
              </h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCrearProyecto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre del Proyecto
                </label>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: App Móvil E-commerce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cliente
                </label>
                <input
                  required
                  type="text"
                  value={formData.cliente}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Empresa S.A."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planificación">Planificación</option>
                    <option value="En Progreso">En Progreso</option>
                    {/* CAMBIO AQUÍ: Finalizado en lugar de Completado */}
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>

                {/* NUEVO CAMPO OBLIGATORIO: Fecha de Inicio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
