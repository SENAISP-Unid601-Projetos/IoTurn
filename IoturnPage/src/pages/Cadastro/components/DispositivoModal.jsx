import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { Settings } from "lucide-react";
import FormField from "./FormField";
import theme from "../../../theme";

const statusOptions = [
  { value: "Provisionamento", label: "Provisionamento" },
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const DispositivoModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    nodeId: "",
    description: "",
    status: "Provisionamento",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Novo dispositivo:", formData);
    // Aqui você chamaria sua API
    onClose(); // fecha o modal
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#000 !important",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
          "& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root":
            {
              bgcolor: "#000 !important",
              color: "#fff",
            },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
        }}
      >
        <Settings color={theme.palette.primary.dark} size={24} />
        Cadastrar Novo Dispositivo
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Preencha as informações do sensor Heltec V2. A vinculação com gateway
          e máquina será feita posteriormente no cadastro da máquina.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Cadastrar Dispositivo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispositivoModal;