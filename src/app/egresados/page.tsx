"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import TablaTramites from "@/components/TablaTramites";

// Interfaces para los datos
interface FormData {
  nombreSolicitante: string;
  nombreDocumento: string;
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
  nombreDocumento: string;
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
    nombreDocumento: "",
    tipoDocumento: tiposDocumento[0],
    tipoPapel: tiposPapel[0],
    carrera: "",
    cantidad: 1,
    numeroTransferencia: "",
    monto: 0, // Inicializar monto con 0
  });

  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener trámites desde la base de datos
  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const res = await axios.get("/api/tramites");
        setTramites(res.data);
        console.log(res.data)
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
      const codigoUnico = Math.floor(10000 + Math.random() * 90000).toString();
      const tramite = { codigo: codigoUnico, ...formData };

      // Enviar el trámite al backend
      await axios.post("/api/tramites", tramite);

      // Actualizar la lista de trámites
      const res = await axios.get("/api/tramites");
      setTramites(res.data);

      alert("Trámite creado correctamente.");

      // Resetear el formulario
      setFormData({
        nombreSolicitante: "",
        nombreDocumento: "",
        tipoDocumento: tiposDocumento[0],
        tipoPapel: tiposPapel[0],
        carrera: "",
        cantidad: 1,
        numeroTransferencia: "",
        monto: 0,
      });
    } catch (error) {
      console.error("Error al crear el trámite:", error);
      alert("Hubo un error al crear el trámite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Trámite</h1>
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
        <input
          type="text"
          name="nombreDocumento"
          placeholder="Nombre del documento"
          value={formData.nombreDocumento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
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
        <input
          type="text"
          name="numeroTransferencia"
          placeholder="Número de transferencia"
          value={formData.numeroTransferencia}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="monto"
          placeholder="Monto pagado"
          value={formData.monto}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
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
    </div>
  );
}
