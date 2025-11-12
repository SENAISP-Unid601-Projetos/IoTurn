import React, { useState, useEffect } from "react";
import { Box, Container, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegistrationStepper from "./components/RegistrationStepper";
import theme from "../../theme";
import MachineHeaderSection from "./components/MachineHeaderSection";
import { fetchAllUserData } from "../../services/usersService";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllGatewayData } from "../../services/GatewayService";
import { fetchAllDeviceData } from "../../services/DeviceServices";
import ApiService from "../../services/ApiServices";
// import { getClientFromToken } from "../../../utils/auth"; // Arrumar o caminho que pega o token de cliente
import MachineStep1 from "./components/MachineSteps/MachineStep1";
import MachineStep2 from "./components/MachineSteps/MachineStep2";
import MachineStep3 from "./components/MachineSteps/MachineStep3";


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
    deviceId: "",
  });

  const [clientData, setClientData] = useState(null);
  const [users, setUsers] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [devices, setDevices] = useState([]);

  const { filteredData: filteredUsers } = useDataManagement(
    fetchAllUserData,
    (user, term) =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.userType?.toLowerCase().includes(term)
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

  // useEffect(() => {
  //   const clientFromToken = getClientFromToken();
  //   if (clientFromToken) {
  //     setClientData(clientFromToken);
  //     setFormData((prev) => ({ ...prev, clientId: clientFromToken.id }));
  //   } else {
  //     console.warn("Cliente não encontrado no token");
  //   }
  // }, []);

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
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!validateStep2()) {
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      console.log("Dados completos:", formData);
      ApiService.postRequest("machines/crate", formData)
      navigate("/main/gerenciamento/maquinas");
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
          <MachineStep1
            formData={formData}
            onChange={handleChange}
            formErrors={formErrors}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {activeStep === 1 && (
          <MachineStep2
            formData={formData}
            onChange={handleChange}
            formErrors={formErrors}
            users={users}
            clientData={clientData}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {activeStep === 2 && (
          <MachineStep3
            formData={formData}
            onChange={handleChange}
            formErrors={formErrors}
            gateways={gateways}
            devices={devices}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
      </Box>
    </Container>
  );
};

export default CadastroMaquina;
