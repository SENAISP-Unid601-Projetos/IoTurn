import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import theme from "../../../../theme"; 
import ApiService from "../../../../services/ApiServices"; 
import FormField from "../../../Cadastro/components/FormField"; 
import { WifiCog, ArrowLeft } from "lucide-react";


const gatewayStatusOptions = [
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Offline" },
  { value: "PROVISIONING", label: "Em Manutenção" },
];

const EditGatewayModal = ({ open, onClose, gatewayData, onGatewayUpdated }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (gatewayData) {
      setFormData({
        gatewayId: gatewayData.gatewayId || "",
        description: gatewayData.description || "",
        status: gatewayData.status || "OFFLINE",
      });
      setError(null);
    }
  }, [gatewayData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      description: formData.description,
      status: formData.status,
    };

    try {
      const endpoint = `/gateways/update/${gatewayData.id}`;

      console.log("Enviando Payload:", payload);
      const updatedData = await ApiService.putRequest(endpoint, payload);

      setLoading(false);
      if (onGatewayUpdated) onGatewayUpdated(updatedData);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || "Falha ao atualizar o gateway.");
      console.error(err);
    }
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
            },
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <WifiCog size={32} color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Editar Gateway
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atualize as informações do hardware: {gatewayData?.gatewayId}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, mb: 3, pr: 1 }}>
          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                pl: 2,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 9,
                  bottom: 9,
                  width: "4px",
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "4px",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Identificação do Hardware
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Informações únicas do Gateway ESP32 (Wi-Fi + LoRa)
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >

              <FormField
                label="Gateway ID"
                name="gatewayId"
                value={formData.gatewayId}
                onChange={handleChange}
                disabled={true} 
                placeholder="Ex: ESP32-GW-XXXXXX"
                helperText="O ID do hardware não pode ser alterado"
              />

              <FormField
                label="Descrição / Localização"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Gateway do Setor A"
                description="Localização física ou identificação adicional"
              />

              <FormField
                label="Status Inicial"
                name="status"
                value={formData.status}
                onChange={handleChange}
                select
                required
                options={gatewayStatusOptions}
                placeholder="Selecione o status"
              />
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            p: 2,
            pt: 0,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <ArrowLeft size={18} />
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: "160px",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditGatewayModal;
