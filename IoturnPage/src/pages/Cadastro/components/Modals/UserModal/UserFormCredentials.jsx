import React from "react";
import { Grid } from "@mui/material";
import FormField from "../../../components/FormField";

const UserFormCredentials = ({
  formData,
  onChange,
  psswdBody,
  formErrors = {},
}) => {
  const helperTextPassword = psswdBody.response || formErrors.password || "";
  const helperTextConfirm =
    psswdBody.response || formErrors.confirmPassword || "";

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Senha"
          name="password"
          value={formData.password}
          error={!!formErrors.password}
          helperText={helperTextPassword}
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
          error={!!formErrors.confirmPassword}
          helperText={helperTextConfirm}  
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
