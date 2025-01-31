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
  numeroTransferencia: string;
  nombreDocumento: string;
  status: string;
  monto: number;
  statusHistory: { status: string; fecha: string }[] | string;
}

export default function Fundesurg() {
  const [tramitesRevision, setTramitesRevision] = useState<Tramite[]>([]);
  const [Alltramites, setAllTramites] = useState<Tramite[]>([]);
  const [tramitesOtros, setTramitesOtros] = useState<Tramite[]>([]);
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

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
      console.log(parsedTramites)
      setAllTramites(parsedTramites);
      setTramitesRevision(parsedTramites.filter((t: Tramite) => t.status === "PENDIENTE"));
      setTramitesOtros(parsedTramites.filter((t: Tramite) => t.status !== "PENDIENTE"));
    } catch (error) {
      console.error("Error al obtener trámites:", error);
    }
  };

  // Manejar el procesamiento del trámite
  const procesarTramite = async (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));

    try {
      await axios.put("/api/status", { id, nuevoStatus: "EN_PROCESO" });
      await fetchTramites();
    } catch (error) {
      console.error("Error al procesar el trámite:", error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [id]: false }));
    }
  };
  // MONTO TOTAL DE TRAMITES PROCESADOS

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites Pendientes</h2>

      {/* Tabla de Trámites Pendientes */}
      <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200 mb-8">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Solicitante</th>
            <th className="border border-gray-300 px-4 py-2">Transferencia</th>
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
              <td className="border border-gray-300 px-4 py-2">{tramite.numeroTransferencia}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.status}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.monto.toFixed(2)} BS</td>
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
                  disabled={loadingButtons[tramite.id]}
                >
                  {loadingButtons[tramite.id] ? "Procesando..." : "Procesar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
    <tr className="bg-gray-200 font-bold">
      <td className="border border-gray-300 px-4 py-2" colSpan={4}>
        Total Monto por Procesado:
      </td>
      <td className="border border-gray-300 px-4 py-2 text-blue-600">
        {tramitesRevision.reduce((acc, tramite) => acc + tramite.monto, 0).toFixed(2)} BS
      </td>
      <td className="border border-gray-300 px-4 py-2"></td>
    </tr>
  </tfoot>
  
      </table>

      {/* Lista de Trámites Procesados */}
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites Procesados</h2>
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
          {Alltramites.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreSolicitante}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreDocumento}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.status}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.monto.toFixed(2)} BS</td>
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
                {/* Pie de tabla con total de montos */}
  <tfoot>
    <tr className="bg-gray-200 font-bold">
      <td className="border border-gray-300 px-4 py-2" colSpan={4}>
        Total Monto Procesado:
      </td>
      <td className="border border-gray-300 px-4 py-2 text-blue-600">
        {tramitesOtros.reduce((acc, tramite) => acc + tramite.monto, 0).toFixed(2)} BS
      </td>
      <td className="border border-gray-300 px-4 py-2"></td>
    </tr>
  </tfoot>
      </table>

     {/* MODAL DE DETALLE */}
{selectedTramite && (
  <Modal
    isOpen={!!selectedTramite}
    onRequestClose={() => setSelectedTramite(null)}
    className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-20 relative"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
  >
    {/* Botón de cerrar */}
    <button
      onClick={() => setSelectedTramite(null)}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
    >
      <FiX size={24} />
    </button>

    {/* Título */}
    <h2 className="text-xl font-bold mb-4 text-center">Detalles del Trámite</h2>

    {/* Tabla Responsive */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600 border-collapse border border-gray-200">
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
            <td className="border border-gray-300 px-4 py-2">{selectedTramite.monto.toFixed(2)} BS</td>
          </tr>
        <tr className="bg-gray-100">
  <td className="border border-gray-300 px-4 py-2 font-semibold">Historial de Estados</td>
  <td className="border border-gray-300 px-4 py-2">
    <ul className="list-disc list-inside space-y-1">
      {Array.isArray(selectedTramite.statusHistory) ? (
        selectedTramite.statusHistory.map((hist, index) => (
          <li key={index} className="text-gray-700">
            <span className="font-semibold">{hist.status}:</span> {new Date(hist.fecha).toLocaleString("es-VE")}
          </li>
        ))
      ) : (
        <span className="text-gray-500">Sin historial</span>
      )}
      </ul>
    </td>
    </tr>
        </tbody>
      </table>
    </div>

    {/* Botón de cierre */}
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
