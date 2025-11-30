import React from 'react';
import { Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';

const BtnAcess = () => (
  <Button
    variant="contained"
    size="large"
    href="/login"
    endIcon={<ArrowRight size={20} />}
    sx={{
      borderRadius: "20px",
      textTransform: "none",
      py: 1.5,
      px: 4,
      fontSize: "1rem",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
      },
      "& .MuiButton-endIcon": {
        transition: "transform 0.3s ease-in-out",
      },
      "&:hover .MuiButton-endIcon": {
        transform: "translateX(5px)",
      },
    }}
  >
    Acessar plataforma
  </Button>
);

export default BtnAcess;