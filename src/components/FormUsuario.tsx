import React from "react";

interface FormUsuarioProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  loading: boolean;
  roles: string[];
}

export default function FormUsuario({
  formData,
  handleChange,
  handleSubmit,
  isEditing,
  loading,
  roles,
}: FormUsuarioProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Correo Electrónico"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder={isEditing ? "Deja vacío para no cambiar" : "Contraseña"}
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select
        name="role"
        value={formData.role as string}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      {/* Permisos de solicitudes */}
      {(formData.role === "COORDINACION" || formData.role === "FUNDEURG") && (
        <>
          {/* Permisos de Solicitudes */}
          <div className="border p-4 rounded">
            <h3 className="text-lg font-medium">Permisos de Solicitudes</h3>
            <label className="block">
              <input
                type="checkbox"
                name="permisosSolicitudes.verNoValidas"
                checked={formData.permisosSolicitudes?.verNoValidas || false}
                onChange={handleChange}
              />
              Ver no válidas
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="permisosSolicitudes.verValidarEntrega"
                checked={formData.permisosSolicitudes?.verValidarEntrega || false}
                onChange={handleChange}
              />
              Ver y validar en proceso
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="permisosSolicitudes.verEntregadas"
                checked={formData.permisosSolicitudes?.verEntregadas || false}
                onChange={handleChange}
              />
              Ver entregadas
            </label>
          </div>

          {/* Permisos de Reportes */}
          <div className="border p-4 rounded mt-4">
            <h3 className="text-lg font-medium">Permisos de Reportes</h3>
            <label className="block">
              <input
                type="checkbox"
                name="permisosReportes.reportesFinancieros"
                checked={formData.permisosReportes?.reportesFinancieros || false}
                onChange={handleChange}
              />
              Reportes financieros
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="permisosReportes.reportesSolicitudes"
                checked={formData.permisosReportes?.reportesSolicitudes || false}
                onChange={handleChange}
              />
              Reportes de solicitudes
            </label>
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading
          ? "Guardando..."
          : isEditing
          ? "Editar Usuario"
          : "Guardar Usuario"}
      </button>
    </form>
  );
}
