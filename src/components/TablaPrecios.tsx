"use client";

import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useGlobalState } from "@/context/GlobalStateContext";

export default function TablaPrecios() {
  const { setIsOpen, documents, setSelectedDocument } = useGlobalState(); // Añadimos setSelectedDocument

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Documentos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nombre del Documento</th>
              <th className="border border-gray-300 px-4 py-2">Tipo de Documento</th>
              <th className="border border-gray-300 px-4 py-2">Tipo de Papel</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Agregar al carrito</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="bg-white hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{doc.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.tipoDocumento}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.tipoPapel}</td>
                <td className="border border-gray-300 px-4 py-2">${doc.precio.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setSelectedDocument(doc); // Guardamos el documento seleccionado
                      setIsOpen(true); // Abrimos el modal
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Agregar al carrito"
                  >
                    <FiShoppingCart size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
