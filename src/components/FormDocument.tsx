import React from "react";

interface FormDocumentProps {
  formData: {
    nombreDocumento: string;
    tipoPapel: string;
    precio: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  tiposPapel: string[];
}

export default function FormDocument({
  formData,
  handleChange,
  handleSubmit,
  loading,
  tiposPapel,
}: FormDocumentProps) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Formulario de Documentos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombreDocumento" className="block text-sm font-medium text-gray-700">
            Nombre del Documento
          </label>
          <input
            type="text"
            id="nombreDocumento"
            name="nombreDocumento"
            value={formData.nombreDocumento}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Certificado de Nacimiento"
            required
          />
        </div>

        {/* Se eliminó el campo Tipo de Documento, ya que ahora lo determina el backend */}

        <div>
          <label htmlFor="tipoPapel" className="block text-sm font-medium text-gray-700">
            Tipo de Papel
          </label>
          <select
            id="tipoPapel"
            name="tipoPapel"
            value={formData.tipoPapel}
            onChange={handleChange}
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
            value={formData.precio}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 25.00"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Agregar Documento"}
        </button>
      </form>
    </div>
  );
}
