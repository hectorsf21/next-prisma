"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import TablaTramites from "@/components/TablaTramites";
import TablaPrecios from "@/components/TablaPrecios";
import { FiShoppingCart } from "react-icons/fi";
import FormularioCarrito from "@/components/FormularioCarrito";
import { useGlobalState } from "@/context/GlobalStateContext";
import Link from "next/link";

// Interfaces para los datos
interface FormData {
  nombreSolicitante: string;
  tipoDocumento: string;
  tipoPapel: string;
  carrera: string;
  cantidad: number;
  numeroTransferencia: string;
  monto: number;
}

interface Tramite {
  id: number;
  codigo: string;
  nombreSolicitante: string;
  tipoDocumento: string;
  tipoPapel: string;
  carrera: string;
  cantidad: number;
  numeroTransferencia: string;
  monto: number;
  status: string;
  createdAt: string;
}

// Opciones para selectores
const tiposDocumento = ["NACIONAL", "INTERNACIONAL"];
const tiposPapel = ["PAPEL SIMPLE", "PAPEL DE SEGURIDAD"];

// Componente del formulario
export default function CrearTramite() {
  const [formData, setFormData] = useState<FormData>({
    nombreSolicitante: "",
    tipoDocumento: tiposDocumento[0],
    tipoPapel: tiposPapel[0],
    carrera: "",
    cantidad: 1,
    numeroTransferencia: "",
    monto: 0, 
  });

  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener datos del carrito del estado global
  const { cart } = useGlobalState();

  // Obtener trámites desde la base de datos
  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const res = await axios.get("/api/tramites");
        setTramites(res.data);
        // console.log(res.data);
      } catch (error) {
        console.error("Error al obtener los trámites:", error);
      }
    };

    fetchTramites();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad" || name === "monto" ? Number(value) : value, // Convertir cantidad y monto a número
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Generar automáticamente un código único para el trámite
      const codigoUnico = Math.floor(10000 + Math.random() * 90000).toString();
  
      // Crear el objeto del trámite con un arreglo vacío para documentos
      const tramite = {
        codigo: codigoUnico, // Código único generado automáticamente
        nombreSolicitante: formData.nombreSolicitante,
        numeroTransferencia: formData.numeroTransferencia,
        monto: formData.monto,
        documentos: [], // Arreglo vacío para pruebas
      };
  
      // Enviar el trámite al backend
      await axios.post("/api/tramites", tramite);
  
      alert("Trámite de prueba creado correctamente.");
  
      // Resetear el formulario después de enviarlo
      setFormData({
        nombreSolicitante: "",
        tipoDocumento: tiposDocumento[0],
        tipoPapel: tiposPapel[0],
        carrera: "",
        cantidad: 1,
        numeroTransferencia: "",
        monto: 0,
      });
    } catch (error) {
      console.error("Error al crear el trámite de prueba:", error);
      alert("Hubo un error al crear el trámite de prueba.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Nav pegajoso */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo o Título */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="text-blue-500">SOLI</span>CITUDES
              </h1>
            </div>

            {/* Menú de Navegación */}
            <div className="hidden md:flex space-x-8">
              <Link
                href="coordinacion"
                className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                COORDINACION
              </Link>

              <Link href="fundesurg"
                className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                FUNDESUR
                </Link>
                <Link
                href="superusuario"
                className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                SUPERUSUARIO
                </Link>
            </div>

            {/* Ícono del carrito */}
            <Link href={'/compras'}>
            <div className="relative">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                <FiShoppingCart size={24} className="text-gray-800" />
              </button>

              {/* Indicador de cantidad de productos */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {cart.length} {/* Mostrar la cantidad de productos */}
              </span>
            </div>
            </Link>
          </div>
        </div>
      </nav>

      <h1 className="text-center text-2xl font-bold mb-4">Crear Trámite</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombreSolicitante"
          placeholder="Nombre del solicitante"
          value={formData.nombreSolicitante}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <h2 className="font-bold">Tipo de documento</h2>
        <select
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {tiposDocumento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <h2 className="font-bold">Tipo de papel</h2>
        <select
          name="tipoPapel"
          value={formData.tipoPapel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {tiposPapel.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="carrera"
          placeholder="Carrera"
          value={formData.carrera}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <h2 className="font-bold">Cantidad</h2>
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="1"
          required
        />
        <h2 className="font-bold">Numero de transferencia</h2>
        <input
          type="text"
          name="numeroTransferencia"
          placeholder="Número de transferencia"
          value={formData.numeroTransferencia}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <h2 className="font-bold">Monto</h2>
        <input
          type="number"
          name="monto"
          placeholder="Monto pagado"
          value={formData.monto}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Trámite"}
        </button>
      </form>

      <TablaTramites tramites={tramites} />
      <TablaPrecios />
      <FormularioCarrito />
    </div>
  );
}
