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
  numeroTransferencia: string;
  nombreDocumento: string;
  status: string;
  monto: number;
  statusHistory: { status: string; fecha: string }[] | string;
}

export default function Fundesurg() {
  const [tramitesRevision, setTramitesRevision] = useState<Tramite[]>([]);
  const [tramitesOtros, setTramitesOtros] = useState<Tramite[]>([]);
  const [alltramites, setAllTramites] = useState<Tramite[]>([]);
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

      setTramitesRevision(parsedTramites.filter((t: Tramite) => t.status === "PENDIENTE"));
      setTramitesOtros(parsedTramites.filter((t: Tramite) => t.status !== "PENDIENTE"));
      setAllTramites(parsedTramites);
    } catch (error) {
      console.error("Error al obtener trámites:", error);
    }
  };

  // Manejar el procesamiento del trámite (para cada botón individualmente)
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

  // Calcular el total de montos de todos los trámites
  const totalMonto = tramitesOtros.reduce((acc: number, tramite: Tramite) => acc + tramite.monto, 0);

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
              <td className="border border-gray-300 px-4 py-2">{tramite.numeroTransferencia}</td>
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
                  disabled={loadingButtons[tramite.id]}
                >
                  {loadingButtons[tramite.id] ? "Procesando..." : "Procesar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lista de trámites procesados */}
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
      </table>
    </div>
  );
}
