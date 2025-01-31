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

interface Documento {
  id: number;
  nombre: string;
  tipoDocumento: string;
  tipoPapel: string;
  carrera: string;
  cantidad: number;
  precio: number;
}

interface Tramite {
  id: number;
  codigo: string;
  nombreSolicitante: string;
  numeroTransferencia: string;
  status: string;
  monto: number;
  statusHistory: { status: string; fecha: string }[] | string;
  documentos: Documento[];
}

export default function TestComponents() {
  const { tramites, fetchTramites } = useGlobalState();

  // Estado para el formulario
  const [formData, setFormData] = useState<FormData>({
    nombreSolicitante: "",
    numeroTransferencia: "",
    monto: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

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
        documentos: [],
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
        data: { id },
      });

      if (response.status === 200) {
        alert("Trámite eliminado correctamente.");
        fetchTramites();
      } else {
        alert("Error al eliminar el trámite.");
      }
    } catch (error) {
      console.error("Error al eliminar trámite:", error);
      alert("Hubo un error al eliminar el trámite.");
    }
  };

  // MAPEO DE ESTADOS
  const statusFlow: { [key: string]: string } = {
    PENDIENTE: "EN_PROCESO",
    EN_PROCESO: "LISTO",
    LISTO: "ENTREGADO",
  };

  const changeStatus = async (id: number, currentStatus: string) => {
    const nextStatus = statusFlow[currentStatus];
    if (!nextStatus) return;

    setLoadingId(id);
    try {
      await axios.put("/api/status", { id, nuevoStatus: nextStatus });
      await fetchTramites();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchTramites();
  }, [fetchTramites]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Formulario para crear trámite */}
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Crear Trámite</h1>

    <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg max-w-lg mx-auto space-y-4">
     <fieldset>

    {/* Campo: Nombre del Solicitante */}
    <div className="mb-4">
      <label htmlFor="nombreSolicitante" className="block text-gray-700 font-medium">Nombre del Solicitante:</label>
      <input
        type="text"
        id="nombreSolicitante"
        name="nombreSolicitante"
        placeholder="Ingrese el nombre completo"
        value={formData.nombreSolicitante}
        onChange={handleChange}
        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
        required
      />
    </div>

    {/* Campo: Número de Transferencia */}
    <div className="mb-4">
      <label htmlFor="numeroTransferencia" className="block text-gray-700 font-medium">Número de Transferencia:</label>
      <input
        type="text"
        id="numeroTransferencia"
        name="numeroTransferencia"
        placeholder="Ej. 123456789"
        value={formData.numeroTransferencia}
        onChange={handleChange}
        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
        required
      />
    </div>

    {/* Campo: Monto */}
    <div className="mb-4">
      <label htmlFor="monto" className="block text-gray-700 font-medium">Monto (BS):</label>
      <input
        type="number"
        id="monto"
        name="monto"
        placeholder="Ingrese el monto"
        value={formData.monto}
        onChange={handleChange}
        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
        required
      />
    </div>
  </fieldset>

  {/* Botón de envío */}
  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md"
    disabled={loading}
  >
    {loading ? "Creando..." : "Crear Trámite"}
  </button>
</form>


      {/* Tabla de trámites */}
      <h2 className="text-2xl font-bold my-12">Lista de Trámites</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200 shadow-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-center">ID</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Solicitante</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Transferencia</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Monto</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Estado</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Procesar</th>
              <th className="border border-gray-300 px-4 py-3 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {tramites?.length > 0 ? (
              tramites.map((tramite) => (
                <tr key={tramite.id} className="bg-white hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.nombreSolicitante}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.numeroTransferencia}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${tramite.monto.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{tramite.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {statusFlow[tramite.status] && (
                      <button
                        onClick={() => changeStatus(tramite.id, tramite.status)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        disabled={loadingId === tramite.id}
                      >
                        {loadingId === tramite.id ? "Procesando..." : "Procesar"}
                      </button>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteTramite(tramite.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">No hay trámites disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
