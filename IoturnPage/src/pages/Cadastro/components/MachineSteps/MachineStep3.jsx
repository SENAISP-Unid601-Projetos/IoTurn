import React from "react";
import { Box, Typography } from "@mui/material";
import FormField from "../FormField";
import Buttons from "../BottonsActions"; 
import theme from "../../../../theme";

const MachineStep3 = ({ 
  formData, 
  onChange, 
  formErrors, 
  gateways, 
  devices, 
  onBack, 
  onNext 
}) => (
  <>

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
        onChange={onChange}
        select
        options={gateways.map((gateway) => ({
          value: gateway.id,
          label: `${gateway.gatewayId} • ${gateway.status}`,
        }))}
        error={formErrors.gatewayId}
        helperText={formErrors.gatewayId ? "Campo obrigatório" : ""}
      />
    </Box>


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
        onChange={onChange}
        select
        options={devices.map((device) => ({
          value: device.id,
          label: `${device.nodeId} • ${device.status}`,
        }))}
        error={formErrors.deviceId}
        helperText={formErrors.deviceId ? "Campo obrigatório" : ""}
      />
    </Box>

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

    <Buttons
      onNext={onNext}
      onCancel={onBack}
      nextLabel="Finalizar"
      cancelLabel="Voltar"
      showNextIcon={false}
    />
  </>
);

export default MachineStep3;