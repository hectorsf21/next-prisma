"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { FiTrash2, FiCreditCard, FiX } from "react-icons/fi";
import { useGlobalState } from "@/context/GlobalStateContext";
import axios from "axios";
import jsPDF from "jspdf";
import Image from "next/image";

export default function Compras() {
  const { cart, removeFromCart, clearCart } = useGlobalState();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codigoUnico, setCodigoUnico] = useState("");
  const [paymentData, setPaymentData] = useState({
    nombreSolicitante: "",
    numeroTransferencia: "",
    banco: "",
  });

  // Lista de bancos de Venezuela
  const bancosVenezuela = [
    "Banco de Venezuela",
    "Banco del Tesoro",
    "Banco Bicentenario",
    "Banco Central de Venezuela (BCV)",
    "Banco Nacional de Crédito (BNC)",
    "Banesco Banco Universal",
    "Banco Mercantil",
    "Banco Provincial (BBVA Provincial)",
    "Banco Exterior",
    "Banco Occidental de Descuento (BOD)",
    "Banco Sofitasa",
    "Banco Plaza",
    "Banco Activo",
    "Banco Caroní",
    "Banco Venezolano de Crédito",
    "Bancrecer",
    "Mi Banco",
    "Banco del Sur",
    "100% Banco",
    "Bangente",
    "Banplus Banco Universal",
  ];

  // Calcular el monto total
  const montoTotal = cart.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);

  // Abrir/cerrar modal
  const togglePaymentModal = () => {
    setIsPaymentModalOpen(!isPaymentModalOpen);
  };

  // Manejo de cambios en el formulario
  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para generar el PDF con el código único y monto total
  const generarPDF = (codigo: string) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Comprobante de Pago", 20, 20);

    doc.setFontSize(12);
    doc.text(`Código de Solicitud: ${codigo}`, 20, 30);
    doc.text(`Nombre: ${paymentData.nombreSolicitante}`, 20, 40);
    doc.text(`Número de Transferencia: ${paymentData.numeroTransferencia}`, 20, 50);
    doc.text(`Banco: ${paymentData.banco}`, 20, 60);
    doc.text(`Monto Total: ${montoTotal} BS`, 20, 70);

    doc.text("Documentos Comprados:", 20, 90);
    let y = 100;
    cart.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.nombre} - ${item.tipoDocumento} - ${item.cantidad} unidad(es)`, 20, y);
      y += 10;
    });

    doc.setFontSize(10);
    doc.text("Este comprobante es válido para trámites internos.", 20, y + 10);

    doc.save(`Comprobante_${codigo}.pdf`);
  };

  // Manejo del envío del formulario
  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (cart.length === 0) {
        alert("El carrito está vacío. Agregue documentos antes de pagar.");
        setLoading(false);
        return;
      }

      const tramiteData = {
        nombreSolicitante: paymentData.nombreSolicitante,
        numeroTransferencia: paymentData.numeroTransferencia,
        banco: paymentData.banco,
        monto: parseFloat(montoTotal),
        documentos: cart.map((item) => ({
          nombre: item.nombre,
          tipoDocumento: item.tipoDocumento,
          tipoPapel: item.tipoPapel,
          precio: item.precio,
          cantidad: item.cantidad,
          carrera: item.carrera,
        })),
      };

      // Enviar datos al backend
      const response = await axios.post("/api/tramites", tramiteData);

      if (response.status === 201) {
        const { codigo } = response.data;
        setCodigoUnico(codigo);
        alert("Trámite creado correctamente. Código: " + codigo);

        generarPDF(codigo);

        clearCart();
        setPaymentData({ nombreSolicitante: "", numeroTransferencia: "", banco: "" });
        togglePaymentModal();
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

      {/* Botón para Vaciar Carrito y Realizar Pago */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={clearCart} className="flex items-center text-red-500 hover:text-red-700">
          <FiTrash2 size={20} className="mr-2" /> Vaciar Carrito
        </button>
        <button onClick={togglePaymentModal} className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          <FiCreditCard size={20} className="mr-2" /> Realizar Pago
        </button>
      </div>

      
            {/* Tabla de documentos en el carrito */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Documento</th>
                    <th className="border border-gray-300 px-4 py-2">Tipo</th>
                    <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                    <th className="border border-gray-300 px-4 py-2">Precio Total</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{item.nombre}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.tipoDocumento}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.cantidad}</td>
                      <td className="border border-gray-300 px-4 py-2">{(item.precio * item.cantidad).toFixed(2)} BS</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      
            <div className="mt-4 flex justify-between">
              <p className="text-lg font-bold">Monto Total a Pagar: {montoTotal} BS</p>
            </div>

     {/* Modal de Pago */}
{isPaymentModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
      <button 
        onClick={togglePaymentModal} 
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <FiX size={24} />
      </button>

      {/* Encabezado */}
      <h2 className="text-gray-700 text-2xl text-center font-bold mb-4">Datos para realizar pago</h2>
      <Image className="mb-4" src="/img/logo_banco.svg" alt="Logo del Banco" width={100} height={50} />
      {/* Tabla con Datos Bancarios */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse border border-gray-200 rounded-lg shadow">
          <tbody>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-semibold">Banco</td>
              <td className="border border-gray-300 px-4 py-2">Banco de Venezuela</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">RIF:</td>
              <td className="border border-gray-300 px-4 py-2">J-34252</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-semibold">Número de Cuenta:</td>
              <td className="border border-gray-300 px-4 py-2">0102-29494-24-4439</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">A Nombre de:</td>
              <td className="border border-gray-300 px-4 py-2">UNIVERSIDAD ROMULO GALLEGOS</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Formulario de Pago */}
      <h2 className="text-xl text-gray-600 font-bold mt-6 mb-4 text-center">Realizar Pago</h2>
      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <input
          type="text"
          name="nombreSolicitante"
          value={paymentData.nombreSolicitante}
          onChange={handlePaymentChange}
          placeholder="Nombre del Solicitante"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          required
        />
        <input
          type="text"
          name="numeroTransferencia"
          value={paymentData.numeroTransferencia}
          onChange={handlePaymentChange}
          placeholder="Número de Transferencia"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          required
        />

        {/* Selector de Banco */}
        <select
          name="banco"
          value={paymentData.banco}
          onChange={handlePaymentChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          required
        >
          <option value="">Seleccione un banco</option>
          {bancosVenezuela.map((banco, index) => (
            <option key={index} value={banco}>
              {banco}
            </option>
          ))}
        </select>

        {/* Botón de Confirmación */}
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-3 px-4 rounded-lg w-full font-semibold hover:bg-blue-600 transition"
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
