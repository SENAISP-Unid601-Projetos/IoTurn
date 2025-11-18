import React from "react";
import { Box } from "@mui/material";
import Buttons from "../BottonsActions";
import MachineFormSection from "../MachineFormSection";

const MachineStep1 = ({ formData, onChange, formErrors, onBack, onNext }) => (
  <Box>
    <MachineFormSection
      formData={formData}
      onChange={onChange}
      formErrors={formErrors}
    />

    <Box sx={{ px: 3, mt: 4 }}>
      <Buttons
        onNext={onNext}
        onCancel={onBack}
        nextLabel="Próximo"
        cancelLabel="Voltar"
        showNextIcon={true}
      />
    </Box>
  </Box>
);

export default MachineStep1;
