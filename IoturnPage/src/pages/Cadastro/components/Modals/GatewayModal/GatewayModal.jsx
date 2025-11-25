import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import Buttons from "../../../components/BottonsActions";
import GatewayFormSection from "./GatewayFormSection";
import GatewayFunctionSection from "./GatewayFunctionSection";
import GatewayGuidelinesSection from "./GatewayGuidelinesSection";
import theme from "../../../../../theme";
import ApiService from "../../../../../services/ApiServices";

const userId = JSON.parse(localStorage.getItem("login_info"));

const GatewayModal = ({ open, onClose }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    clientId: userId.id,
    gatewayId: "",
    description: "",
    status: "OFFLINE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["gatewayId", "description", "status"];

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        errors[field] = "Campo obrigatório";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Novo gateway:", formData);
    ApiService.postRequest("/gateways/create", formData);
    window.location.reload();
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
          <GatewayFormSection formData={formData} handleChange={handleChange} formErrors={formErrors} />
        </Box>
        <GatewayFunctionSection />
        <GatewayGuidelinesSection />
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
