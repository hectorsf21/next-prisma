import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useGlobalState } from "@/context/GlobalStateContext";

export default function FormularioCarritoModal() {
  const { isOpen, setIsOpen, selectedDocument, addToCart } = useGlobalState(); 
  const [cantidad, setCantidad] = useState(1);
  const [carrera, setCarrera] = useState("");
  const [mounted, setMounted] = useState(false); // Nuevo estado para controlar la renderización en cliente

  const carreras = [
    "Contaduría",
    "Medicina",
    "Ing. en Electrónica",
    "Fisioterapia",
    "Odontología",
    "Ing. de Sistemas",
    "Ing. Agrónoma",
    "Derecho",
    "Enfermería",
  ];

  useEffect(() => {
    setMounted(true); // Establecer como montado en cliente
  }, []);

  const handleCloseModal = () => {
    setIsOpen(false); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDocument) {
      const newItem = {
        id: selectedDocument.id,
        nombre: selectedDocument.nombre,
        tipoDocumento: selectedDocument.tipoDocumento,
        tipoPapel: selectedDocument.tipoPapel,
        cantidad,
        carrera,
        precio: selectedDocument.precio * cantidad,
      };

      addToCart(newItem);
      handleCloseModal();
    }
  };

  // Asegurarse de que el modal solo se renderice en el cliente
  if (!mounted || !isOpen || !selectedDocument) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">
          {selectedDocument.nombre}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la cantidad"
              min={1}
              required
            />
          </div>

          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">
              Carrera
            </label>
            <select
              id="carrera"
              name="carrera"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Seleccione una carrera
              </option>
              {carreras.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
