'use client';

import React, { useState } from 'react';
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
  Bell
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: 'Planificación' | 'En Progreso' | 'En Tiempo' | 'Riesgo Leve' | 'Completado';
  progress: number;
  startDate: string;
  endDate: string;
  teamSize: number;
  budget: number;
  spent: number;
  location: string;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
}

export default function ProyectosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Datos simulados de proyectos
  const projects: Project[] = [
    {
      id: 'PRJ-001',
      name: 'Migración Fintech Cloud',
      client: 'Banco Innovador S.A.',
      description: 'Migración completa de sistemas legacy a infraestructura cloud',
      status: 'En Tiempo',
      progress: 75,
      startDate: '2026-01-15',
      endDate: '2026-06-30',
      teamSize: 8,
      budget: 250000,
      spent: 187500,
      location: 'Ciudad de México',
      priority: 'Crítica'
    },
    {
      id: 'PRJ-002',
      name: 'App Retail Omnicanal',
      client: 'Retail Global Inc.',
      description: 'Plataforma de e-commerce integrada con tiendas físicas',
      status: 'Riesgo Leve',
      progress: 40,
      startDate: '2026-02-01',
      endDate: '2026-08-31',
      teamSize: 12,
      budget: 380000,
      spent: 152000,
      location: 'Guadalajara',
      priority: 'Alta'
    },
    {
      id: 'PRJ-003',
      name: 'Plataforma Gestión Pública',
      client: 'Gobierno del Estado',
      description: 'Sistema integral de gestión administrativa para dependencias públicas',
      status: 'Planificación',
      progress: 15,
      startDate: '2026-04-01',
      endDate: '2026-12-31',
      teamSize: 5,
      budget: 420000,
      spent: 63000,
      location: 'Monterrey',
      priority: 'Alta'
    },
    {
      id: 'PRJ-004',
      name: 'Transformación Digital Manufactura',
      client: 'Industrias Mexicanas Ltd.',
      description: 'Implementación de IoT y análisis de datos en línea de producción',
      status: 'En Progreso',
      progress: 55,
      startDate: '2025-11-01',
      endDate: '2026-07-15',
      teamSize: 6,
      budget: 310000,
      spent: 170500,
      location: 'Querétaro',
      priority: 'Media'
    },
    {
      id: 'PRJ-005',
      name: 'Plataforma de Telehealth',
      client: 'Grupo Médico Nacional',
      description: 'Solución de telemedicina con integración de IA diagnóstica',
      status: 'En Tiempo',
      progress: 82,
      startDate: '2025-09-15',
      endDate: '2026-05-30',
      teamSize: 7,
      budget: 280000,
      spent: 229600,
      location: 'Bogotá',
      priority: 'Crítica'
    },
    {
      id: 'PRJ-006',
      name: 'Analytics Dashboard Empresarial',
      client: 'Consultoría Global Corp.',
      description: 'Dashboard de inteligencia de negocios con datos en tiempo real',
      status: 'Completado',
      progress: 100,
      startDate: '2025-08-01',
      endDate: '2026-03-15',
      teamSize: 4,
      budget: 195000,
      spent: 195000,
      location: 'Santiago',
      priority: 'Media'
    }
  ];

  // Funciones de filtrado
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Función para obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100' };
      case 'En Tiempo':
        return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' };
      case 'En Progreso':
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', badge: 'bg-indigo-100' };
      case 'Riesgo Leve':
        return { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100' };
      case 'Planificación':
        return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100' };
    }
  };

  // Función para obtener icono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'En Tiempo':
        return <TrendingUp className="w-4 h-4" />;
      case 'Riesgo Leve':
        return <AlertCircle className="w-4 h-4" />;
      case 'En Progreso':
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  // Función para obtener color de prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return 'bg-red-100 text-red-700';
      case 'Alta':
        return 'bg-orange-100 text-orange-700';
      case 'Media':
        return 'bg-yellow-100 text-yellow-700';
      case 'Baja':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Función para calcular porcentaje de presupuesto
  const getBudgetPercentage = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">I</div>
            <h1 className="text-xl font-bold tracking-tight">Innovatech</h1>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck size={12} className="text-green-400"/> JWT Auth Active
          </p>
        </div>
        
        <div className="px-4 py-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Módulos Principales
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          <Link href="/" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <LayoutDashboard size={20} /> 
            <span className="font-medium">Dashboard Central</span>
          </Link>
          <a href="#" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-lg transition">
            <FolderKanban size={20} /> 
            <span className="font-medium">Gestión de Proyectos</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <UsersRound size={20} /> 
            <span className="font-medium">Recursos y Capacidad</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <BarChart3 size={20} /> 
            <span className="font-medium">Analítica y KPIs</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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

        {/* Proyectos Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Gestión de Proyectos</h1>
                  <p className="text-sm text-slate-600 mt-1">Administra y monitorea todos tus proyectos</p>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-5 h-5" />
                Nuevo Proyecto
              </button>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, cliente o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700">Filtros</span>
              </button>
            </div>

            {/* Tabs de estado */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Todos', 'Planificación', 'En Progreso', 'En Tiempo', 'Riesgo Leve', 'Completado'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Proyectos List */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No se encontraron proyectos con los criterios de búsqueda</p>
              </div>
            ) : (
              <div className="grid gap-6 mb-12">
                {filteredProjects.map(project => {
                  const statusColors = getStatusColor(project.status);
                  const budgetPercentage = getBudgetPercentage(project.spent, project.budget);
                  
                  return (
                    <div
                      key={project.id}
                      className={`${statusColors.bg} border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow`}
                    >
                      <div className="p-6">
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors.badge}`}>
                                {getStatusIcon(project.status)}
                                {project.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{project.id} • {project.client}</p>
                            <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                          </div>
                          <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Progreso</span>
                            <span className="text-sm font-semibold text-slate-900">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-300 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                              <Users className="w-4 h-4" />
                              <span>Equipo</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{project.teamSize}</p>
                          </div>

                          <div className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                              <Calendar className="w-4 h-4" />
                              <span>Finalización</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{new Date(project.endDate).toLocaleDateString('es-ES')}</p>
                          </div>

                          <div className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                              <MapPin className="w-4 h-4" />
                              <span>Ubicación</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{project.location}</p>
                          </div>

                          <div className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Presupuesto</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{budgetPercentage}% utilizado</p>
                          </div>
                        </div>

                        {/* Budget Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-700">Presupuesto</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-slate-300 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${budgetPercentage > 90 ? 'bg-red-600' : budgetPercentage > 75 ? 'bg-amber-600' : 'bg-emerald-600'}`}
                              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 border-opacity-50">
                          <button className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-white rounded transition-colors text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-white rounded transition-colors text-sm font-medium">
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium">
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

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total de Proyectos</p>
                    <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                  </div>
                  <FolderKanban className="w-12 h-12 text-blue-600 opacity-10" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">En Progreso</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {projects.filter(p => p.status === 'En Progreso' || p.status === 'En Tiempo').length}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-amber-600 opacity-10" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Completados</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {projects.filter(p => p.status === 'Completado').length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 opacity-10" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Presupuesto Total</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${(projects.reduce((acc, p) => acc + p.budget, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-emerald-600 opacity-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
