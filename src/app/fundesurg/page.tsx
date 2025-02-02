'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiX } from "react-icons/fi";
import Modal from "react-modal";
import { useGlobalState, Tramite } from "@/context/GlobalStateContext";


export default function Fundesurg() {
  const { tramites, fetchTramites } = useGlobalState(); // Estado global
  const [tramitesRevision, setTramitesRevision] = useState<Tramite[]>([]);
  const [tramitesDevueltos, setTramitesDevueltos] = useState<Tramite[]>([]);
  const [tramitesOtros, setTramitesOtros] = useState<Tramite[]>([]);
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  // Actualizar las listas de trámites cuando cambie el estado global
  useEffect(() => {
    if (tramites.length > 0) {
      setTramitesRevision(tramites.filter((t: Tramite) => t.status === "PENDIENTE"));
      setTramitesDevueltos(tramites.filter((t: Tramite) => t.status === "DEVUELTO"));
      setTramitesOtros(tramites.filter((t: Tramite) => !["PENDIENTE", "DEVUELTO"].includes(t.status)));
    }
  }, [tramites]); // Dependencia: tramites

  // FUNCION PARA FILTRAR TRAMITES
  const filtrarTramites = () => {
    let tramitesFiltrados = tramites; // Usar el estado global "tramites"

    if (fechaDesde) {
      // Convertir "desde" a UTC (inicio del día)
      const desde = new Date(fechaDesde + "T00:00:00Z");

      // Si "hasta" está vacío, filtrar solo por el día de "desde"
      if (!fechaHasta) {
        const siguienteDia = new Date(desde);
        siguienteDia.setDate(desde.getDate() + 1); // Día siguiente en UTC

        tramitesFiltrados = tramites.filter((tramite) => {
          const fechaCreacionLocal = new Date(tramite.createdAt); // Convertir a local
          return fechaCreacionLocal >= desde && fechaCreacionLocal < siguienteDia;
        });
      } else {
        // Si "hasta" tiene un valor, aplicar el filtro de rango
        const hasta = new Date(fechaHasta + "T23:59:59.999Z"); // Fin del día en UTC

        tramitesFiltrados = tramites.filter((tramite) => {
          const fechaCreacionLocal = new Date(tramite.createdAt); // Convertir a local
          return fechaCreacionLocal >= desde && fechaCreacionLocal <= hasta;
        });
      }
    }

    // Actualizar las listas de trámites filtrados
    setTramitesDevueltos(tramitesFiltrados.filter((t: Tramite) => t.status === "DEVUELTO"));
    setTramitesRevision(tramitesFiltrados.filter((t: Tramite) => t.status === "PENDIENTE"));
    setTramitesOtros(tramitesFiltrados.filter((t: Tramite) => !["PENDIENTE", "DEVUELTO"].includes(t.status)));
  };

  // Manejar el cambio de fecha
  const handleFechaChange = () => {
    filtrarTramites(); // Llamar a la función de filtrado sin parámetros
  };

  // Resto del código (procesarTramite, devolverTramite, etc.)
  // ...



   // FUNCION PROCESAR STATUS

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

  // FUNCION DEVOLVER TRAMITE
  // Nueva función para cambiar el estado a "DEVUELTO"
  const devolverTramite = async (id: number) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));
  
    try {
      await axios.put("/api/status", { id, nuevoStatus: "DEVUELTO" });
      await fetchTramites(); // Actualiza la lista después de la devolución
    } catch (error) {
      console.error("Error al devolver el trámite:", error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [id]: false }));
    }
  };


  return (
    <div className="p-6">
     

      {/* Filtros de fecha */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Desde:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hasta:</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleFechaChange}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Filtrar
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6">Lista de Trámites Pendientes</h2>
      {/* Resto del código de las tablas y modal */}
{/* Tabla de Trámites Pendientes */}
      <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200 mb-8">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Transferencia</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Monto</th>
            <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
            <th className="border border-gray-300 px-4 py-2">Devolucion</th>
          </tr>
        </thead>
        <tbody>
          {tramitesRevision.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(tramite.createdAt).toLocaleDateString('es-VE')}</td>
              {/* <td className="border border-gray-300 px-4 py-2">{tramite.createdAt}</td> */}
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
              {/* DEVOLVER */}
              <td className="border border-gray-300 px-4 py-2"> 
                <button
                  onClick={() => devolverTramite(tramite.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  disabled={loadingButtons[tramite.id]}
                >
                  {loadingButtons[tramite.id] ? "Procesando..." : "Devolver"}
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
          <td className="border border-gray-300 px-4 py-2"></td>
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
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Monto</th>
            <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
          </tr>
        </thead>
        <tbody>
          {tramitesOtros.map((tramite) => (
            <tr key={tramite.id} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(tramite.createdAt).toLocaleDateString('es-VE')}</td>
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
      <td className="border border-gray-300 px-4 py-2" colSpan={3}>
        Total Monto Procesado:
      </td>
      <td className="border border-gray-300 px-4 py-2 text-blue-600">
        {tramitesOtros.reduce((acc, tramite) => acc + tramite.monto, 0).toFixed(2)} BS
      </td>
      <td className="border border-gray-300 px-4 py-2 text-blue-600"></td>
    </tr>
  </tfoot>
      </table>
        
      {/* LISTA DE TRAMITES DEVUELTOS */}
      <h2 className="text-2xl font-bold my-6">Lista de Trámites Devueltos</h2>

<table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200 mb-8">
  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
    <tr>
      <th className="border border-gray-300 px-4 py-2">Código</th>
      <th className="border border-gray-300 px-4 py-2">Fecha</th>
      <th className="border border-gray-300 px-4 py-2">Transferencia</th>
      <th className="border border-gray-300 px-4 py-2">Estado</th>
      <th className="border border-gray-300 px-4 py-2">Monto</th>
      <th className="border border-gray-300 px-4 py-2">Ver Detalle</th>
      {/* <th className="border border-gray-300 px-4 py-2">Acciones</th>
      <th className="border border-gray-300 px-4 py-2">Devolucion</th> */}
    </tr>
  </thead>
  <tbody>
    {tramitesDevueltos.map((tramite) => (
      <tr key={tramite.id} className="bg-white hover:bg-gray-50">
        <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
        <td className="border border-gray-300 px-4 py-2">{new Date(tramite.createdAt).toLocaleDateString('es-VE')}</td>
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
      </tr>
    ))}
  </tbody>
  <tfoot>
  <tr className="bg-gray-200 font-bold">
    <td className="border border-gray-300 px-4 py-2" colSpan={4}>
      Total Monto por Procesado:
    </td>
    <td className="border border-gray-300 px-4 py-2 text-blue-600">
      {tramitesDevueltos.reduce((acc, tramite) => acc + tramite.monto, 0).toFixed(2)} BS
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
      {/* ... */}
    </div>
  );
}