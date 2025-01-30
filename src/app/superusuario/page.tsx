'use client';
import { FaUsers, FaFileAlt } from "react-icons/fa"; // Importamos los íconos necesarios
import { useRouter } from "next/navigation";

export default function PanelControl() {
  const router = useRouter();

  const send_panel_usuario = () => {
    router.push('/superusuario/panel-usuarios');
  };
  const send_panel_solicitudes = () => {
    router.push('/superusuario/panel-solicitudes');
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-4xl w-full px-4">
      {/* Panel de usuario */}
      <div
        onClick={send_panel_usuario}
        className="cursor-pointer bg-white p-4 hover:shadow-lg transition-shadow rounded-lg"
      >
        <div className="flex flex-row items-center justify-between pb-2">
          <div className="text-lg font-medium">Panel de Usuarios</div>
          <FaUsers className="h-8 w-8 text-violet-500" /> {/* Icono cambiado */}
        </div>
        <div>
          <p className="text-sm text-gray-600">Gestión de usuarios del sistema</p>
        </div>
      </div>

      {/* Panel de Solicitudes */}
      <div
        onClick={send_panel_solicitudes} 
        className="cursor-pointer bg-white p-4 hover:shadow-lg transition-shadow rounded-lg"
      >
        <div className="flex flex-row items-center justify-between pb-2">
          <div className="text-lg font-medium">Panel de Solicitudes</div>
          <FaFileAlt className="h-8 w-8 text-pink-500" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Gestión de solicitudes pendientes</p>
        </div>
      </div>
    </div>
  );
}
