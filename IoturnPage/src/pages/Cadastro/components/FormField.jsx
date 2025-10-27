// No seu novo arquivo, ex: src/components/FormField.js
import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import theme from '../../../theme';

/**
 * Um componente de campo de formulário reutilizável
 * que inclui label, descrição e o input.
 */
const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  description,
  required = false,
  ...props // Para passar outras props (ex: type, multiline, etc.)
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* 1. Label (Nome da Máquina) */}
      <Typography
        variant="subtitle1"
        component="label"
        htmlFor={name}
        sx={{
          fontWeight: 600,
          display: 'block',
          mb: 0.5,
        }}
      >
        {label}{' '}
        {required && (
          // O asterisco vermelho de "obrigatório"
          <Box component="span" sx={{ color: 'error.main' }}>
            *
          </Box>
        )}
      </Typography>

      {/* 2. Descrição (Identificação do equipamento) */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'block', mb: 1.5 }}
        >
          {description}
        </Typography>
      )}

      {/* 3. O Input (TextField do MUI) */}
      <TextField
        fullWidth
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        {...props}
      />
    </Box>
  );
};

export default FormField;