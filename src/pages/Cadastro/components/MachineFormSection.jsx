import React from "react";
import { Grid, Typography } from "@mui/material";
import FormField from "../components/FormField";

const statusOptions = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "CANCELED", label: "Inativo" },
  { value: "SUSPENDED", label: "Em Manutenção" },
];

const machineFields = [
  {
    name: "name",
    label: "Nome da Máquina",
    placeholder: "Ex: Torno CNC Setor A",
    description: "Identificação do equipamento",
    required: true,
    xs: 12,
  },
  {
    name: "serialNumber",
    label: "Número de Série",
    placeholder: "Ex: SN-2024-ABC-12345",
    description: "Número único do fabricante",
    required: true,
    xs: 12,
  },
  {
    name: "manufacturer",
    label: "Fabricante",
    placeholder: "Ex: Siemens",
    description: "Nome do fabricante",
    required: true,
    xs: 12,
    sm: 3,
  },
  {
    name: "model",
    label: "Modelo",
    placeholder: "Ex: CNC-5000X",
    description: "Modelo do equipamento",
    required: true,
    xs: 12,
    sm: 3,
  },
  {
    name: "status",
    label: "Status",
    description: "Situação operacional",
    required: true,
    sm: 3,
    select: true,
    options: statusOptions,
  },
];

const MachineFormSection = ({ formData, onChange, formErrors = {} }) => (
  <>
    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
      Informações básicas da máquina industrial
    </Typography>

    <Grid container spacing={4}>
      {machineFields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          value={formData[field.name]}
          onChange={onChange}
          error={formErrors[field.name]}
          helperText={formErrors[field.name] ? "Campo obrigatório" : ""}
        />
      ))}
    </Grid>
  </>
);

export default MachineFormSection;