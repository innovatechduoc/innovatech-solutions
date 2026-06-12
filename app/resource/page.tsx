"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Plus, Users, X } from "lucide-react";

// 1. Interfaz alineada con el modelo Empleado de MongoDB
interface Recurso {
  _id?: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  email: string;
  horasSemanales: number;
  estado: "Activo" | "Inactivo";
}

export default function ResourcePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para el Modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para saber qué recurso estamos viendo en el modal de detalles
  const [recursoSeleccionado, setRecursoSeleccionado] =
    useState<Recurso | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    cargo: "",
    especialidad: "",
    email: "",
    horasSemanales: 40,
    estado: "Activo",
  });

  // URL local del API
  const RESOURCE_API_URL = "/api/recursos";

  // Extraemos la función de carga para poder re-usarla al crear un recurso
  const fetchRecursos = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(RESOURCE_API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Error fetching recursos");
      const data = await res.json();
      setRecursos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRecursos([]);
    } finally {
      setIsLoading(false);
    }
  }, [RESOURCE_API_URL]);

  useEffect(() => {
    fetchRecursos();
  }, [fetchRecursos]);

  // Función para enviar los datos al Backend
  const handleCrearRecurso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(RESOURCE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          horasSemanales: Number(formData.horasSemanales), // Asegurar que sea número
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          nombre: "",
          cargo: "",
          especialidad: "",
          email: "",
          horasSemanales: 40,
          estado: "Activo",
        });
        fetchRecursos(); // Recargamos la lista automáticamente
      } else {
        alert("Error al crear el recurso en la Base de Datos.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      <Sidebar
        activeModule="resource"
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          profilePhoto={profilePhoto}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            window.location.href = "/login";
          }}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-600" />
                <h1 className="text-2xl font-bold text-slate-900">
                  Recursos y Capacidad
                </h1>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" /> Nuevo Recurso
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full rounded-lg bg-white p-8 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Cargando...
                </div>
              ) : recursos.length === 0 ? (
                <div className="col-span-full rounded-lg bg-white p-8 text-center text-slate-500">
                  No hay recursos registrados. ¡Agrega el primero!
                </div>
              ) : (
                recursos.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {r.nombre}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                          {r.especialidad}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.estado === "Activo"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.estado}
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                        {r.horasSemanales} h / sem
                      </div>
                      {/* Cambia tu botón actual por este */}
                      <button
                        onClick={() => setRecursoSeleccionado(r)}
                        className="text-sm text-slate-400 hover:text-blue-600 transition"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL PARA CREAR RECURSO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Registrar Nuevo Recurso
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCrearRecurso} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Laura Méndez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Especialidad
                </label>
                <input
                  required
                  type="text"
                  value={formData.especialidad}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidad: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Desarrollador Backend"
                />
              </div>

              {/* INPUT PARA EL CARGO */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cargo
                </label>
                <input
                  required
                  type="text"
                  value={formData.cargo}
                  onChange={(e) =>
                    setFormData({ ...formData, cargo: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ingeniero de Software"
                />
              </div>

              {/* INPUT PARA EL EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: correo@empresa.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Horas Semanales
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="168"
                    value={formData.horasSemanales}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horasSemanales: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition"
                >
                  Guardar Recurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL DE VER DETALLES */}
      {recursoSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Detalles del Recurso
              </h2>
              <button
                onClick={() => setRecursoSeleccionado(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Nombre</p>
                <p className="text-lg font-semibold text-slate-900">
                  {recursoSeleccionado.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Cargo</p>
                <p className="text-base text-slate-900">
                  {recursoSeleccionado.cargo}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Especialidad
                </p>
                <p className="text-base text-slate-900">
                  {recursoSeleccionado.especialidad}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Correo Electrónico
                </p>
                <p className="text-base text-slate-900">
                  {recursoSeleccionado.email}
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Horas</p>
                  <p className="text-base text-slate-900">
                    {recursoSeleccionado.horasSemanales}h / sem
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Estado</p>
                  <span
                    className={`inline-flex px-2 py-1 mt-1 rounded-full text-xs font-semibold ${
                      recursoSeleccionado.estado === "Activo"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {recursoSeleccionado.estado || "Desconocido"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setRecursoSeleccionado(null)}
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
