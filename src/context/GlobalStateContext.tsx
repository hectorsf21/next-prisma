"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface Documento {
  id: number;
  nombre: string;
  tipoDocumento: string;
  tipoPapel: string;
  precio: number;
}

interface CartItem {
  id: number;
  nombre: string;
  tipoDocumento: string;
  tipoPapel: string;
  cantidad: number;
  carrera: string;
  precio: number;
}

interface GlobalStateContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  documents: Documento[];
  fetchDocuments: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  selectedDocument: Documento | null;
  setSelectedDocument: (doc: Documento | null) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado booleano global
  const [documents, setDocuments] = useState<Documento[]>([]); // Estado para documentos
  const [cart, setCart] = useState<CartItem[]>([]); // Estado del carrito
  const [loading, setLoading] = useState(true); // Bandera para evitar renderizados prematuros
  const [selectedDocument, setSelectedDocument] = useState<Documento | null>(null); // Documento seleccionado

  // Cargar el carrito desde localStorage al inicializar
  useEffect(() => {
    const storedCart = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setLoading(false); // Marcar como cargado
  }, []);

  // Sincronizar el carrito con localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Función para obtener los documentos desde la API
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documentos");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    }
  };

  // Función para agregar un elemento al carrito
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  // Función para eliminar un elemento del carrito por su ID
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Función para limpiar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Llamar a fetchDocuments al cargar el componente
  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return null; // Evitar renderizar hasta que el carrito esté sincronizado
  }

  return (
    <GlobalStateContext.Provider
      value={{
        isOpen,
        setIsOpen,
        documents,
        fetchDocuments,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        selectedDocument,
        setSelectedDocument,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState debe ser usado dentro de GlobalStateProvider");
  }
  return context;
};
