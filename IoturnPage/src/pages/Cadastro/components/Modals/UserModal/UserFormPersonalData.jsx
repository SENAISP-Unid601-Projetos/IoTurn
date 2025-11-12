import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const UserFormPersonalData = ({ formData, onChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormField
          label="Nome Completo"
          name="name"
          value={formData.fullName}
          onChange={onChange}
          placeholder="Ex: João Silva"
          required
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label="E-mail"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Ex: joao.silva@empresa.com"
          required
        />
      </Grid>
    </Grid>
  );
};

export default UserFormPersonalData;