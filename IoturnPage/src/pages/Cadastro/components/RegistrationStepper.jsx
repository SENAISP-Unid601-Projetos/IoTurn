import React from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    useTheme,
} from "@mui/material";
import { Factory, Link2, Cpu } from "lucide-react";

const steps = [
    { label: "Máquina", icon: <Factory size={22} /> },
    { label: "Vinculação", icon: <Link2 size={22} /> },
    { label: "Dispositivo IoT", icon: <Cpu size={22} /> },
];

const RegistrationStepper = ({ activeStep = 0 }) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: "100%", mb: 5 }}>
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    "& .MuiStepConnector-root": {
                        top: 20,
                    },
                    "& .MuiStepIcon-root": {
                        color: theme.palette.grey[400],
                    },
                    "& .MuiStepIcon-root.Mui-active": {
                        color: theme.palette.primary.main,
                    },
                    "& .MuiStepIcon-root.Mui-completed": {
                        color: theme.palette.success.main,
                    },
                }}
            >
                {steps.map((step, index) => (
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
                                        bgcolor:
                                            index === activeStep
                                                ? theme.palette.primary.main
                                                : theme.palette.grey[300],
                                        color:
                                            index === activeStep
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
                                    fontWeight: index === activeStep ? "bold" : "normal",
                                    color:
                                        index === activeStep
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                }}
                            >
                                {step.label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default RegistrationStepper;
