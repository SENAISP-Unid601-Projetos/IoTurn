import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import FormField from "../../Cadastro/components/FormField";
import Buttons from "../../Cadastro/components/BottonsActions";
import theme from "../../../theme";

const statusOptions = [
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
  { value: "Manutencao", label: "Em Manutenção" },
];

const GatewayModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    gatewayId: "",
    description: "",
    status: "Offline",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Novo gateway:", formData);
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
          "& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root":
            {
              bgcolor: "#000 !important",
              color: "#fff",
            },
        },
      }}
    >
      <DialogContent>
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
              borderRadius: 2,
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Cadastrar Novo Gateway
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha as informações do Gateway ESP32 com Wi-Fi no sistema.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pt: 3,
            pb: 3,
          }}
        >
          <Grid container spacing={4}>
            {/* Gateway ID + Status Inicial em linha */}
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

            <Grid>
              <FormField
                label="Status Inicial"
                name="status"
                value={formData.status}
                onChange={handleChange}
                description="Estado do gateway"
                required
                sm={3}
                select
                options={statusOptions}
              />
            </Grid>

            {/* Descrição / Localização em linha completa */}
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
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 1,
            position: "relative",
            pl: 2,
            mb: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bgcolor: theme.palette.primary.main,
              borderRadius: 2,
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Função do Gateway
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
            O Gateway ESP32 atua como ponto de comunicação entre os sensores
            Heltec V2 (LoRa) e o servidor central via Wi-Fi. Ele é responsável
            por: • Receber dados dos dispositivos IoT via protocolo LoRa •
            Encaminhar os dados para o servidor através da rede Wi-Fi •
            Gerenciar múltiplos dispositivos simultaneamente • Enviar heartbeats
            periódicos para monitoramento de conectividade
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            position: "relative",
            pl: 2,
            mb: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bgcolor: theme.palette.primary.main,
              borderRadius: 2,
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Diretrizes de Cadastro
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
            O Gateway ID deve ser único e corresponder ao Chip ID do ESP32 •
            Gateways offline não conseguem gerenciar dispositivos até ficarem
            online • Um único Gateway pode gerenciar múltiplos dispositivos IoT
            simultaneamente • O status será atualizado automaticamente quando o
            Gateway enviar o primeiro heartbeat • Certifique-se de que o Gateway
            tenha acesso à rede Wi-Fi antes de ativá-lo
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Buttons
          onNext={handleSubmit}
          onCancel={onClose}
          nextLabel="Salvar Gateway"
        />
      </DialogActions>
    </Dialog>
  );
};

export default GatewayModal;
