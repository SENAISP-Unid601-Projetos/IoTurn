import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Buttons from "./components/BottonsActions";
import RegistrationStepper from "./components/RegistrationStepper";
import theme from "../../theme";
import MachineHeaderSection from "./components/MachineHeaderSection";
import MachineFormSection from "./components/MachineFormSection";

const CadastroMaquina = () => {
  const navigate = useNavigate();
  const [activeStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});

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
    
    if (formErrors[name]) {
      const valueTrimmed = value.trim();
      if (valueTrimmed) {
        setFormErrors(prev => ({ ...prev, [name]: false }));
      }
    }
  };

  const validateStep = () => {
    const errors = {};
    const requiredFields = ['name', 'serialNumber', 'manufacturer', 'model', 'status'];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        errors[field] = true;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      return;
    }
    console.log("Dados da máquina:", formData);
    navigate("/main/gerenciamento");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MachineHeaderSection />
      
      <RegistrationStepper activeStep={activeStep} />

      <Box
        component="form"
        onSubmit={handleNext}
        sx={{
          mt: 4,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          p: 3,
          maxWidth: "45rem",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <MachineFormSection 
          formData={formData} 
          onChange={handleChange}
          formErrors={formErrors}
        />
        
        <Box sx={{ px: 3, mt: 4 }}>
          <Buttons
            onNext={handleNext}
            cancelPath="/main/gerenciamento/maquinas"
            nextLabel="Próximo"
            showNextIcon={true}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CadastroMaquina;