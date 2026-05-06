"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FolderKanban,
  Plus,
  Search,
  Target,
  TrendingUp,
  Trash2,
  X,
} from "lucide-react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

interface Project {
  _id?: string;
  nombre: string;
  cliente: string;
  estado: string;
  progress?: number;
  fechaInicio: string;
}

export default function ProyectosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    estado: "Planificación",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");
    router.push("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const API_URL =
    process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL ||
    "http://localhost:4000/api/projects";

  const normalizeStatus = (status: string) => {
    if (status === "Completado") return "Finalizado";
    if (status === "En Tiempo" || status === "Riesgo Leve") {
      return "En Progreso";
    }
    if (
      status === "Planificación" ||
      status === "En Progreso" ||
      status === "Finalizado"
    ) {
      return status;
    }
    return "Planificación";
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

  const fetchProyectos = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error de conexión al Gateway:", error);
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
      const res = await fetch(API_URL, {
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

        await fetch("/api/notificaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "project",
            title: "Nuevo proyecto creado",
            message: `Proyecto '${formData.nombre}' fue creado para ${formData.cliente}.`,
            metadata: {
              nombre: formData.nombre,
              cliente: formData.cliente,
              estado: formData.estado,
              fechaInicio: formData.fechaInicio,
            },
          }),
        });

        setIsLoading(true);
        fetchProyectos();
      } else {
        alert("Error al crear el proyecto en la Base de Datos.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proyecto?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProyectos();
      } else {
        alert("Error al eliminar el proyecto.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const pName = project.nombre || "";
    const pClient = project.cliente || "";
    const pStatus = normalizeStatus(project.estado || "Planificación");
    const matchesSearch =
      pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pClient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "Todos" || pStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (normalizeStatus(status)) {
      case "Finalizado":
        return { bg: "bg-emerald-50", badge: "bg-emerald-100" };
      case "En Progreso":
        return { bg: "bg-blue-50", badge: "bg-blue-100" };
      case "Planificación":
      default:
        return { bg: "bg-slate-50", badge: "bg-slate-100" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (normalizeStatus(status)) {
      case "Finalizado":
        return <CheckCircle2 className="w-4 h-4" />;
      case "En Progreso":
        return <Clock className="w-4 h-4" />;
      case "Planificación":
      default:
        return <Target className="w-4 h-4" />;
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
      <Sidebar
        activeModule="proyectos"
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          profilePhoto={profilePhoto}
          onLogout={handleLogout}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
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
              {["Todos", "Planificación", "En Progreso", "Finalizado"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"}`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar proyectos o clientes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                />
              </div>
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

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 px-4">
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
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cliente
                </label>
                <input
                  required
                  value={formData.cliente}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaInicio: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: normalizeStatus(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Planificación</option>
                  <option>En Progreso</option>
                  <option>Finalizado</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
