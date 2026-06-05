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
  Trash2,
  Users,
  X,
} from "lucide-react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// 1. Actualizamos interfaces para incluir Recursos y el Equipo poblado
interface Recurso {
  _id: string;
  nombre: string;
  especialidad: string;
}

interface Project {
  _id?: string;
  nombre: string;
  cliente: string;
  estado: string;
  progress?: number;
  fechaInicio: string;
  equipo?: Recurso[]; // Viene poblado desde el backend
}

export default function ProyectosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]); // Estado para los recursos
  // Estado para saber qué proyecto estamos viendo en el modal de detalles
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Agregamos 'equipo' al estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    estado: "Planificación",
    fechaInicio: new Date().toISOString().split("T")[0],
    equipo: [] as string[], // Guardará los IDs de los seleccionados
  });
  // Función mágica para cruzar IDs con los datos reales
  const obtenerDetallesEquipo = (equipoIds: any[]) => {
    if (!equipoIds || !Array.isArray(equipoIds)) return [];
    
    return equipoIds
      .map((id) => recursos.find((r) => r._id === id)) // Busca el empleado por ID
      .filter(Boolean); // Elimina los que no encuentre (undefined)
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");
    router.push("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const API_URL = "/api/proyectos";
  const RECURSOS_API_URL = "/api/recursos";

  const normalizeStatus = (status: string) => {
    if (status === "Completado") return "Finalizado";
    if (status === "En Tiempo" || status === "Riesgo Leve")
      return "En Progreso";
    if (
      status === "Planificación" ||
      status === "En Progreso" ||
      status === "Finalizado"
    ) {
      return status;
    }
    return "Planificación";
  };

  // Función para calcular progreso automático
  const calcularProgreso = (estado: string) => {
    const estadoNormalizado = normalizeStatus(estado);
    if (estadoNormalizado === "Planificación") return 0;
    if (estadoNormalizado === "En Progreso") return 50;
    if (estadoNormalizado === "Finalizado") return 100;
    return 0;
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

  // Obtenemos Proyectos y Recursos simultáneamente
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resProyectos, resRecursos] = await Promise.all([
        fetch(API_URL, { cache: "no-store" }),
        fetch(RECURSOS_API_URL, { cache: "no-store" }),
      ]);

      if (resProyectos.ok) {
        const dataP = await resProyectos.json();
        setProjects(Array.isArray(dataP) ? dataP : []);
      }

      if (resRecursos.ok) {
        const dataR = await resRecursos.json();
        setRecursos(Array.isArray(dataR) ? dataR : []);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Lógica de exclusividad: Calculamos qué recursos ya están asignados
  const recursosAsignadosIds = new Set(
    projects.flatMap((p) => p.equipo?.map((emp) => emp._id) || []),
  );

  // Filtramos para mostrar solo los disponibles
  const recursosDisponibles = recursos.filter(
    (r) => !recursosAsignadosIds.has(r._id),
  );

  // Manejo de selección múltiple de recursos en el modal
  const toggleRecurso = (id: string) => {
    setFormData((prev) => {
      const yaSeleccionado = prev.equipo.includes(id);
      return {
        ...prev,
        equipo: yaSeleccionado
          ? prev.equipo.filter((eId) => eId !== id) // Lo quita
          : [...prev.equipo, id], // Lo agrega
      };
    });
  };

  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();

    // Inyectamos el progreso automático antes de enviar
    const progresoCalculado = calcularProgreso(formData.estado);
    const payload = {
      ...formData,
      progress: progresoCalculado,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowNewProjectModal(false);
        setFormData({
          nombre: "",
          cliente: "",
          estado: "Planificación",
          fechaInicio: new Date().toISOString().split("T")[0],
          equipo: [],
        });

        // Recargamos todo para actualizar disponibilidades
        fetchData();
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
        fetchData(); // Recarga para liberar los recursos
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
          <p className="font-medium">Cargando datos desde MongoDB...</p>
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
                  const estadoNormalizado = normalizeStatus(project.estado);
                  const progresoReal = estadoNormalizado === "Finalizado" ? 100 : (project.progress || 0);
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
                            <p className="text-sm text-slate-600 mb-1">
                              Cliente: {project.cliente}
                            </p>

                            {/* Mostrar el equipo asignado en la tarjeta */}
                            {/* Mostrar cantidad de equipo asignado en la tarjeta */}
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-3 bg-white/50 w-fit px-3 py-1.5 rounded-md border border-slate-200">
                              <Users className="w-4 h-4 text-slate-400" />
                              {project.equipo && project.equipo.length > 0
                                ? `${project.equipo.length} integrante${project.equipo.length > 1 ? "s" : ""}`
                                : "Sin equipo asignado"}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">
                              Progreso Automático
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {progresoReal}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-300 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progresoReal}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 border-opacity-50">
                          <button
                            onClick={() => setProyectoSeleccionado(project)}
                            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded transition-colors text-sm font-medium"
                          >
                            <Search className="w-4 h-4" /> Ver Detalles
                          </button>
                          <button
                            onClick={() => handleEliminar(project._id!)}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Sección de asignación de recursos */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asignar Equipo (Disponibles: {recursosDisponibles.length})
                </label>
                {recursosDisponibles.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-200">
                    No hay empleados disponibles. Todos están asignados a otros
                    proyectos.
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 space-y-1">
                    {recursosDisponibles.map((recurso) => (
                      <label
                        key={recurso._id}
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                          formData.equipo.includes(recurso._id)
                            ? "bg-blue-100 border-blue-200 border"
                            : "hover:bg-slate-200 border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 mr-3"
                          checked={formData.equipo.includes(recurso._id)}
                          onChange={() => toggleRecurso(recurso._id)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {recurso.nombre}
                          </span>
                          <span className="text-xs text-slate-500">
                            {recurso.especialidad}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex gap-3 justify-end">
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
                  Crear y Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL DE VER DETALLES DEL PROYECTO */}
      {proyectoSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Detalles del Proyecto
              </h2>
              <button
                onClick={() => setProyectoSeleccionado(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Nombre</p>
                  <p className="text-lg font-semibold text-slate-900">{proyectoSeleccionado.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Cliente</p>
                  <p className="text-lg text-slate-900">{proyectoSeleccionado.cliente}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Estado</p>
                  <span className={`inline-flex px-2 py-1 mt-1 rounded-full text-xs font-semibold ${getStatusColor(proyectoSeleccionado.estado).badge}`}>
                    {proyectoSeleccionado.estado}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Fecha de Inicio</p>
                  <p className="text-base text-slate-900 mt-1">
                    {/* Nos aseguramos de formatear la fecha para que no se vea como texto de robot */}
                    {new Date(proyectoSeleccionado.fechaInicio).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* LISTA DEL EQUIPO */}
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">Equipo Asignado</p>
                {proyectoSeleccionado.equipo && proyectoSeleccionado.equipo.length > 0 ? (
                  <ul className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                    {/* 👇 AQUÍ ESTÁ EL CAMBIO CLAVE 👇 */}
                    {obtenerDetallesEquipo(proyectoSeleccionado.equipo).map((miembro: any) => (
                      <li key={miembro._id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                        <span className="font-medium text-slate-800">{miembro.nombre}</span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {miembro.especialidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 bg-slate-50 text-slate-500 rounded-lg text-sm border border-slate-200">
                    No hay personal asignado a este proyecto.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setProyectoSeleccionado(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
