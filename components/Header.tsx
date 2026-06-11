"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  FolderKanban,
  LogOut,
  MoreVertical,
  UserPlus,
} from "lucide-react";

interface HeaderProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  profilePhoto: string | null;
  onLogout: () => void;
  searchContent?: ReactNode;
}

type NotificationItem = {
  _id?: string;
  title: string;
  message: string;
  type?: "project" | "employee" | "system";
  createdAt?: string;
  isRead?: boolean;
};

export default function Header({
  setIsMobileMenuOpen,
  profilePhoto,
  onLogout,
  searchContent,
}: HeaderProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // 👇 1. NUEVO ESTADO PARA LAS INICIALES
  const [userInitials, setUserInitials] = useState("US"); // "US" por defecto (Usuario)

  // 👇 2. NUEVA FUNCIÓN PARA EXTRAER INICIALES DEL CORREO
  const getInitials = (email: string | null) => {
    if (!email) return "US";
    let s = email.trim();
    if (s.includes("@")) {
      s = s.split("@")[0].replace(/[._]/g, " "); // "juan.perez@..." -> "juan perez"
    }
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "US";
    // Tomamos la primera letra de las dos primeras palabras
    return parts
      .map((p) => p[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const unreadNotifications = notifications.filter((item) => !item.isRead);
  const unreadCount = unreadNotifications.length;

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const response = await fetch("/api/notificaciones?limit=5", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las notificaciones");
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch("/api/notificaciones", {
        method: "PATCH",
      });
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const openNotifications = async () => {
    setShowNotifications(true);
    await fetchNotifications();
  };

  const closeNotifications = async () => {
    setShowNotifications(false);
    if (unreadCount > 0) {
      await markNotificationsAsRead();
    }
  };

  // 👇 3. EFECTO PARA LEER EL LOCALSTORAGE
  useEffect(() => {
    // Leemos el correo de la sesión actual
    const storedEmail = localStorage.getItem("email");
    // Calculamos y guardamos las iniciales
    setUserInitials(getInitials(storedEmail));
  }, []);

  useEffect(() => {
    if (!showLogoutModal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowLogoutModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showLogoutModal]);

  useEffect(() => {
    if (!showNotifications) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        void closeNotifications();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        void closeNotifications();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
      markNotificationsAsRead();
    }
  }, [showNotifications]);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none">
          <button
            type="button"
            aria-label="Abrir menú lateral"
            className="md:hidden p-2 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MoreVertical size={20} />
          </button>
          {searchContent ? (
            <div className="relative w-full max-w-[20rem] md:w-96 hidden md:block">
              {searchContent}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              aria-label="Abrir notificaciones"
              aria-expanded={showNotifications}
              className="relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              onClick={() => {
                if (showNotifications) {
                  void closeNotifications();
                } else {
                  void openNotifications();
                }
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            {showNotifications ? (
              <div className="absolute right-0 top-full z-50 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Notificaciones
                    </h3>
                    <p className="text-xs text-slate-500">
                      Actividad reciente del sistema
                    </p>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      {unreadCount} nuevas
                    </span>
                  ) : null}
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {isLoadingNotifications ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      Cargando notificaciones...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No hay notificaciones.
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const iconTone =
                        item.type === "employee"
                          ? "bg-emerald-50 text-emerald-600"
                          : item.type === "project"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-slate-100 text-slate-600";
                      const Icon =
                        item.type === "employee"
                          ? UserPlus
                          : item.type === "project"
                            ? FolderKanban
                            : ChevronRight;

                      return (
                        <div
                          key={item._id || `${item.title}-${item.createdAt}`}
                          className={`flex gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50 ${item.isRead ? "opacity-70" : ""}`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconTone}`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-slate-100 px-5 py-3">
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <Link
            href="/profile"
            aria-label="Ir al perfil"
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-blue-200 text-sm font-bold transition hover:border-blue-400"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-700">
                {/* 👇 4. AQUÍ USAMOS LA VARIABLE EN LUGAR DE "DR" */}
                {userInitials}
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Cerrar sesión"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {showLogoutModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-label="Cerrar modal de cierre de sesión"
            onClick={() => setShowLogoutModal(false)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/70">
                  <LogOut size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-900">
                    ¿Cerrar sesión?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Vas a salir de la sesión actual. Tendrás que volver a
                    iniciar sesión para acceder al dashboard y a los proyectos.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Tu trabajo no se cerrará, pero perderás el acceso temporal a tu
                sesión actual.
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Confirmar cierre de sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
