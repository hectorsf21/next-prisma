"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiX } from "react-icons/fi";
import Modal from "react-modal";

// Interfaz para Tramite
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
  nombreDocumento: string;
  status: string;
  monto: number;
  statusHistory: { status: string; fecha: string }[] | string;
  documentos: Documento[]; // Nuevo campo para almacenar documentos relacionados
  createdAt: string; // Agregado para representar la fecha de creación del trámite
}

export default function ListaTramitesPendientes() {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Filtros
  const [filterDate, setFilterDate] = useState<string>("");  // Usamos un solo filtro de fecha

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
      console.log(parsedTramites);
      const tramitesCoordinacion = parsedTramites.filter((t: Tramite) => t.status !== "PENDIENTE");
      setTramites(tramitesCoordinacion);
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

  // FILTRO XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  const filteredTramites = tramites.filter((tramite) => {
  
    // Filtro por fecha de creación (comparando las fechas en formato UTC)
    const filterByDate =
      filterDate === "" ||
      new Date(tramite.createdAt).toISOString().split('T')[0] === new Date(filterDate).toISOString().split('T')[0];
  
    return filterByDate;
  });
  
  
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites</h2>

      {/* Filtros */}
      <div className="mb-4 flex space-x-4">
        <div className="flex flex-col">
          <label htmlFor="filterDate" className="text-gray-700 font-medium">Filtrar por Fecha:</label>
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Fecha de creacion</th>
            <th className="border border-gray-300 px-4 py-2">Solicitante</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTramites.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">
              {new Date(tramite.createdAt).getDate().toString().padStart(2, '0')}/{(new Date(tramite.createdAt).getMonth() + 1).toString().padStart(2, '0')}/{new Date(tramite.createdAt).getFullYear()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreSolicitante}</td>
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

      {/* Modal y demás contenido */}
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Estado</td>
                      <td className="border border-gray-300 px-4 py-2">{selectedTramite.status}</td>
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
                    {/* documentos */}
                    <tr className="bg-gray-100">
        <td className="border border-gray-300 px-4 py-2 font-semibold">Documentos Solicitados</td>
        <td className="border border-gray-300 px-4 py-2">
          <ul className="list-disc list-inside space-y-1">
            {selectedTramite.documentos && selectedTramite.documentos.length > 0 ? (
              selectedTramite.documentos.map((doc, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-semibold">{doc.nombre}</span> - {doc.tipoDocumento} - {doc.tipoPapel} - {doc.carrera} - {doc.cantidad} unidad(es)
                </li>
              ))
            ) : (
              <span className="text-gray-500">No hay documentos asociados</span>
            )}
          </ul>
        </td>
      </tr>
      {/* documentos termina */}
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
