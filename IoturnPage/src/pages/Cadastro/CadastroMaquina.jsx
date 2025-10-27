import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid, // 👈 Importe o Grid
  FormControl, // 👈 Importe para o Select
  Select, // 👈 Importe o Select
  MenuItem, // 👈 Importe o MenuItem
} from "@mui/material";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Buttons from "../Cadastro/components/BottonsActions";
import RegistrationStepper from "../Cadastro/components/RegistrationStepper";
import theme from "../../theme";
import FormField from "./components/FormField"; // 👈 Importe seu novo componente

const CadastroMaquina = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    status: "Ativo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da máquina:", formData);
    // lógica da API
    navigate("/main/gerenciamento"); 
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 , border: '1px solid yellow'}}>
  
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Settings color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Cadastro de Máquina
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Registre uma nova máquina e vincule um dispositivo IoT
      </Typography>

      <RegistrationStepper activeStep={activeStep} />

    
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600,}}>
          Informações básicas da máquina industrial
        </Typography>

        {/* Usamos Grid para organizar os campos */}
        <Grid container spacing={3} sx={{border: "1px solid green"}}>
          {/* Nome da Máquina */}
          <Grid item xs={12}>
            <FormField
              label="Nome da Máquina"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Torno CNC Setor A"
              description="Identificação do equipamento"
              required
            />
          </Grid>

          {/* Número de Série */}
          <Grid item xs={12}>
            <FormField
              label="Número de Série"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Ex: SN-2024-ABC-12345"
              description="Número único do fabricante"
              required
            />
          </Grid>

          {/* Fabricante */}
          <Grid item xs={12} sm={6}>
            <FormField
              label="Fabricante"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Ex: Siemens"
              description="Nome do fabricante"
            />
          </Grid>

          {/* Modelo */}
          <Grid item xs={12} sm={6}>
            <FormField
              label="Modelo"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Ex: CNC-5000X"
              description="Modelo do equipamento"
            />
          </Grid>

          {/* Status (Select) */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="subtitle1"
                component="label"
                htmlFor="status"
                sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                Status <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'block', mb: 1.5 }}
              >
                Situação operacional
              </Typography>
              <FormControl fullWidth>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Inativo">Inativo</MenuItem>
                  <MenuItem value="Manutencao">Em Manutenção</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Botões de Ação */}
        <Box sx={{ display: "flex", gap: 2, mt: 6 }}>
          <Buttons
            onNext={handleSubmit}
            cancelPath="/main/gerenciamento/maquinas"
          />
        </Box>
      </Box>

    </Container>
  );
};

export default CadastroMaquina;