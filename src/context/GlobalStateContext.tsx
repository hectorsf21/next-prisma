"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
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

interface Tramite {
  id: number;
  codigo: string;
  nombreSolicitante: string;
  numeroTransferencia: string;
  monto: number;
  status: string;
  statusHistory: { status: string; fecha: string }[];
  createdAt: string;
  updatedAt: string;
  documentos: Documento[];
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
  tramites: Tramite[];
  fetchTramites: () => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado booleano global
  const [documents, setDocuments] = useState<Documento[]>([]); // Estado para documentos
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  const [selectedDocument, setSelectedDocument] = useState<Documento | null>(null); // Estado para documento seleccionado
  const [tramites, setTramites] = useState<Tramite[]>([]); // Estado para trámites

  // Sincronizar el carrito con localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Función para obtener los documentos desde la API
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documentos");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    }
  };

  // Función para obtener los trámites desde la API
  const fetchTramites = async () => {
    try {
      const response = await axios.get("/api/tramites");
      setTramites(response.data);
    } catch (error) {
      console.error("Error al obtener los trámites:", error);
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

  // Llama a fetchDocuments y fetchTramites al cargar el componente
  useEffect(() => {
    fetchDocuments();
    fetchTramites();
  }, []);

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
        tramites,
        fetchTramites,
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