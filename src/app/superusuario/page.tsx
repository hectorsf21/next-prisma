"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Interfaces para tipar datos
interface User {
  id: number;
  name: string;
  email: string;
  role: string | object; // Role puede ser string o JSON
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

interface FormData {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string | object; // Campo para rol
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
const roles = ["SUPERUSUARIO", "COORDINACION", "FUNDEURG", "SOLICITANTE"];

// Componente principal del CRUD
export default function SuperUsuario() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: roles[3], // Rol predeterminado: "SOLICITANTE"
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

  // Carga los usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
      console.log('fetch es:', res.data)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  // Manejar los cambios del formulario
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      const { checked } = target as HTMLInputElement;
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
    console.log('formData es:',formData)
    try {
      if (isEditing && formData.id) {
        await axios.put(`/api/users?id=${formData.id}`, formData);
      } else {
        // Crear nuevo usuario
        await axios.post("/api/users", formData);
      }
      fetchUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: roles[3],
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
      role: user.role,
      permisosSolicitudes: user.permisosSolicitudes || {
        verNoValidas: false,
        verValidarEntrega: false,
        verEntregadas: false,
      },
      permisosReportes: user.permisosReportes || {
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
        await axios.delete(`/api/users?id=${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder={isEditing ? "Deja vacío para no cambiar" : "Contraseña"}
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role as string}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Permisos de solicitudes */}
        {(formData.role === "COORDINACION" || formData.role === "FUNDEURG") && (
  <>
    {/* Permisos de Solicitudes */}
    <div className="border p-4 rounded">
      <h3 className="text-lg font-medium">Permisos de Solicitudes</h3>
      <label className="block">
        <input
          type="checkbox"
          name="permisosSolicitudes.verNoValidas"
          checked={formData.permisosSolicitudes?.verNoValidas || false}
          onChange={handleChange}
        />
        Ver no válidas
      </label>
      <label className="block">
        <input
          type="checkbox"
          name="permisosSolicitudes.verValidarEntrega"
          checked={formData.permisosSolicitudes?.verValidarEntrega || false}
          onChange={handleChange}
        />
        Ver y validar en proceso
      </label>
      <label className="block">
        <input
          type="checkbox"
          name="permisosSolicitudes.verEntregadas"
          checked={formData.permisosSolicitudes?.verEntregadas || false}
          onChange={handleChange}
        />
        Ver entregadas
      </label>
    </div>

    {/* Permisos de Reportes */}
    <div className="border p-4 rounded mt-4">
      <h3 className="text-lg font-medium">Permisos de Reportes</h3>
      <label className="block">
        <input
          type="checkbox"
          name="permisosReportes.reportesFinancieros"
          checked={formData.permisosReportes?.reportesFinancieros || false}
          onChange={handleChange}
        />
        Reportes financieros
      </label>
      <label className="block">
        <input
          type="checkbox"
          name="permisosReportes.reportesSolicitudes"
          checked={formData.permisosReportes?.reportesSolicitudes || false}
          onChange={handleChange}
        />
        Reportes de solicitudes
      </label>
      </div>
       </>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : isEditing
            ? "Editar Usuario"
            : "Guardar Usuario"}
        </button>
      </form>

      {/* Tabla */}
      <table className="w-full mt-6 border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Correo</th>
            <th className="border border-gray-300 px-4 py-2">Rol</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {typeof user.role === "string"
                  ? user.role
                  : JSON.stringify(user.role)}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
