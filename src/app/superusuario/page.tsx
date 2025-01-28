"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import FormDocument from "@/components/FormDocument";
import TablaDocument from "@/components/TablaDocument";
import TablaUsuario from "@/components/TablaUsuario";
import FormUsuario from "@/components/FormUsuario";
import TramitesComponent from "@/components/TramitesComponents";

// CREACION DE USUARIOS
// Interfaces para tipar datos
interface User {
  id: number;
  name: string;
  email: string;
  role: string | object; // Role puede ser string o JSON
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


const roles = ["SUPERUSUARIO", "COORDINACION", "FUNDEURG", "SOLICITANTE"];

interface FormData {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string | object; // Campo para rol
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
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// CREACION DE DOCUMENTOS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const tiposDocumento = ["NACIONAL", "INTERNACIONAL"];
const tiposPapel = ["PAPEL BLANCO", "PAPEL SEGURIDAD"];

interface DocumentFormData {
  nombreDocumento: string;
  tipoDocumento: string;
  tipoPapel: string;
  precio: string;
}

interface Documento {
  id: number;
  nombre: string;
  tipoDocumento: string;
  tipoPapel: string;
  precio: number;
}

// Componente principal del CRUD
export default function SuperUsuario() {

  // ESTADO DE DATOS DE LOS USUARIOS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: roles[3], // Rol predeterminado: "SOLICITANTE"
    permisosSolicitudes: {
      verNoValidas: false,
      verValidarEntrega: false,
      verEntregadas: false,
    },
    permisosReportes: {
      reportesFinancieros: false,
      reportesSolicitudes: false,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// ESTADO DE DATOS DE LOS DOCUMENTOS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const [documents, setDocuments] = useState<Documento[]>([]);
const [loadingDocuments, setLoadingDocuments] = useState(false);
const [documentFormData, setDocumentFormData] = useState<DocumentFormData>({
  nombreDocumento: "",
  tipoDocumento: tiposDocumento[0],
  tipoPapel: tiposPapel[0],
  precio: "",
});

const [loadingDocument, setLoadingDocument] = useState(false);
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// FUNCIONALIDADES DEL COMPONENTE FORMDOCUMENT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const handleDocumentChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setDocumentFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// Manejar el envío del formulario de documentos
const handleDocumentSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoadingDocument(true);

  try {
    // Enviar los datos al backend usando axios
    const response = await axios.post("/api/documentos", {
      nombre: documentFormData.nombreDocumento,
      tipoDocumento: documentFormData.tipoDocumento,
      tipoPapel: documentFormData.tipoPapel,
      precio: parseFloat(documentFormData.precio), // Convertir el precio a número
    });

    console.log("Respuesta del backend:", response.data);
    await fetchDocuments();
    // Resetear el formulario después de enviarlo
    setDocumentFormData({
      nombreDocumento: "",
      tipoDocumento: tiposDocumento[0],
      tipoPapel: tiposPapel[0],
      precio: "",
    });
  } catch (error) {
    console.error("Error al enviar el formulario de documentos:", error);
  } finally {
    setLoadingDocument(false);
  }
};

//  CARGA DE USUARIOS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
      console.log('fetch es:', res.data)
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  //  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


  // CARGA DE DOCUMENTOS QUE VAN AL COMPONENTE HIJO TABLADOCUMENT XXXXXXXXXXXXXXXXXXXXXXX
  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await axios.get("/api/documentos");
      setDocuments(response.data); // Almacena los documentos obtenidos
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Obtener documentos al montar el componente
  useEffect(() => {
    fetchDocuments();
  }, []);
  // TERMINA CARGA DE DOCUMENTOS QUE VAN AL COMPONENTE HIJO TABLADOCUMENT XXXXXXXXXXXXXXXXXXXXXXX


  // CRUD USUARIOS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // Manejar los cambios del formulario
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      const { checked } = target as HTMLInputElement;
      const [category, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category as keyof FormData] as Record<string, boolean>),
          [field]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejar la creación o actualización del usuario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('formData es:',formData)
    try {
      if (isEditing && formData.id) {
        await axios.put(`/api/users?id=${formData.id}`, formData);
      } else {
        // Crear nuevo usuario
        await axios.post("/api/users", formData);
      }
      fetchUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: roles[3],
        permisosSolicitudes: {
          verNoValidas: false,
          verValidarEntrega: false,
          verEntregadas: false,
        },
        permisosReportes: {
          reportesFinancieros: false,
          reportesSolicitudes: false,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la edición de un usuario
  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permisosSolicitudes: user.permisosSolicitudes || {
        verNoValidas: false,
        verValidarEntrega: false,
        verEntregadas: false,
      },
      permisosReportes: user.permisosReportes || {
        reportesFinancieros: false,
        reportesSolicitudes: false,
      },
    });
    setIsEditing(true);
  };

  // Manejar la eliminación de un usuario
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`/api/users?id=${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };
// TERMINA CRUD USUARIOS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX




// CRUD DE DOCUMENTOS COMIENZA XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const handleEditDocument = (document: Documento) => {
  setDocumentFormData({
    nombreDocumento: document.nombre, 
    tipoDocumento: document.tipoDocumento,
    tipoPapel: document.tipoPapel,
    precio: document.precio.toString(), 
  });
};

const handleDeleteDocument = async (id: number) => {
  try {
    await axios.delete(`/api/documentos?id=${id}`);
    fetchDocuments(); // Vuelve a cargar los documentos después de eliminarlos
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
  }
};

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX




  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      {/* Formulario */}
      <FormUsuario
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isEditing={isEditing}
      loading={loading}
      roles={roles}
/>

      {/* Tabla */}
      <TablaUsuario users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="mt-12">
      <FormDocument
        formData={documentFormData}
        handleChange={handleDocumentChange}
        handleSubmit={handleDocumentSubmit}
        loading={loadingDocument}
        tiposDocumento={tiposDocumento}
        tiposPapel={tiposPapel}
      />
      <TablaDocument 
        documents={documents}
        loading={loadingDocuments}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
       />
      </div>
      {/* CRUD TRAMITES */}
      <TramitesComponent/>
    </div>
  );
}
