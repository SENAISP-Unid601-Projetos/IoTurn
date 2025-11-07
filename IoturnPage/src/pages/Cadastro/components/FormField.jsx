import React from "react";
import {
  TextField,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import theme from "../../../theme";

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  description,
  required = false,
  borderRadius = "15px",
  xs = 12,
  sm,
  md,
  lg,
  select = false,
  options = [],
  ...props
}) => {
  const inputBaseStyle = {
    borderRadius: borderRadius,
    height: 42,
    fontSize: "0.95rem",
    "& input, & .MuiSelect-select": {
      padding: "8px 14px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.divider,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.dark,
    },
  };

  // -------------------
  // CASO 1: SELECT
  // -------------------
const renderSelect = () => (
  <FormControl fullWidth>
    <Select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      sx={inputBaseStyle}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: theme.palette.background.default,
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            mt: 0.5,
          },
        },
      }}
      {...props}
    >
      {placeholder && (
        <MenuItem value="" disabled>
          <em>{placeholder}</em>
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "transparent",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

  // -------------------
  // CASO 2: TEXTFIELD
  // -------------------
  const renderTextField = () => (
    <TextField
      fullWidth
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      InputProps={{
        sx: inputBaseStyle,
      }}
      {...props}
    />
  );

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="subtitle1"
          component="label"
          htmlFor={name}
          sx={{
            fontWeight: 600,
            display: "block",
            mb: 0.5,
          }}
        >
          {label}{" "}
          {required && (
            <Box component="span" sx={{ color: "error.main" }}>
              *
            </Box>
          )}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "block", mb: 1.5 }}
          >
            {description}
          </Typography>
        )}

        {select ? renderSelect() : renderTextField()}
      </Box>
    </Grid>
  );
};

export default FormField;
