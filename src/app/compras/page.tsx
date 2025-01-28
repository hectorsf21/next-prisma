"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { FiTrash2, FiCreditCard, FiX } from "react-icons/fi";
import { useGlobalState } from "@/context/GlobalStateContext";
import axios from "axios";

export default function Compras() {
  const { cart, removeFromCart, clearCart } = useGlobalState();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [paymentData, setPaymentData] = useState({
    nombreSolicitante: "",
    numeroTransferencia: "",
    monto: "",
  });

  // Abrir o cerrar el modal
  const togglePaymentModal = () => {
    setIsPaymentModalOpen(!isPaymentModalOpen);
  };

  // Manejar cambios en los campos del formulario
  const handlePaymentChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario de pago
  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar que haya documentos en el carrito
      if (cart.length === 0) {
        alert(
          "El carrito está vacío. Por favor, agregue documentos antes de realizar el pago."
        );
        setLoading(false);
        return;
      }

      // Estructurar los datos para la petición
      const tramiteData = {
        nombreSolicitante: paymentData.nombreSolicitante,
        numeroTransferencia: paymentData.numeroTransferencia,
        monto: parseFloat(paymentData.monto), // Asegurar que sea número
        documentos: cart.map((item) => ({
          nombre: item.nombre,
          tipoDocumento: item.tipoDocumento,
          tipoPapel: item.tipoPapel,
          precio: item.precio,
          cantidad: item.cantidad,
          carrera: item.carrera,
        })),
      };

      // Enviar los datos al backend
      const response = await axios.post("/api/tramites", tramiteData);

      if (response.status === 201) {
        alert("Trámite creado correctamente.");
        // Limpiar el carrito y el formulario
        clearCart();
        setPaymentData({
          nombreSolicitante: "",
          numeroTransferencia: "",
          monto: "",
        });
        togglePaymentModal(); // Cerrar el modal
      } else {
        alert("Hubo un error al crear el trámite.");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
      alert("Error al realizar el trámite. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Carrito de Compras</h2>

      {/* Botón para Vaciar Carrito */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={clearCart}
          className="flex items-center text-red-500 hover:text-red-700"
        >
          <FiTrash2 size={20} className="mr-2" />
          Vaciar Carrito
        </button>
        <button
          onClick={togglePaymentModal}
          className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          <FiCreditCard size={20} className="mr-2" />
          Realizar Pago
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nombre del Documento</th>
              <th className="border border-gray-300 px-4 py-2">Tipo de Documento</th>
              <th className="border border-gray-300 px-4 py-2">Tipo de Papel</th>
              <th className="border border-gray-300 px-4 py-2">Cantidad</th>
              <th className="border border-gray-300 px-4 py-2">Carrera</th>
              <th className="border border-gray-300 px-4 py-2">Precio Total</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{item.tipoDocumento}</td>
                <td className="border border-gray-300 px-4 py-2">{item.tipoPapel}</td>
                <td className="border border-gray-300 px-4 py-2">{item.cantidad}</td>
                <td className="border border-gray-300 px-4 py-2">{item.carrera}</td>
                <td className="border border-gray-300 px-4 py-2">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <p className="text-lg font-bold">
          Total: $
          {cart.reduce(
            (total, item) => total + item.precio * item.cantidad,
            0
          ).toFixed(2)}
        </p>
      </div>

      {/* Modal para realizar pago */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
            {/* Botón de cerrar modal */}
            <button
              onClick={togglePaymentModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Realizar Pago</h2>
            <p className="mb-2 text-sm">Banco: Banco Ejemplo</p>
            <p className="mb-2 text-sm">RIF: J-12345678-9</p>
            <p className="mb-2 text-sm">Tipo de Cuenta: Corriente</p>
            <p className="mb-4 text-sm">Número de Cuenta: 0123-4567-8901-2345</p>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nombreSolicitante"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre del Solicitante
                </label>
                <input
                  type="text"
                  id="nombreSolicitante"
                  name="nombreSolicitante"
                  value={paymentData.nombreSolicitante}
                  onChange={handlePaymentChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="numeroTransferencia"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de Transferencia
                </label>
                <input
                  type="text"
                  id="numeroTransferencia"
                  name="numeroTransferencia"
                  value={paymentData.numeroTransferencia}
                  onChange={handlePaymentChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  value={paymentData.monto}
                  onChange={handlePaymentChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar Pago"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
