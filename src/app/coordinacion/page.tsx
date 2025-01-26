"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import Modal from "react-modal";

// Interfaz para Tramite
interface Tramite {
  id: number;
  codigo: string;
  nombreSolicitante: string;
  nombreDocumento: string;
  status: string;
  monto: number;
}

export default function ListaTramitesPendientes() {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null); // Cambia el ID específico que está en proceso

  // Mapeo de estados
  const statusFlow: { [key: string]: string } = {
    EN_PROCESO: "LISTO",
    LISTO: "ENTREGADO",
  };

  // Obtener trámites desde el backend
  useEffect(() => {
    fetchTramites();
  }, []);

  const fetchTramites = async () => {
    try {
      const res = await axios.get("/api/tramites");
      setTramites(res.data);
    } catch (error) {
      console.error("Error al obtener trámites:", error);
    }
  };

  // Cambiar estado dinámicamente
  const changeStatus = async (id: number, currentStatus: string) => {
    const nextStatus = statusFlow[currentStatus]; // Determina el próximo estado
    if (!nextStatus) return;

    setLoadingId(id); // Establece el ID del trámite que está en proceso
    await axios.put("/api/status", { id, nuevoStatus: nextStatus }); // Envía el estado actualizado al backend
    await fetchTramites(); // Actualiza la lista de trámites
    setLoadingId(null); // Restablece el estado de carga al terminar
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites Pendientes</h2>

      <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Solicitante</th>
            <th className="border border-gray-300 px-4 py-2">Documento</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tramites.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreSolicitante}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreDocumento}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.status}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => setSelectedTramite(tramite)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEye size={18} />
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {statusFlow[tramite.status] && (
                  <button
                    onClick={() => changeStatus(tramite.id, tramite.status)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    disabled={loadingId === tramite.id} // Solo desactiva el botón correspondiente
                  >
                    {loadingId === tramite.id ? "Procesando..." : "Procesar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedTramite && (
        <Modal
          isOpen={!!selectedTramite}
          onRequestClose={() => setSelectedTramite(null)}
          className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">Detalles del Trámite</h2>
          <p><strong>Código:</strong> {selectedTramite.codigo}</p>
          <p><strong>Solicitante:</strong> {selectedTramite.nombreSolicitante}</p>
          <p><strong>Documento:</strong> {selectedTramite.nombreDocumento}</p>
          <p><strong>Estado:</strong> {selectedTramite.status}</p>
          <button
            onClick={() => setSelectedTramite(null)}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
          >
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
}
