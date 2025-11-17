import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import theme from "../../../../theme";
import MachineFormSection from "../../../Cadastro/components/MachineFormSection";
import ApiService from "../../../../services/ApiServices";
import FormField from "../../../Cadastro/components/FormField";
import { fetchAllUserData } from "../../../../services/usersService";

// 👇 PASSO 1: Importar os serviços do Gateway e Device
import { fetchAllGatewayData } from "../../../../services/GatewayService";
import { fetchAllDeviceData } from "../../../../services/DeviceServices";

const EditMachineModal = ({ open, onClose, machineData, onMachineUpdated }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // 👇 PASSO 2: Adicionar states para gateways e devices
  const [gateways, setGateways] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (machineData) {
      setFormData({
        name: machineData.name || "",
        serialNumber: machineData.serialNumber || "",
        manufacturer: machineData.manufacturer || "",
        model: machineData.model || "",
        status: machineData.status || "",
        responsibleUserId: machineData.responsibleUserId || "",
        gatewayId: machineData.gatewayId || "",
        deviceId: machineData.deviceId || "",
      });
      setError(null);

      // 👇 PASSO 3: Buscar todos os dados (usuários, gateways, devices)
      const fetchDropdownData = async () => {
        try {
          // Busca tudo em paralelo para ser mais rápido
          const [usersData, gatewaysData, devicesData] = await Promise.all([
            fetchAllUserData(),
            fetchAllGatewayData(),
            fetchAllDeviceData(),
          ]);
          setUsers(usersData || []);
          setGateways(gatewaysData || []);
          setDevices(devicesData || []);
        } catch (fetchError) {
          console.error("Falha ao carregar dados dos seletores:", fetchError);
          setError("Falha ao carregar as opções do formulário.");
        }
      };

      fetchDropdownData();
    }
  }, [machineData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // ... (Sua lógica de 'handleSave' com 'payload' e 'delete' está perfeita)
    setLoading(true);
    setError(null);
    const payload = { ...formData };
    const optionalFields = ["responsibleUserId", "gatewayId", "deviceId"];
    optionalFields.forEach((field) => {
      if (payload[field] === "" || payload[field] === null) {
        delete payload[field];
      }
    });

    try {
      const endpoint = `/machines/update/${machineData.id}`;
      const updatedData = await ApiService.putRequest(endpoint, payload);
      setLoading(false);
      onMachineUpdated(updatedData);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || "Falha ao atualizar a máquina.");
      console.error(err);
    }
  };
  
  // (Lógica para o 'Box de Info' do Step 3)
  const selectedDeviceId = formData.deviceId;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#000 !important",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
          "& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root":
            {
              bgcolor: "#000 !important",
            },
        },
      }}
    >
      <DialogContent>
        <Typography variant="h6" fontWeight="bold">
          Editar Máquina: {machineData?.name}
        </Typography>

        <Box sx={{ mt: 3, mb: 3, overflowY: "auto", maxHeight: "70vh", pr: 1 }}>
          
          {/* Seção 1: Informações da Máquina */}
          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Informações da Máquina
            </Typography>
            <MachineFormSection
              formData={formData}
              onChange={handleChange}
              formErrors={{}}
            />
          </Box>

          {/* Seção 2: Vinculação (Usuário) */}
          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Vinculação
            </Typography>
            <FormField
              label="Usuário Responsável (opcional)"
              name="responsibleUserId"
              value={formData.responsibleUserId}
              onChange={handleChange}
              select
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.type.toUpperCase()})`,
              }))}
              placeholder="Selecione um usuário"
            />
          </Box>

          {/* 👇 PASSO 4: Adicionar o JSX da Seção 3 (IoT) */}
          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Dispositivo IoT
            </Typography>
            
            {/* Campo Gateway (do Step 3) */}
            <FormField
              label="Gateway Responsável (opcional)"
              name="gatewayId"
              value={formData.gatewayId}
              onChange={handleChange}
              select
              options={gateways.map((gateway) => ({
                value: gateway.id, // (Baseado no seu Step 3)
                label: `${gateway.gatewayId} • ${gateway.status}`,
              }))}
              placeholder="Selecione um gateway"
            />

            {/* Campo Device (do Step 3) */}
            <FormField
              label="Dispositivo IoT (opcional)"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              select
              options={devices.map((device) => ({
                value: device.id, // (Baseado no seu Step 3)
                label: `${device.nodeId} • ${device.status}`,
              }))}
              placeholder="Selecione um dispositivo"
            />

            {/* Box de info (do Step 3) */}
            {selectedDeviceId && (
              <Box
                sx={{
                  bgcolor: theme.palette.background.default,
                  p: 2,
                  borderRadius: 2,
                  mt: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Dispositivo Selecionado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {selectedDeviceId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: Pronto para vinculação
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Alerta de Erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogActions
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button onClick={onClose} disabled={loading} color="secondary">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar Alterações"}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditMachineModal;