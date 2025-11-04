import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const UserFormCredentials = ({ formData, onChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Senha"
          name="password"
          value={formData.password}
          onChange={onChange}
          type="password"
          placeholder="••••••••"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Confirmar Senha"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          type="password"
          placeholder="••••••••"
          required
        />
      </Grid>
    </Grid>
  );
};

export default UserFormCredentials;