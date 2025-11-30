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
import { fetchAllGatewayData } from "../../../../services/GatewayService";
import { fetchAllDeviceData } from "../../../../services/DeviceServices";
import { FolderCog } from "lucide-react";

const EditMachineModal = ({ open, onClose, machineData, onMachineUpdated }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
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

      const fetchDropdownData = async () => {
        try {
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
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <FolderCog size={32} color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Editar Máquina
              </Typography>
              <Typography variant="h7">
                Atualize as informações da máquina: {machineData?.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="h7" fontWeight="bold">
          Editar Máquina: {machineData?.name}
        </Typography>

        <Box sx={{ mt: 3, mb: 3, pr: 1 }}>
          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                pl: 2,
                "&: :before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 9,
                  bottom: 9,
                  width: "4px",
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "4px",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Identificação da Máquina
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Informações básicas para identificação do equipamento industrial
              </Typography>
            </Box>

            <Box
              sx={{
                "& .MuiTypography-h6": {
                  display: "none",
                },
              }}
            >
              <MachineFormSection
                formData={formData}
                onChange={handleChange}
                formErrors={{}}
              />
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              pl: 2,
              mb: 3,
              pb: 3,
              gap: (theme) => theme.spacing(2),
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                position: "relative",
                pl: 2,
                "&: :before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 9,
                  bottom: 9,
                  width: "4px",
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "4px",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Vinculação e Responsabilidade
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Associe a máquina ao gateway, dispositivo IoT e usuário
                responsável
              </Typography>
            </Box>
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
            <FormField
              label="Gateway Responsável (opcional)"
              name="gatewayId"
              value={formData.gatewayId}
              onChange={handleChange}
              select
              options={gateways.map((gateway) => ({
                value: gateway.id,
                label: `${gateway.gatewayId} • ${gateway.status}`,
              }))}
              placeholder="Selecione um gateway"
            />

            <FormField
              label="Dispositivo IoT (opcional)"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              select
              options={devices.map((device) => ({
                value: device.id,
                label: `${device.nodeId} • ${device.status}`,
              }))}
              placeholder="Selecione um dispositivo"
            />
          </Box>
        </Box>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            p: 2,
            pt: 0,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              minWidth: "160px", 
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditMachineModal;
