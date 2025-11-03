import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import FormField from "./FormField";
import Buttons from "./BottonsActions";
import theme from "../../../theme";


const userTypes = [
  { value: "visualizador", label: "Visualizador" },
  { value: "tecnico", label: "Técnico" },
  { value: "administrador", label: "Administrador" },
];


const statusOptions = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

const UserModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "visualizador",
    status: "Ativo",
    clientId: "",
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormField
                label="Nome Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                label="E-mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: joao.silva@empresa.com"
                required
              />
            </Grid>
          </Grid>
        </Box>

        {/* Credenciais de Acesso */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Credenciais de Acesso
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Defina a senha de acesso ao sistema (mínimo 8 caracteres)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Senha"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Confirmar Senha"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
              />
            </Grid>
          </Grid>
        </Box>

        {/* Permissões e Vinculação */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Permissões e Vinculação
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Defina o nível de acesso e associe o usuário a um cliente
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Tipo de Usuário"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                select
                options={userTypes}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                select
                options={statusOptions}
                required
              />
            </Grid>
            {/* Cliente Associado — deixe vazio por enquanto ou remova */}
            {/* <Grid item xs={12}>
              <FormField
                label="Cliente Associado"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                placeholder="Selecione um cliente"
                // select
                // options={[]} // você vai preencher depois com API
              />
            </Grid> */}
          </Grid>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.background.default }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Diretrizes de Cadastro
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
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
          }}>
            <ul style={{ margin: 0, padding: '0 0 0 16px', listStyleType: 'disc' }}>
              <li>O e-mail deve ser único no sistema e será usado para login</li>
              <li>Senhas devem ter no mínimo 8 caracteres com letras maiúsculas, minúsculas e números</li>
              <li>Administradores têm acesso total, incluindo gerenciamento de usuários e configurações</li>
              <li>Técnicos podem gerenciar máquinas e dispositivos, mas não alterar configurações do sistema</li>
              <li>Visualizadores têm acesso somente leitura aos dashboards e relatórios</li>
            </ul>
          </Typography>
        </Box>
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