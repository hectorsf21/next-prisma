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
  statusHistory: { status: string; fecha: string }[] | string; // Puede ser un array o un string
}

export default function Fundesurg() {
  const [tramitesRevision, setTramitesRevision] = useState<Tramite[]>([]);
  const [tramitesOtros, setTramitesOtros] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

  // Obtener trámites desde el backend
  useEffect(() => {
    fetchTramites();
  }, []);

  const fetchTramites = async () => {
    try {
      const res = await axios.get("/api/tramites");
      // Parsear statusHistory si es necesario
      const parsedTramites = res.data.map((tramite: Tramite) => ({
        ...tramite,
        statusHistory:
          typeof tramite.statusHistory === "string"
            ? JSON.parse(tramite.statusHistory)
            : tramite.statusHistory,
      }));
      setTramitesRevision(parsedTramites.filter((t) => t.status === "EN_REVISION"));
      setTramitesOtros(parsedTramites.filter((t) => t.status !== "EN_REVISION"));
    } catch (error) {
      console.error("Error al obtener trámites:", error);
    }
  };

  // Manejar el procesamiento del trámite
  const procesarTramite = async (id: number) => {
    setLoading(true);
    await axios.put("/api/status", { id, nuevoStatus: "EN_PROCESO" });
    await fetchTramites();
    setLoading(false);
  };


  // Calcular el total de montos para "OTROS ESTADOS"
  const totalMontoOtros = tramitesOtros.reduce(
    (acc: number, tramite: Tramite) => acc + tramite.monto,
    0
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites Pendientes</h2>

      {/* Tabla para EN_REVISION */}
      <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200 mb-8">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Solicitante</th>
            <th className="border border-gray-300 px-4 py-2">Documento</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Monto</th>
            <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tramitesRevision.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreSolicitante}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreDocumento}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.status}</td>
              <td className="border border-gray-300 px-4 py-2">${tramite.monto.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => setSelectedTramite(tramite)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEye size={18} />
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => procesarTramite(tramite.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Procesar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Tabla para otros estados */}
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites Procesadas</h2>
      <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Solicitante</th>
            <th className="border border-gray-300 px-4 py-2">Documento</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Monto</th>
            <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
          </tr>
        </thead>
        <tbody>
          {tramitesOtros.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreSolicitante}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreDocumento}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.status}</td>
              <td className="border border-gray-300 px-4 py-2">${tramite.monto.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => setSelectedTramite(tramite)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold" colSpan={4}>
              Total
            </td>
            <td className="border border-gray-300 px-4 py-2 font-bold">
              ${totalMontoOtros.toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>
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
          <p><strong>Monto:</strong> ${selectedTramite.monto.toFixed(2)}</p>
          <h3 className="text-lg font-bold mt-4">Historial de Estados</h3>
          <ul className="list-disc list-inside">
            {Array.isArray(selectedTramite.statusHistory) &&
              selectedTramite.statusHistory.map((hist, index) => (
                <li key={index}>
                  {hist.status} - {new Date(hist.fecha).toLocaleString()}
                </li>
              ))}
          </ul>
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
