"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useGlobalState } from "@/context/GlobalStateContext"; // Importamos el contexto
import UserComponent from "@/components/UserComponents";

export default function SuperUsuario() {
  return (
    <div className="p-6 mx-auto">
      <UserComponent/>
    </div>
  );
}
