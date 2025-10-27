import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import { Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import Buttons from "../Cadastro/components/BottonsActions"; 
import RegistrationStepper from "../Cadastro/components/RegistrationStepper"; 
import theme from "../../theme";

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
    navigate("/main/gerenciamento"); // caminho da sua lista
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, border: '1px solid yellow'}}>
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


        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Buttons onNext={handleSubmit} cancelPath="/main/gerenciamento/maquinas" />
        </Box>
    
    </Container>
  );
};

export default CadastroMaquina;