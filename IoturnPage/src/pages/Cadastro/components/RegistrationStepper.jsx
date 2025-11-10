// src/pages/Cadastro/components/RegistrationStepper.jsx
import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { Factory, Link2, Cpu } from "lucide-react";

const steps = [
  { label: "Máquina", icon: <Factory size={22} /> },
  { label: "Vinculação", icon: <Link2 size={22} /> },
  { label: "Dispositivo IoT", icon: <Cpu size={22} /> },
];

// 🔹 Cria um conector personalizado
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 2,
    backgroundColor: theme.palette.divider,
    transition: "background-color 0.3s ease",
  },
  // Azul nas etapas ativas ou concluídas
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const RegistrationStepper = ({ activeStep = 0 }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", mb: 5 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<CustomStepConnector />}
      >
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      bgcolor: isCompleted || isActive
                        ? theme.palette.primary.main
                        : theme.palette.grey[500],
                      color:
                        isCompleted || isActive
                          ? theme.palette.common.white
                          : theme.palette.text.primary,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {step.icon}
                  </Box>
                )}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: isCompleted || isActive ? "bold" : "normal",
                    color:
                      isCompleted || isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default RegistrationStepper;
