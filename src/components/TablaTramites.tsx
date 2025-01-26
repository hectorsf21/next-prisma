import React from "react";

// Asegúrate de que el componente recibe correctamente los datos de trámites
export default function TablaTramites({ tramites }: { tramites: any[] }) {
  return (
    <div>
      {/* Tabla de trámites */}
      <h2 className="text-xl font-bold mt-8">Lista de Trámites</h2>
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Solicitante</th>
            <th className="border border-gray-300 px-4 py-2">Documento</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tramites?.map((tramite) => (
            <tr key={tramite.id}>
              <td className="border border-gray-300 px-4 py-2">{tramite.codigo}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreSolicitante}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.nombreDocumento}</td>
              <td className="border border-gray-300 px-4 py-2">{tramite.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
