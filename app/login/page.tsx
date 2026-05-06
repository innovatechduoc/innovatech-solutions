"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Por favor ingresa un email válido");
        setLoading(false);
        return;
      }

      // Usamos la variable de entorno que apunta al puerto 3001
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      setSuccess("¡Autenticación exitosa!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("email", email);

      // Redirigir directamente al dashboard tras login exitoso
      router.push("/dashboard");
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-lg text-slate-900">
                  IT
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  InnovaTech
                </h1>
              </div>
              <p className="text-xl text-slate-300 font-light">
                Gestión Inteligente de Proyectos
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Zap, text: "Automatización de flujos de trabajo" },
                {
                  icon: CheckCircle2,
                  text: "Control total de recursos y tareas",
                },
                {
                  icon: Zap,
                  text: "Análisis en tiempo real de proyectos",
                },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Acceso seguro con autenticación de empresa
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl border border-slate-700/50">
              {/* Mobile Branding */}
              <div className="lg:hidden mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center font-bold text-slate-900">
                    IT
                  </div>
                  <h1 className="text-2xl font-bold text-white">InnovaTech</h1>
                </div>
                <p className="text-slate-400 text-sm">Gestión de Proyectos</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Bienvenido
                </h2>
                <p className="text-slate-400">
                  Inicia sesión en tu cuenta para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Message */}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-top">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-300">{success}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-200 mb-2.5"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="ejemplo@empresa.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-200 mb-2.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition disabled:opacity-50"
                      disabled={loading}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-slate-800 border border-slate-700 rounded checked:bg-blue-600 checked:border-blue-600 transition cursor-pointer"
                      disabled={loading}
                    />
                    <span className="text-slate-400 group-hover:text-slate-300 transition">
                      Recuérdame
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/50 disabled:shadow-none disabled:cursor-not-allowed mt-8"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                <p className="text-xs text-slate-500">
                  Plataforma segura · Encriptación de datos · Cumplimiento
                  normativo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
