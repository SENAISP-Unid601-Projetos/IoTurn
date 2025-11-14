import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import MachineHeaderSection from "./components/MachineHeaderSection";
import { fetchAllUserData } from "../../services/usersService";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllGatewayData } from "../../services/GatewayService";
import { fetchAllDeviceData } from "../../services/DeviceServices";
import ApiService from "../../services/ApiServices";

// Componentes dos campos do formulário e botões
import MachineFormSection from "./components/MachineFormSection";
import FormField from "./components/FormField";
import Buttons from "./components/BottonsActions";

const CadastroMaquina = () => {
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("login_info"));

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    status: "ACTIVE",
    clientId: userId.id,
    responsibleUserId: "",
    gatewayId: "",
    deviceId: "",
  });

  // Os dados para os campos opcionais ainda são buscados
  const [clientData, setClientData] = useState(null);
  const [users, setUsers] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [devices, setDevices] = useState([]);

  // Hooks para buscar dados dos campos opcionais (sem alterações)
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

  // UseEffects para popular os seletores (sem alterações)
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

  // HandleChange (sem alterações)
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

  // Validação focada apenas nos campos obrigatórios
  const validateForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
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

  const handleCancel = () => {
    navigate("/main/gerenciamento/maquinas");
  };

  // Função auxiliar para renderizar títulos de seção
  const renderSectionTitle = (title, description) => (
    <Box
      sx={{
        position: "relative",
        pl: 2,
        mb: 3,
        mt: 4,
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
        {title}
      </Typography>
      {description && (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MachineHeaderSection />

      {/* O RegistrationStepper foi removido */}

      <Box
        component="form"
        onSubmit={handleSubmit}
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
        {/* Seção 1: Informações Obrigatórias */}
        <MachineFormSection
          formData={formData}
          onChange={handleChange}
          formErrors={formErrors}
        />

        {/* Seção 2: Vinculação (Opcional) */}
        {renderSectionTitle("Vinculação (Opcional)")}
        <Box sx={{ mb: 3, px: 1 }}>
          <FormField
            label="Usuário Responsável"
            description="Técnico ou administrador que gerenciará esta máquina"
            placeholder="Selecione um usuário"
            name="responsibleUserId"
            value={formData.responsibleUserId}
            onChange={handleChange}
            select
            options={users.map((user) => ({
              value: user.id,
              label: `${user.name} (${user.userType.toUpperCase()})`,
            }))}
          />
        </Box>

        {/* Seção 3: Dispositivos IoT (Opcional) */}
        {renderSectionTitle("Dispositivo IoT (Opcional)")}

        <Box sx={{ mb: 3, px: 1 }}>
          <FormField
            label="Gateway Responsável"
            description="Gateway ESP32 que gerenciará este sensor"
            placeholder="Selecione um gateway"
            name="gatewayId"
            value={formData.gatewayId}
            onChange={handleChange}
            select
            options={gateways.map((gateway) => ({
              value: gateway.gatewayId,
              label: `${gateway.gatewayId} • ${gateway.status}`,
            }))}
          />
        </Box>

        <Box sx={{ mb: 3, px: 1 }}>
          <FormField
            label="Dispositivo IoT"
            description="Selecione um sensor Heltec V2 disponível para vinculação"
            placeholder="Selecione um dispositivo"
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            select
            options={devices.map((device) => ({
              value: device.nodeId,
              label: `${device.nodeId} • ${device.status}`,
            }))}
          />
        </Box>

        {/* Botões de Ação */}
        <Box sx={{ px: 1, mt: 4 }}>
          <Buttons
            onNext={handleSubmit}
            onCancel={handleCancel}
            nextLabel="Salvar Máquina"
            cancelLabel="Cancelar"
            showNextIcon={false}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CadastroMaquina;