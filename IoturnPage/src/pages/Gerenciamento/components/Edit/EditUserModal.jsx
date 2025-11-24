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
import { UserCog, ArrowLeft } from "lucide-react";


const userTypeOptions = [
  { value: "ADMIN", label: "Administrador" },
  { value: "TECHNICIAN", label: "Técnico" },
  { value: "VIEWER", label: "Usuário Padrão" },

];

const statusOptions = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "CANCELED", label: "Suspenso" },
];

const EditUserModal = ({ open, onClose, userData, onUserUpdated }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        userType: userData.userType || "",
        status: userData.status || "ACTIVE",
      });
      setError(null);
    }
  }, [userData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Payload conforme o schema Zod
    const payload = {
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
      status: formData.status,
    };

    try {
      // Ajuste a rota conforme sua API
      const endpoint = `/users/update/${userData.id}`;
      
      console.log("Enviando Payload:", payload);
      const updatedData = await ApiService.putRequest(endpoint, payload);

      setLoading(false);
      if (onUserUpdated) onUserUpdated(updatedData);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || "Falha ao atualizar o usuário.");
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
        
        {/* --- CABEÇALHO --- */}
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
            <UserCog size={32} color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Editar Usuário
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atualize as informações de: {userData?.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* --- CONTEÚDO DO FORMULÁRIO --- */}
        <Box sx={{ mt: 3, mb: 3, pr: 1 }}>
          
          {/* Bloco 1: Dados Pessoais */}
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
                Dados Pessoais
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Informações básicas de identificação
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <FormField
                    label="Nome Completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                />

                <FormField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: joao@exemplo.com"
                />
            </Box>
          </Box>

          {/* Bloco 2: Permissões e Status */}
          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
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
                Configurações de Acesso
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Defina o nível de permissão e o estado da conta
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <FormField
                    label="Tipo de Usuário (Cargo)"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    select
                    options={userTypeOptions}
                    placeholder="Selecione o cargo"
                />

                <FormField
                    label="Status da Conta"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    select
                    options={statusOptions}
                    placeholder="Selecione o status"
                />
            </Box>
          </Box>
        </Box>

        {/* ALERTA DE ERRO */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* BOTÕES */}
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

export default EditUserModal;