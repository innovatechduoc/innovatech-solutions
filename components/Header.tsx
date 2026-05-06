"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, MoreVertical, User } from "lucide-react";

interface HeaderProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  profilePhoto?: string | null; // Ahora es opcional porque el Header puede buscarla solo
  onLogout: () => void;
  searchContent?: ReactNode;
}

export default function Header({
  setIsMobileMenuOpen,
  profilePhoto: propPhoto, // Renombramos la prop para no confundirla con el estado interno
  onLogout,
  searchContent,
}: HeaderProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [internalPhoto, setInternalPhoto] = useState<string | null>(null);

  // URL de tu API Gateway
  const PROFILE_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL
    ? `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/profile`
    : "http://localhost:4000/api/auth/profile";

  // Lógica para leer la foto de la BD de Mongo
  useEffect(() => {
    // Si ya recibimos una foto por props, la usamos
    if (propPhoto) {
      setInternalPhoto(propPhoto);
      return;
    }

    const email = localStorage.getItem("email");

    // 👇 DEFINIMOS LA FUNCIÓN PARA QUE RECIBA EL EMAIL DIRECTAMENTE
    async function fetchHeaderPhoto(userEmail: string) {
      try {
        const res = await fetch(
          `${PROFILE_ENDPOINT}?email=${encodeURIComponent(userEmail)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.profilePhoto) {
            setInternalPhoto(data.profilePhoto);
          }
        }
      } catch (err) {
        console.error("Error al cargar la foto en el Header:", err);
      }
    }

    // 👇 SOLO LA EJECUTAMOS SI EL EMAIL EXISTE
    if (email) {
      fetchHeaderPhoto(email);
    }
  }, [propPhoto, PROFILE_ENDPOINT]);

  // Manejo de teclado para el modal
  useEffect(() => {
    if (!showLogoutModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLogoutModal(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showLogoutModal]);

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
            className="md:hidden p-2 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MoreVertical size={20} />
          </button>
          {searchContent && (
            <div className="relative w-full max-w-[20rem] md:w-96 hidden md:block">
              {searchContent}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 transition hover:border-blue-400 shadow-sm"
          >
            {internalPhoto ? (
              <img
                src={internalPhoto}
                alt="Perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-600">
                <User size={20} />
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Modal de Cierre de Sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <LogOut size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ¿Cerrar sesión?
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Vas a salir de la sesión actual. Tendrás que volver a
                    iniciar sesión para acceder.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20"
                >
                  Confirmar cierre de sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
