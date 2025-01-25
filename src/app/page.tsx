"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Interfaces para tipar datos
interface User {
  id: number;
  name: string;
  email: string;
}

interface FormData {
  id?: number;
  name: string;
  email: string;
  password: string;
}

// Componente principal del CRUD
export default function UserCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carga los usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  // Manejar los cambios del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la creación o actualización del usuario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && formData.id) {
        // Filtra la contraseña si está vacía
        const { password, ...data } = formData;
        const payload = password ? formData : data; // Incluye la contraseña solo si no está vacía

        await axios.put(`/api/users?id=${formData.id}`, payload);
      } else {
        // Crear nuevo usuario
        await axios.post('/api/users', formData);
      }
      fetchUsers();
      setFormData({ name: '', email: '', password: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la edición de un usuario
  const handleEdit = (user: User) => {
    setFormData({ id: user.id, name: user.name, email: user.email, password: '' });
    setIsEditing(true);
  };

  // Manejar la eliminación de un usuario
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`/api/users?id=${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? 'Editar Usuario' : 'Guardar Usuario'}
        </button>
      </form>

      {/* Tabla */}
      <table className="w-full mt-6 border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Correo</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
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
