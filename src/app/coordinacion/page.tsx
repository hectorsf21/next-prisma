"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiX } from "react-icons/fi";
import Modal from "react-modal";

// Interfaz para Tramite
interface Tramite {
  id: number;
  codigo: string;
  nombreSolicitante: string;
  nombreDocumento: string;
  status: string;
  monto: number;
  statusHistory: { status: string; fecha: string }[] | string;
}

export default function ListaTramitesPendientes() {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

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
      const parsedTramites = res.data.map((tramite: Tramite) => ({
        ...tramite,
        statusHistory:
          typeof tramite.statusHistory === "string"
            ? JSON.parse(tramite.statusHistory)
            : tramite.statusHistory,
      }));
      setTramites(parsedTramites);
    } catch (error) {
      console.error("Error al obtener trámites:", error);
    }
  };

  // Cambiar estado dinámicamente
  const changeStatus = async (id: number, currentStatus: string) => {
    const nextStatus = statusFlow[currentStatus];
    if (!nextStatus) return;

    setLoadingId(id);
    await axios.put("/api/status", { id, nuevoStatus: nextStatus });
    await fetchTramites();
    setLoadingId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites</h2>

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
                    disabled={loadingId === tramite.id}
                  >
                    {loadingId === tramite.id ? "Procesando..." : "Procesar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL DE DETALLE */}
      {selectedTramite && (
        <Modal
          isOpen={!!selectedTramite}
          onRequestClose={() => setSelectedTramite(null)}
          className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <button
            onClick={() => setSelectedTramite(null)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>

          <h2 className="text-xl font-bold mb-4">Detalles del Trámite</h2>

          <table className="w-full text-sm text-left text-gray-600 border border-gray-300">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Código</td>
                <td className="border border-gray-300 px-4 py-2">{selectedTramite.codigo}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Solicitante</td>
                <td className="border border-gray-300 px-4 py-2">{selectedTramite.nombreSolicitante}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Documento</td>
                <td className="border border-gray-300 px-4 py-2">{selectedTramite.nombreDocumento}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Estado</td>
                <td className="border border-gray-300 px-4 py-2">{selectedTramite.status}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Monto</td>
                <td className="border border-gray-300 px-4 py-2">${selectedTramite.monto.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Historial de Estado</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc list-inside space-y-1">
                    {Array.isArray(selectedTramite.statusHistory) &&
                      selectedTramite.statusHistory.map((hist, index) => (
                        <li key={index} className="text-gray-700">
                          <span className="font-semibold">{hist.status}</span> - {new Date(hist.fecha).toLocaleString('es-VE')}
                        </li>
                      ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            onClick={() => setSelectedTramite(null)}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 w-full"
          >
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
}
