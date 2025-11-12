import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const userTypes = [
  { value: "VIEWER", label: "Visualizador" },
  { value: "TECHNICIAN", label: "Técnico" },
  { value: "ADMIN", label: "Administrador" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "CANCELED", label: "Inativo" },
  { value: "SUSPENDED", label: "Suspenso" },
];

const UserFormPermissions = ({ formData, onChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Tipo de Usuário"
          name="userType"
          value={formData.userType}
          onChange={onChange}
          select
          options={userTypes}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Status"
          name="status"
          value={formData.status}
          onChange={onChange}
          select
          options={statusOptions}
          required
        />
      </Grid>
    </Grid>
  );
};

export default UserFormPermissions;