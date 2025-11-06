import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import Buttons from "../../../components/BottonsActions";
import DispositivoFormSection from "./DeviceFormSection";
import DispositivoInfoSection from "./DeviceInfoSection";
import theme from "../../../../../theme";

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
        <DispositivoInfoSection />
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            borderTop: `1px solid ${theme.palette.divider}`, 
            borderBottom: `1px solid ${theme.palette.divider}`, 
            pt: 3, 
            pb: 3 
          }}
        >
          <DispositivoFormSection 
            formData={formData} 
            handleChange={handleChange} 
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