import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

interface Documento {
  id: number;
  nombre: string;
  tipoDocumento: string;
  tipoPapel: string;
  precio: number;
}

export default function TablaDocument({
  documents,
  loading,
  onEdit,
  onDelete,
}: {
  documents: Documento[];
  loading: boolean;
  onEdit: (document: Documento) => void; // Función para editar
  onDelete: (id: number) => void; // Función para eliminar
}) {
  if (loading) {
    return <p className="text-center">Cargando documentos...</p>;
  }

  if (documents.length === 0) {
    return <p className="text-center">No hay documentos disponibles.</p>;
  }

  return (
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
            <td className="border border-gray-300 px-4 py-2">${doc.precio.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-2 flex space-x-4">
              <button
                onClick={() => onEdit(doc)}
                className="text-blue-500 hover:text-blue-700"
                title="Editar"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={() => onDelete(doc.id)}
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
  );
}
