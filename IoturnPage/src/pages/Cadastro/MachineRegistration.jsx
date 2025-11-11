// src/pages/Cadastro/MachineRegistration/index.jsx
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Buttons from "./components/BottonsActions";
import RegistrationStepper from "./components/RegistrationStepper";
import theme from "../../theme";
import MachineHeaderSection from "./components/MachineHeaderSection";
import MachineFormSection from "./components/MachineFormSection";
import { fetchAllUserData } from "../../services/usersService";
import { useDataManagement } from "../../hooks/useDataManagement";
import FormField from "./components/FormField";
import { fetchAllGatewayData } from "../../services/GatewayService"; 
import { fetchAllDeviceData } from "../../services/DeviceServices";  

const CadastroMaquina = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    status: "Ativo",
    clientId: "",
    responsibleUserId: "",
    gatewayId: "",
    device: "",
  });

  const [clientData, setClientData] = useState(null);
  const [users, setUsers] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [devices, setDevice] = useState([];)

  const {
    filteredData: filteredUsers,
    loading: usersLoading,
    error: usersError,
  } = useDataManagement(
    fetchAllUserData,
    (user, term) =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.userType?.toLowerCase().includes(term)
  );

    const {
    filteredData: filteredGateways,
    loading: gatewaysLoading,
    error: gatewaysError,
  } = useDataManagement(fetchAllGatewayData, (gateway, term) =>
    gateway.gatewayId?.toLowerCase().includes(term) ||
    gateway.description?.toLowerCase().includes(term)
  );

    const {
    filteredData: filteredDevices,
    loading: devicesLoading,
    error: devicesError,
  } = useDataManagement(fetchAllDeviceData, (device, term) =>
    device.nodeId?.toLowerCase().includes(term) ||
    device.description?.toLowerCase().includes(term) ||
    device.machineName?.toLowerCase().includes(term)
  );

  useEffect(() => {
    const mockClient = {
      id: 1,
      companyName: "Indústria Metalúrgica Silva LTDA",
    };
    setClientData(mockClient);
    setFormData((prev) => ({ ...prev, clientId: mockClient.id }));
  }, []);

  useEffect(() => {
    if (filteredUsers.length > 0) {
      setUsers(filteredUsers);
    }
  }, [filteredUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      const valueTrimmed = value.trim();
      if (valueTrimmed) {
        setFormErrors((prev) => ({ ...prev, [name]: false }));
      }
    }
  };

  const validateStep1 = () => {
    const errors = {};
    const requiredFields = [
      "name",
      "serialNumber",
      "manufacturer",
      "model",
      "status",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = true;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.responsibleUserId?.trim()) {
      errors.responsibleUserId = true;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      if (!validateStep1()) {
        alert("Por favor, preencha todos os campos obrigatórios da etapa 1.");
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!validateStep2()) {
        alert("Por favor, selecione um usuário responsável.");
        return;
      }
      console.log("Dados completos:", formData);
      navigate("/main/gerenciamento");
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      navigate("/main/gerenciamento/maquinas");
    }
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
        {activeStep === 0 && (
          <>
            <MachineFormSection
              formData={formData}
              onChange={handleChange}
              formErrors={formErrors}
            />

            <Box sx={{ px: 3, mt: 4 }}>
              <Buttons
                onNext={handleNext}
                onCancel={handleBack}
                nextLabel="Próximo"
                cancelLabel="Voltar"
                showNextIcon={true}
              />
            </Box>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Vinculação
            </Typography>

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
              <Typography variant="subtitle1" fontWeight="bold">
                Cliente:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {clientData?.companyName || "Carregando..."}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A máquina será automaticamente vinculada à sua empresa
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Usuário Responsável *
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Técnico ou administrador que gerenciará esta máquina
              </Typography>
              <FormField
                label="Selecione um usuário"
                name="responsibleUserId"
                value={formData.responsibleUserId}
                onChange={handleChange}
                select
                options={users.map((user) => ({
                  value: user.id,
                  label: `${user.name} (${user.userType.toUpperCase()})`,
                }))}
                required
                error={formErrors.responsibleUserId}
                helperText={
                  formErrors.responsibleUserId ? "Campo obrigatório" : ""
                }
              />
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  py: 1,
                }}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  py: 1,
                }}
              >
                Próximo
              </Button>
            </Box>
          </>
        )}

        {activeStep === 2 && (
          <>
            {/* 👇 Título com linha vertical azul */}
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
              <Typography variant="h6" fontWeight="bold">
                Dispositivo IoT
              </Typography>
            </Box>

            {/* Gateway Responsável (opcional) */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Gateway Responsável
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gateway ESP32 que gerenciará este sensor (opcional)
              </Typography>
              <FormField
                label="Selecione um gateway"
                name="gatewayId"
                value={formData.gatewayId}
                onChange={handleChange}
                select
                options={gateways.map((gateway) => ({
                  value: gateway.gatewayId,
                  label: `${gateway.gatewayId} • ${gateway.status}`,
                }))}
                error={formErrors.gatewayId}
                helperText={formErrors.gatewayId ? "Campo obrigatório" : ""}
              />
            </Box>

            {/* Dispositivo IoT (opcional) */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Dispositivo IoT
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Selecione um sensor Heltec V2 disponível para vinculação
                (opcional)
              </Typography>
              <FormField
                label="Selecione um dispositivo"
                name="deviceId"
                value={formData.deviceId}
                onChange={handleChange}
                select
                options={devices.map((device) => ({
                  value: device.nodeId,
                  label: `${device.nodeId} • ${device.status}`,
                }))}
                error={formErrors.deviceId}
                helperText={formErrors.deviceId ? "Campo obrigatório" : ""}
              />
            </Box>

            {/* Informações do dispositivo selecionado */}
            {formData.deviceId && (
              <Box
                sx={{
                  bgcolor: theme.palette.background.default,
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Dispositivo Selecionado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Node ID: {formData.deviceId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: Pronto para vinculação
                </Typography>
              </Box>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  py: 1,
                }}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  py: 1,
                }}
              >
                Finalizar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CadastroMaquina;
