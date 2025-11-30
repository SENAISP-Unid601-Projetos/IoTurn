import React from "react";
import { Box, Typography } from "@mui/material";
import FormField from "../FormField";
import Buttons from "../BottonsActions";
import theme from "../../../../theme";

const MachineStep2 = ({
  formData,
  onChange,
  users,
  clientData,
  onBack,
  onNext
}) => (
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
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        Usuário Responsável (opcional)
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Técnico ou administrador que gerenciará esta máquina
      </Typography>
      <FormField
        label="Selecione um usuário"
        name="responsibleUserId"
        value={formData.responsibleUserId}
        onChange={onChange}
        select
        options={users.map((user) => ({
          value: user.id,
          label: `${user.name} (${user.type.toUpperCase()})`,
        }))}
      />
    </Box>

    <Buttons
      onNext={onNext}
      onCancel={onBack}
      nextLabel="Próximo"
      cancelLabel="Voltar"
      showNextIcon={false}
    />
  </>
);

export default MachineStep2;