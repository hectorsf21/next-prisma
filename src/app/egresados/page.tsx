"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import TablaPrecios from "@/components/TablaPrecios";
import { FiShoppingCart } from "react-icons/fi";
import FormularioCarrito from "@/components/FormularioCarrito";
import { useGlobalState } from "@/context/GlobalStateContext";
import Link from "next/link";

// Componente principal
export default function Page() {
  const { cart } = useGlobalState();

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

              <Link
                href="fundesurg"
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
            <Link href={"/compras"}>
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

      {/* Tabla de precios */}
      <TablaPrecios />

      {/* Formulario del carrito */}
      <FormularioCarrito />
    </div>
  );
}
