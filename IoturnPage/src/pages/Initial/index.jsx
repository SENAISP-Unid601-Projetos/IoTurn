import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  Stack,
} from "@mui/material";
import { Moon, ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "../../assets/LogoSemBorda.png";

const PageHeader = () => (
  <AppBar
    position="static"
    elevation={0}
    sx={{ backgroundColor: "transparent", padding: "1rem 2rem" }}
  >
    <Toolbar>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img
          src={Logo}
          alt="IoTurn Logo"
          style={{ height: "50px", marginRight: "16px", transform: "scale(3)" }}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Button
        variant="contained"
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          px: 3,
        }}
      >
        Acessar
      </Button>
    </Toolbar>
  </AppBar>
);

const HeroSection = () => (
  <Container
    maxWidth="md"
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      py: 4,
    }}
  >
    <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 2 }}>
      Monitoramento <br />
      IoT{" "}
      <Typography
        component="span"
        variant="h2"
        color="primary"
        sx={{ fontWeight: "bold" }}
      >
        inteligente
      </Typography>{" "}
      <br />
      para sua indústria
    </Typography>
    <Typography
      variant="h6"
      component="p"
      color="text.secondary"
      sx={{ mb: 4, maxWidth: "600px" }}
    >
      Conecte, monitore e otimize seus dispositivos industriais em tempo real.
      Uma plataforma completa para transformar dados em decisões.
    </Typography>
    <Button
      variant="contained"
      size="large"
      endIcon={<ArrowRight size={20} />}
      sx={{
        borderRadius: "20px",
        textTransform: "none",
        py: 1.5,
        px: 4,
        fontSize: "1rem",
        "& .MuiButton-endIcon": {
          transition: "transform 0.2s ease-in-out",
        },
        "&:hover .MuiButton-endIcon": {
          transform: "translateX(5px)",
        },
      }}
    >
      Acessar plataforma
    </Button>
    <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircle2 size={16} color="#2979ff" />
        <Typography variant="body2" color="text.secondary">
          Acesso direto ao painel
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CheckCircle2 size={16} color="#2979ff" />
        <Typography variant="body2" color="text.secondary">
          Monitoramento em tempo real
        </Typography>
      </Stack>
    </Stack>
  </Container>
);

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <PageHeader />
      <HeroSection />
    </Box>
  );
}

export default Home;
