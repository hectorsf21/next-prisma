"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useGlobalState } from "@/context/GlobalStateContext"; // Importamos el contexto
import { FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";

interface DocumentFormData {
  id?: string;
  nombreDocumento: string;
  tipoPapel: string;
  precio: string;
}

const tiposPapel = ["PAPEL SIMPLE", "PAPEL SEGURIDAD"];

const DocumentComponents = () => {
  const { documents, fetchDocuments } = useGlobalState(); // Consumimos el contexto
  const [documentFormData, setDocumentFormData] = useState<DocumentFormData>({
    nombreDocumento: "",
    tipoPapel: tiposPapel[0],
    precio: "",
  });
  const [loadingDocument, setLoadingDocument] = useState(false);

  // Manejar cambios en el formulario
  const handleDocumentChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleDocumentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingDocument(true);
    try {
      if (documentFormData.id) {
        // Si tiene ID, es una edición (PUT)
        await axios.put(`/api/documentos`, {
          id: parseInt(documentFormData.id),
          nombre: documentFormData.nombreDocumento,
          tipoPapel: documentFormData.tipoPapel,
          precio: parseFloat(documentFormData.precio),
        });
      } else {
        // Si no tiene ID, es un nuevo documento (POST)
        await axios.post("/api/documentos", {
          nombre: documentFormData.nombreDocumento,
          tipoPapel: documentFormData.tipoPapel,
          precio: parseFloat(documentFormData.precio),
        });
      }

      await fetchDocuments(); // Recargar la lista de documentos

      // Resetear el formulario
      setDocumentFormData({
        id: undefined,
        nombreDocumento: "",
        tipoPapel: tiposPapel[0],
        precio: "",
      });
    } catch (error) {
      console.error("Error al procesar el documento:", error);
    } finally {
      setLoadingDocument(false);
    }
  };

  // Manejar la edición de un documento
  const handleEditDocument = (document: any) => {
    setDocumentFormData({
      id: document.id.toString(),
      nombreDocumento: document.nombre,
      tipoPapel: document.tipoPapel,
      precio: document.precio.toString(),
    });
  };

  // Manejar la eliminación de un documento
  const handleDeleteDocument = async (id: number) => {
    try {
      await axios.delete(`/api/documentos?id=${id}`);
      fetchDocuments(); // Recargar la lista de documentos
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  return (
    <div>
      {/* Formulario de documentos */}
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Formulario de Documentos</h2>
        <form onSubmit={handleDocumentSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombreDocumento" className="block text-sm font-medium text-gray-700">
              Nombre del Documento
            </label>
            <input
              type="text"
              id="nombreDocumento"
              name="nombreDocumento"
              value={documentFormData.nombreDocumento}
              onChange={handleDocumentChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Certificado de Nacimiento"
              required
            />
          </div>

          <div>
            <label htmlFor="tipoPapel" className="block text-sm font-medium text-gray-700">
              Tipo de Papel
            </label>
            <select
              id="tipoPapel"
              name="tipoPapel"
              value={documentFormData.tipoPapel}
              onChange={handleDocumentChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tiposPapel.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={documentFormData.precio}
              onChange={handleDocumentChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 25.00"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            disabled={loadingDocument}
          >
            {loadingDocument ? "Guardando..." : "Agregar Documento"}
          </button>
        </form>
      </div>

      {/* Tabla de documentos */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Tipo de Documento</th>
              <th className="border border-gray-300 px-4 py-2">Tipo de Papel</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="bg-white hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{doc.id}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.tipoDocumento}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.tipoPapel}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.precio.toFixed(2)} BS</td>
                <td className="border border-gray-300 px-4 py-2 flex space-x-4">
                  <button
                    onClick={() => handleEditDocument(doc)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Editar"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    <FiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentComponents;