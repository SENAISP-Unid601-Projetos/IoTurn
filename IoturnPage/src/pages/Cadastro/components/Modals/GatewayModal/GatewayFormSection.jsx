import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const statusOptions = [
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
  { value: "Manutencao", label: "Em Manutenção" },
];

const GatewayFormSection = ({ formData, handleChange }) => (
  <Grid container spacing={4}>
    <Grid item xs={6}>
      <FormField
        label="Gateway ID"
        name="gatewayId"
        value={formData.gatewayId}
        onChange={handleChange}
        placeholder="Ex: ESP32-GW-A1B2C3D4E5F6"
        description="ID único do hardware (Chip ID do ESP32)"
        required
      />
    </Grid>

    <Grid item xs={6}>
      <FormField
        label="Status Inicial"
        name="status"
        value={formData.status}
        onChange={handleChange}
        description="Estado do gateway"
        required
        select
        options={statusOptions}
      />
    </Grid>

    <Grid item xs={12}>
      <FormField
        label="Descrição / Localização"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Ex: Gateway do Setor A"
        description="Localização física ou identificação adicional (opcional)"
      />
    </Grid>
  </Grid>
);

export default GatewayFormSection;