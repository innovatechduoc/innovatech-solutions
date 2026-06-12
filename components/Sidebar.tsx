"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  LineChart, // <-- Ícono para Analíticas
  BookOpen, // <-- Ícono para Swagger
  ShieldCheck,
  X,
} from "lucide-react";

// 1. Ampliamos el tipo para que TypeScript acepte las nuevas páginas
type ActiveModule =
  | "dashboard"
  | "proyectos"
  | "resource"
  | "analytics"
  | "swagger";

interface SidebarProps {
  activeModule: ActiveModule;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export default function Sidebar({
  activeModule,
  isMobileMenuOpen,
  onCloseMobileMenu,
}: SidebarProps) {
  // 2. Evaluamos los estados activos de todas las rutas
  const dashboardActive = activeModule === "dashboard";
  const projectsActive = activeModule === "proyectos";
  const resourceActive = activeModule === "resource";
  const analyticsActive = activeModule === "analytics";
  const swaggerActive = activeModule === "swagger";

  // 3. Agregamos las nuevas páginas al mapa de navegación
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard Central",
      icon: LayoutDashboard,
      active: dashboardActive,
    },
    {
      href: "/proyectos",
      label: "Gestión de Proyectos",
      icon: FolderKanban,
      active: projectsActive,
    },
    {
      href: "/resource",
      label: "Recursos y Capacidad",
      icon: UsersRound,
      active: resourceActive,
    },
    {
      href: "/kpi",
      label: "KPIs y Analíticas",
      icon: LineChart,
      active: analyticsActive,
    },
    {
      href: "/api-docs",
      label: "API Docs (Swagger)",
      icon: BookOpen,
      active: swaggerActive,
    },
  ];

  const desktopSidebar = (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 min-h-screen">
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
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.href === "#") {
            return (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  item.active
                    ? "bg-blue-600/10 text-blue-400"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                item.active
                  ? "bg-blue-600/10 text-blue-400"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  if (!isMobileMenuOpen) {
    return desktopSidebar;
  }

  return (
    <>
      {desktopSidebar}
      <div className="fixed inset-0 z-40 md:hidden">
        <button
          type="button"
          aria-label="Cerrar menú"
          className="absolute inset-0 bg-slate-950/50"
          onClick={onCloseMobileMenu}
        />
        <aside className="absolute left-0 top-0 h-full w-[82vw] max-w-xs bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                  I
                </div>
                <h1 className="text-xl font-bold tracking-tight">Innovatech</h1>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ShieldCheck size={12} className="text-green-400" /> JWT Auth
                Active
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú lateral"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              onClick={onCloseMobileMenu}
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-4 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Módulos Principales
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.href === "#") {
                return (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      item.active
                        ? "bg-blue-600/10 text-blue-400"
                        : "hover:bg-slate-800 hover:text-white"
                    }`}
                    onClick={onCloseMobileMenu}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    item.active
                      ? "bg-blue-600/10 text-blue-400"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={onCloseMobileMenu}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}
