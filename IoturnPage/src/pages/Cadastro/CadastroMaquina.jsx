import React, { useState } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Buttons from "../Cadastro/components/BottonsActions";
import RegistrationStepper from "../Cadastro/components/RegistrationStepper";
import theme from "../../theme";
import FormField from "./components/FormField";

const statusOptions = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Manutencao", label: "Em Manutenção" },
];

const CadastroMaquina = () => {
  const navigate = useNavigate();
  const [activeStep] = useState(0);

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
    navigate("/main/gerenciamento");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "column",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            mb: 1,
          }}
        >
          <Settings color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{}}>
            Cadastro de Máquina
          </Typography>
        </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4}}>
        Registre uma nova máquina e vincule um dispositivo IoT
      </Typography>
      </Box>

      <RegistrationStepper activeStep={activeStep} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Informações básicas da máquina industrial
        </Typography>

        {/* O "Pai" que define o espaçamento */}
        <Grid container spacing={4}>
          <FormField
            xs={12}
            label="Nome da Máquina"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Torno CNC Setor A"
            description="Identificação do equipamento"
            required
          />

          <FormField
            xs={12}
            label="Número de Série"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="Ex: SN-2024-ABC-12345"
            description="Número único do fabricante"
            required
          />

          <FormField
            xs={12}
            label="Fabricante"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="Ex: Siemens"
            description="Nome do fabricante"
            sm={3}
          />

          <FormField
            xs={12}
            label="Modelo"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Ex: CNC-5000X"
            description="Modelo do equipamento"
            sm={3}
          />

          {/* Status (ocupa 50% e é um SELECT) */}
          <FormField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            description="Situação operacional"
            required
            sm={3}
            select
            options={statusOptions}
          />
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 5 }}>
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
