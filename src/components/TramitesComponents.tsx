"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

// Interfaces para los datos
interface FormData {
  nombreSolicitante: string;
  numeroTransferencia: string;
  monto: number;
}

export default function TramitesComponent() {
  const { tramites, fetchTramites } = useGlobalState();

  // Estado para el formulario
  const [formData, setFormData] = useState<FormData>({
    nombreSolicitante: "",
    numeroTransferencia: "",
    monto: 0,
  });

  const [loading, setLoading] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" && !isNaN(parseFloat(value)) ? parseFloat(value) : value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/test", {
        nombreSolicitante: formData.nombreSolicitante,
        numeroTransferencia: formData.numeroTransferencia,
        monto: formData.monto,
        documentos: [], // Agregar lógica para incluir documentos si es necesario
      });

      if (response.status === 201) {
        alert("Trámite creado correctamente.");
        setFormData({
          nombreSolicitante: "",
          numeroTransferencia: "",
          monto: 0,
        });
        fetchTramites();
      } else {
        alert("Error al crear el trámite.");
      }
    } catch (error) {
      console.error("Error al crear trámite:", error);
      alert("Hubo un error al crear el trámite.");
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un trámite
  const handleDeleteTramite = async (id: number) => {
    try {
      const response = await axios.delete(`/api/tramites`, {
        data: { id }, // Enviar el ID en el cuerpo de la solicitud
      });

      if (response.status === 200) {
        alert("Trámite eliminado correctamente.");
        fetchTramites(); // Actualizar la lista de trámites
      } else {
        alert("Error al eliminar el trámite.");
      }
    } catch (error) {
      console.error("Error al eliminar trámite:", error);
      alert("Hubo un error al eliminar el trámite.");
    }
  };

  // Efecto para cargar trámites al montar el componente
  useEffect(() => {
    fetchTramites();
  }, [fetchTramites]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Formulario para crear trámite */}
      <h1 className="text-2xl font-bold mb-4">Crear Trámite</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="nombreSolicitante"
          placeholder="Nombre del solicitante"
          value={formData.nombreSolicitante}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="numeroTransferencia"
          placeholder="Número de transferencia"
          value={formData.numeroTransferencia}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={formData.monto}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Trámite"}
        </button>
      </form>

      {/* Tabla de trámites */}
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Trámites</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200 shadow-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-center">ID</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Nombre del Solicitante</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Número de Transferencia</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Monto</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Estado</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Fecha</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tramites?.length > 0 ? (
              tramites.map((tramite) => (
                <tr key={tramite.id} className="bg-white hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.nombreSolicitante}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.numeroTransferencia}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    ${tramite.monto.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(tramite.createdAt).toLocaleString()}
                  </td>
                  {/* xxx */}
                  <td className="border border-gray-300 px-4 py-4 flex items-center justify-center gap-2">
                  {/* Botón de Procesar */}
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    title="Procesar"
                  >
                    Procesar
                  </button>

                  {/* Botón de Eliminar */}
                  <button
                    onClick={() => handleDeleteTramite(tramite.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none"
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No hay trámites disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
