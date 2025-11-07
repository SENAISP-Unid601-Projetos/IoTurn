import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const statusOptions = [
  { value: "Provisionamento", label: "Provisionamento" },
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const DispositivoFormSection = ({ formData, handleChange }) => (
  <Grid container spacing={3}>
    <FormField
      xs={12}
      label="Node ID"
      name="nodeId"
      value={formData.nodeId}
      onChange={handleChange}
      placeholder="Ex: HELTEC-A8F3B2"
      description="Identificador único do dispositivo"
      required
    />

    <FormField
      xs={12}
      label="Descrição / Localização"
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Ex: Sensor Setor A"
      description="Localização física (opcional)"
    />

    <FormField
      xs={12}
      label="Status Inicial"
      name="status"
      value={formData.status}
      onChange={handleChange}
      description="Estado no momento do cadastro"
      required
      select
      options={statusOptions}
    />
  </Grid>
);

export default DispositivoFormSection;