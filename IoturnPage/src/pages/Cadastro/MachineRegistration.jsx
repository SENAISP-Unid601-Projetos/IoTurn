import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import MachineHeaderSection from "./components/MachineHeaderSection";
import MachineStep1 from "./components/MachineSteps/MachineStep1";
import MachineStep2 from "./components/MachineSteps/MachineStep2";
import MachineStep3 from "./components/MachineSteps/MachineStep3";
import RegistrationStepper from "./components/RegistrationStepper";
import { fetchAllUserData } from "../../services/usersService";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllGatewayData } from "../../services/GatewayService";
import { fetchAllDeviceData } from "../../services/DeviceServices";
import ApiService from "../../services/ApiServices";

const CadastroMaquina = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const clientId = JSON.parse(localStorage.getItem("login_info"));

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    status: "ACTIVE",
    clientId: clientId.id,
    responsibleUserId: "",
    gatewayId: "",
    deviceId: "",
  });

  // Os dados para os campos opcionais ainda são buscados
  const [clientData, setClientData] = useState(null);
  const [users, setUsers] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [devices, setDevices] = useState([]);

  // Hooks para buscar dados dos campos opcionais
  const { filteredData: filteredUsers } = useDataManagement(
    fetchAllUserData,
    (user, term) =>
      user.id || //update(refatorar futuramente)
      user.name?.toLowerCase().includes(term) ||
      // user.email?.toLowerCase().includes(term) ||
      user.type?.toLowerCase().includes(term)
  );

  const { filteredData: filteredGateways } = useDataManagement(
    fetchAllGatewayData,
    (gateway, term) =>
      gateway.gatewayId?.toLowerCase().includes(term) ||
      gateway.description?.toLowerCase().includes(term)
  );

  const { filteredData: filteredDevices } = useDataManagement(
    fetchAllDeviceData,
    (device, term) =>
      device.nodeId?.toLowerCase().includes(term) ||
      device.description?.toLowerCase().includes(term) ||
      device.machineName?.toLowerCase().includes(term)
  );

  // UseEffects para popular os seletores
  useEffect(() => {
    if (!clientData) {
      setClientData(clientId)
    }
  }, [clientData, clientId]);

  useEffect(() => {
    if (filteredUsers.length > 0) {
      setUsers(filteredUsers);
    }
  }, [filteredUsers]);

  useEffect(() => {
    if (filteredGateways.length > 0) {
      setGateways(filteredGateways);
    }
  }, [filteredGateways]);

  useEffect(() => {
    if (filteredDevices.length > 0) {
      setDevices(filteredDevices);
    }
  }, [filteredDevices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      const valueTrimmed = String(value);
      if (valueTrimmed) {
        setFormErrors((prev) => ({ ...prev, [name]: false }));
      }
    }
  };

  // Validação por Steps
  const validateForm = (step) => {
    const errors = {};
    if (step === 0) {
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
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm(0)) {
      setActiveStep(0)
      return;
    }

    const payload = { ...formData };
    const optionalFields = ["responsibleUserId", "gatewayId", "deviceId"];

    optionalFields.forEach((field) => {
      if (payload[field] === "" || payload[field] === null) {
        delete payload[field];
      }
    });

    console.log("Dados enviados para API:", payload);
    ApiService.postRequest("/machines/create", payload);
    navigate("/main/gerenciamento/maquinas");
  };

  const handleNext = e => {
    if (e) e.preventDefault();
    if (validateForm(activeStep)) {
      if (activeStep === 2) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/main/gerenciamento/maquinas");
    } else {
      setActiveStep(prev => prev - 1);
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <MachineStep1
            formData={formData}
            onChange={handleChange}
            formErrors={formErrors}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <MachineStep2
            formData={formData}
            onChange={handleChange}
            formErrors={{}}
            users={users}
            clientData={clientData}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <MachineStep3
            formData={formData}
            onChange={handleChange}
            formErrors={{}}
            gateways={gateways}
            devices={devices}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MachineHeaderSection />

      <RegistrationStepper activeStep={activeStep} />

      <Box
        component="form"
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
        {renderStepContent()}
      </Box>
    </Container>
  );
};

export default CadastroMaquina;