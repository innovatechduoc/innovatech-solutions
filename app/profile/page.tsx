"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Briefcase,
  Activity,
  Clock,
  ArrowLeft,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

interface Empleado {
  _id: string;
  nombre: string;
  cargo: string;
  email: string;
  especialidad: string;
  horasSemanales?: number;
  proyectosAsignados?: string[];
}

interface UsuarioData {
  email?: string;
  rol?: string;
  empleadoId?: string | null;
}

function getInitialsFromNameOrEmail(input?: string) {
  if (!input) return "";
  let s = input.trim();
  if (s.includes("@")) {
    s = s.split("@")[0];
    s = s.replace(/[._]/g, " ");
  }
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const initials = parts.map((p) => p[0].toUpperCase()).join("");
  return initials;
}

function getDisplayName(input?: string) {
  if (!input) return "Usuario";
  const trimmed = input.trim();
  if (!trimmed) return "Usuario";

  if (trimmed.includes("@")) {
    const localPart = trimmed.split("@")[0].replace(/[._]/g, " ");
    return localPart
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  return trimmed;
}

export default function ProfilePage() {
  const router = useRouter();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const AUTH_API_URL =
    process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
    "http://localhost:4000/api/auth";
  const PROFILE_ENDPOINT = `${AUTH_API_URL}/profile`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      router.replace("/login");
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(PROFILE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.error || "No se pudo obtener perfil");
        }

        const data = await res.json();
        setUsuario(data.usuario || null);
        setEmpleado(data.empleado || null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router, PROFILE_ENDPOINT]);

  useEffect(() => {
    const email =
      usuario?.email || empleado?.email || localStorage.getItem("email") || "";
    if (!email) return;

    async function fetchProfilePhoto() {
      try {
        const res = await fetch(
          `${PROFILE_ENDPOINT}?email=${encodeURIComponent(email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setProfilePhoto(data.profilePhoto || null);
        }
      } catch (err) {
        console.error("Error fetching profile photo:", err);
      }
    }

    fetchProfilePhoto();
  }, [usuario?.email, empleado?.email, PROFILE_ENDPOINT]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    const email =
      usuario?.email || empleado?.email || localStorage.getItem("email");
    if (!email) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;

      try {
        const res = await fetch(PROFILE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, profilePhoto: result }),
        });

        if (res.ok) {
          setProfilePhoto(result);
          setError("");
        } else {
          setError("Error al guardar la foto");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar la foto");
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_45%,_#eef2ff_100%)] text-slate-500 px-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/80 px-8 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="h-12 w-12 animate-pulse rounded-full bg-blue-100 text-blue-600 grid place-items-center">
            <User className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-slate-800">
              Cargando perfil
            </p>
            <p className="text-sm text-slate-500">
              Preparando tu información personal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_45%,_#eef2ff_100%)] p-6">
        <div className="max-w-lg w-full rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BadgeCheck className="h-7 w-7" />
          </div>
          <p className="mt-5 text-lg font-semibold text-slate-900">
            No se pudo cargar el perfil
          </p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_35%,_#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Perfil de usuario
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.10),rgba(255,255,255,0)_35%,rgba(99,102,241,0.08))]" />
          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-10">
            <aside className="flex flex-col items-center rounded-[1.75rem] border border-slate-100 bg-slate-950 px-6 py-8 text-center text-white shadow-lg shadow-slate-900/10">
              <div className="relative">
                <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-4xl font-black tracking-tight text-white shadow-[0_20px_50px_rgba(59,130,246,0.35)]">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Foto de perfil personalizada"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitialsFromNameOrEmail(
                      empleado?.nombre || usuario?.email,
                    ) || <User className="h-14 w-14" />
                  )}
                </div>

                <label
                  htmlFor="profile-photo-input"
                  className="absolute -bottom-1 right-1 inline-flex cursor-pointer items-center rounded-full border border-white/20 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-slate-800"
                >
                  Foto
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="mt-6 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Cuenta activa
                </div>
                <h1 className="text-2xl font-semibold text-white">
                  {getDisplayName(empleado?.nombre || usuario?.email)}
                </h1>
                <p className="text-sm text-slate-300">
                  {empleado?.cargo || "Sin cargo asignado"}
                </p>
                <p className="text-sm text-slate-400">
                  {empleado?.especialidad || "Sin especialidad registrada"}
                </p>
              </div>

              <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Rol
                  </span>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {usuario?.rol || localStorage.getItem("rol") || "Usuario"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {usuario?.email || empleado?.email || "Sin email disponible"}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Puedes subir una imagen y se guardará en este dispositivo.
                </p>
              </div>
            </aside>

            <div className="flex flex-col justify-between gap-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Email
                      </p>
                      <p className="mt-1 break-all text-sm font-medium text-slate-800">
                        {usuario?.email || empleado?.email}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Proyectos
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {empleado?.proyectosAsignados?.length || 0} asignados
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Jornada
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {empleado?.horasSemanales || 40}h semanales
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Resumen
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">
                        Información del perfil
                      </h2>
                    </div>
                    <Activity className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Miembro desde
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Estado
                      </p>
                      <p className="mt-2 text-sm font-medium text-emerald-600">
                        Activo y disponible
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-slate-950 p-6 text-white shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Actividad
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">Reciente</h2>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">
                      No hay actividad reciente disponible.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
