"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useGlobalState } from "@/context/GlobalStateContext";

export default function Compras() {
  const { cart, removeFromCart, clearCart } = useGlobalState();

  if (cart.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Carrito de Compras</h2>
        <p className="text-center text-gray-500">El carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Carrito de Compras</h2>

      {/* Botón para Vaciar Carrito */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={clearCart}
          className="flex items-center text-red-500 hover:text-red-700"
        >
          <FiTrash2 size={20} className="mr-2" />
          Vaciar Carrito
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
          {cart.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
