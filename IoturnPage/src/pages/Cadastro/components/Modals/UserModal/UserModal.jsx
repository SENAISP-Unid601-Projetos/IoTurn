import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import Buttons from "../../../components/BottonsActions";
import UserFormPersonalData from "./UserFormPersonalData";
import UserFormCredentials from "./UserFormCredentials";
import UserFormPermissions from "./UserFormPermissions";
import UserGuidelines from "./UserGuidelines";
import theme from "../../../../../theme";
import ApiService from "../../../../../services/ApiServices";

const userId = JSON.parse(localStorage.getItem("login_info"));

const UserModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "VIEWER",
    status: "ACTIVE",
    clientId: userId.id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Novo usuário:", formData);
    ApiService.postRequest("/users/create", formData);
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
        {/* Título */}
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
              borderRadius: "4px",
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Cadastro de Usuário
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crie um novo usuário e defina suas permissões de acesso.
          </Typography>
        </Box>

        {/* Dados Pessoais */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Dados Pessoais
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Informações básicas de identificação do usuário
          </Typography>
          <UserFormPersonalData formData={formData} onChange={handleChange} />
        </Box>

        {/* Credenciais de Acesso */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Credenciais de Acesso
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Defina a senha de acesso ao sistema (mínimo 8 caracteres)
          </Typography>
          <UserFormCredentials formData={formData} onChange={handleChange} />
        </Box>

        {/* Permissões e Vinculação */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Permissões e Vinculação
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Defina o nível de acesso e associe o usuário a um cliente
          </Typography>
          <UserFormPermissions formData={formData} onChange={handleChange} />
        </Box>

        {/* Diretrizes */}
        <UserGuidelines />
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Buttons
          onNext={handleSubmit}
          onCancel={onClose}
          nextLabel="Salvar Usuário"
        />
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
