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

export interface Tramite {
  id: number;
  codigo: string;
  nombreSolicitante: string;
  numeroTransferencia: string;
  monto: number;
  status: string;
  statusHistory: { status: string; fecha: string }[];
  createdAt: string;
  updatedAt: string;
  page: number;
  pagesize: number;
  documentos: Documento[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string | object;
  permisosSolicitudes?: {
    verNoValidas: boolean;
    verValidarEntrega: boolean;
    verEntregadas: boolean;
  };
  permisosReportes?: {
    reportesFinancieros: boolean;
    reportesSolicitudes: boolean;
  };
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
  users: User[]; // Nuevo estado para usuarios
  fetchUsers: () => void; // Nueva función para obtener usuarios
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });
  const [selectedDocument, setSelectedDocument] = useState<Documento | null>(null);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Nuevo estado para usuarios

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

// FUNCION PARA OBETENER LOS TRAMITES VERSION VIEJA
const fetchTramites = async () => {
  try {
    const response = await axios.get("/api/test");
    const parsedTramites = response.data.map((tramite: Tramite) => ({
      ...tramite,
      statusHistory:
        typeof tramite.statusHistory === "string"
          ? JSON.parse(tramite.statusHistory)
          : tramite.statusHistory,
    }));

    // console.log(parsedTramites); // Para depuración
    setTramites(parsedTramites);
  } catch (error) {
    console.error("Error al obtener los trámites:", error);
  }
};

// // FUNCION PARA OBETENER LOS TRAMITES VERSION NUEVA
// const fetchTramites = async (page: number = 1, pageSize: number = 10) => {
//   try {
//     const response = await axios.get("/api/test", {
//       params: { page, pageSize },
//     });

//     const parsedTramites = response.data.tramites.map((tramite: Tramite) => ({
//       ...tramite,
//       statusHistory:
//         typeof tramite.statusHistory === "string"
//           ? JSON.parse(tramite.statusHistory)
//           : tramite.statusHistory,
//     }));

//     console.log(parsedTramites); // Para depuración
//     setTramites(parsedTramites);
//   } catch (error) {
//     console.error("Error al obtener los trámites:", error);
//   }
// };



  // Función para obtener los usuarios desde la API
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
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

  // Llama a fetchDocuments, fetchTramites y fetchUsers al cargar el componente
  useEffect(() => {
    fetchDocuments();
    fetchTramites();
    fetchUsers();
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
        users, // Nuevo estado para usuarios
        fetchUsers, // Nueva función para obtener usuarios
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