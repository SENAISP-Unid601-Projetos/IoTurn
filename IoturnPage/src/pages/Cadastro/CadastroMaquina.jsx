import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Buttons from "./components/BottonsActions";

const CadastroMaquina = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da máquina:", formData);
    // Aqui você vai chamar sua API depois:
    // createMachine(formData).then(() => navigate("/main/gerenciamento"));
    alert("Máquina cadastrada com sucesso!");
    navigate("/main/gerenciamento"); // ou o caminho da sua lista
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Cadastrar Nova Máquina
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Preencha as informações básicas da máquina industrial.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Nome da Máquina *"
            name="name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Número de Série *"
            name="serialNumber"
            fullWidth
            required
            value={formData.serialNumber}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fabricante"
            name="manufacturer"
            fullWidth
            value={formData.manufacturer}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Modelo"
            name="model"
            fullWidth
            value={formData.model}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}></Box>
            <Buttons onNext={handleSubmit} cancelPath="/main/gerenciamento/maquinas" />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CadastroMaquina;