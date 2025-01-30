"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useGlobalState } from "@/context/GlobalStateContext"; // Importamos el contexto

// Interfaz para tipar los datos del usuario
interface User {
  id: number;
  name: string;
  email: string;
  role: string | object;
  permisosSolicitudes?: {
    verNoValidas: boolean;
    verValidarEntrega: boolean;
    verEntregadas: boolean;
  };
  permisosReportes?: {
    reportesFinancieros: boolean;
    reportesSolicitudes: boolean;
  };
}

// Interfaz para el formulario de usuario
interface FormData {
  id?: number; // Permite número o undefined
  name: string;
  email: string;
  password: string;
  role: string; // Se asegura de que siempre sea string
  permisosSolicitudes?: {
    verNoValidas: boolean;
    verValidarEntrega: boolean;
    verEntregadas: boolean;
  };
  permisosReportes?: {
    reportesFinancieros: boolean;
    reportesSolicitudes: boolean;
  };
}

// Lista de roles disponibles
const roles = ["SUPERUSUARIO", "COORDINACION", "FUNDESURG", "SOLICITANTE"];

export default function UserComponent() {
  const { users, fetchUsers } = useGlobalState(); // Consumimos el contexto

  // Estado del formulario de usuario
  const [formData, setFormData] = useState<FormData>({
    id: undefined,
    name: "",
    email: "",
    password: "",
    role: roles[3], // Predeterminado: "SOLICITANTE"
    permisosSolicitudes: {
      verNoValidas: false,
      verValidarEntrega: false,
      verEntregadas: false,
    },
    permisosReportes: {
      reportesFinancieros: false,
      reportesSolicitudes: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      const [category, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category as keyof FormData] as Record<string, boolean>),
          [field]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejar la creación o actualización del usuario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && formData.id) {
        await fetch(`/api/users?id=${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      fetchUsers(); // Recargar la lista de usuarios
      resetForm();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la edición de un usuario
  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: String(user.role), // Convertir a string en caso de ser objeto
      permisosSolicitudes: user.permisosSolicitudes ?? {
        verNoValidas: false,
        verValidarEntrega: false,
        verEntregadas: false,
      },
      permisosReportes: user.permisosReportes ?? {
        reportesFinancieros: false,
        reportesSolicitudes: false,
      },
    });
    setIsEditing(true);
  };

  // Manejar la eliminación de un usuario
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await fetch(`/api/users?id=${id}`, { method: "DELETE" });
        fetchUsers(); // Recargar lista después de eliminar
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  // Resetear el formulario después de enviar
  const resetForm = () => {
    setFormData({
      id: undefined,
      name: "",
      email: "",
      password: "",
      role: roles[3], // Predeterminado: "SOLICITANTE"
      permisosSolicitudes: {
        verNoValidas: false,
        verValidarEntrega: false,
        verEntregadas: false,
      },
      permisosReportes: {
        reportesFinancieros: false,
        reportesSolicitudes: false,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
    <h1 className="text-center text-3xl font-semibold mb-6 text-gray-800">Gestión de Usuarios</h1>

    {/* Formulario de Usuario */}
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder={isEditing ? "Deja vacío para no cambiar" : "Contraseña"}
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
        disabled={loading}
      >
        {loading ? "Guardando..." : isEditing ? "Actualizar Usuario" : "Agregar Usuario"}
      </button>
    </form>

    {/* Tabla de Usuarios */}
    <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full text-gray-700">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">Correo</th>
            <th className="py-3 px-6 text-left">Rol</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-100">
              <td className="py-3 px-6">{user.id}</td>
              <td className="py-3 px-6">{user.name}</td>
              <td className="py-3 px-6">{user.email}</td>
              <td className="py-3 px-6">{String(user.role)}</td>
              <td className="py-3 px-6 flex justify-center space-x-4">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-yellow-500 hover:text-yellow-600 transition-all"
                >
                  <FiEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-600 transition-all"
                >
                  <FiTrash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}
