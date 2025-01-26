"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Maneja el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Enviar las credenciales al backend
      const res = await axios.post("/api/login", { email, password });

      if (res.status === 200) {
        const { redirect } = res.data; // Obtener la URL de redirección
        router.push(redirect); // Redirigir según el rol del usuario
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error al iniciar sesión. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de correo */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu correo"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Botón o Spinner */}
          <div>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Mostrar error si existe */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}