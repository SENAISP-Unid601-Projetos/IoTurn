import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const statusOptions = [
  { value: "PROVISIONING", label: "Provisionamento" },
  { value: "ONLINE", label: "Ativo" },
  { value: "OFFLINE", label: "Inativo" },
];

const DispositivoFormSection = ({ formData, handleChange, formErrors = {} }) => (
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
      error={!!formErrors.nodeId}
      helperText={formErrors.nodeId || ""}
    />

    <FormField
      xs={12}
      label="Descrição / Localização"
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Ex: Sensor Setor A"
      description="Localização física ou identificação adicional"
      required
      error={!!formErrors.description}
      helperText={formErrors.description || ""}
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