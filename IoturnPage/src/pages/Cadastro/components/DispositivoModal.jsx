import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Settings } from "lucide-react";
import FormField from "./FormField";
import Buttons from "../../Cadastro/components/BottonsActions";
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
    onClose();
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
          "& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root": {
            bgcolor: "#000 !important",
          },
        },
      }}
    >
      <DialogContent>
        {/* Título + Descrição com linha azul */}
        <Box
          sx={{
            position: "relative",
            pl: 2,
            mb: 3,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Cadastrar Novo Dispositivo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha as informações do sensor Heltec V2. A vinculação com gateway
            e máquina será feita posteriormente no cadastro da máquina.
          </Typography>
        </Box>

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit} sx={{ borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}`, pt: 3, pb: 3 }}>
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

      <DialogActions sx={{ p: 1 }}>
        <Buttons
          onNext={handleSubmit}
          onCancel={onClose}
          nextLabel="Cadastrar Dispositivo"
        />
      </DialogActions>
    </Dialog>
  );
};

export default DispositivoModal;