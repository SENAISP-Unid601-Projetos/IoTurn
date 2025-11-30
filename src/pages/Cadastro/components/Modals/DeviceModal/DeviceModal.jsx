import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogActions, Box } from "@mui/material";
import Buttons from "../../../components/BottonsActions";
import DispositivoFormSection from "./DeviceFormSection";
import DispositivoInfoSection from "./DeviceInfoSection";
import theme from "../../../../../theme";
import ApiService from "../../../../../services/ApiServices";

const userId = JSON.parse(localStorage.getItem("login_info"));

const DispositivoModal = ({ open, onClose }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    clientId: userId.id,
    nodeId: "",
    description: "",
    status: "PROVISIONING",
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
    const requiredFields = ["nodeId", "description", "status"];

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

    console.log("Novo dispositivo:", formData);
    ApiService.postRequest("/devices/create", formData);
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
          },
        },
      }}
    >
      <DialogContent>
        <DispositivoInfoSection />
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
          <DispositivoFormSection
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
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
