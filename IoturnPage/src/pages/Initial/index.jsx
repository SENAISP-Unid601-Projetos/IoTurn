import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "../../assets/LogoSemBorda.png";
import MoreInfoCards from "../../components/home/CardInfo";

const PageHeader = () => (
  <AppBar
    position="static"
    elevation={0}
    sx={{ backgroundColor: "transparent" }}
  >
    <Container maxWidth="lg">
      <Toolbar sx={{ padding: { xs: "0", md: "0 1.5rem" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={Logo}
            alt="IoTurn Logo"
            sx={{
              height: "50px",
              transform: "scale(5)",
              width: "auto",
              py: 2,
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          href="/login"
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontSize: "1rem",
          }}
        >
          Acessar
        </Button>
      </Toolbar>
    </Container>
  </AppBar>
);

const BtnAcess = () => (
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

const HeroSection = () => (
  <Container
    maxWidth="md"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      py: { xs: 4, md: 8 },
    }}
  >
    <Typography
      variant="h1"
      component="h1"
      sx={{
        fontWeight: "bold",
        mb: 2,
        fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
      }}
    >
      Monitoramento <br />
      IoT{" "}
      <Typography
        component="span"
        variant="inherit"
        color="primary"
        sx={{ fontWeight: "bold" }}
      >
        inteligente
      </Typography>{" "}
      <br />
      para sua indústria
    </Typography>
    <Typography
      variant="h5"
      component="p"
      color="text.secondary"
      sx={{
        mb: 4,
        maxWidth: "600px",
        fontSize: { xs: "1rem", md: "1.25rem" },
      }}
    >
      Conecte, monitore e otimize seus dispositivos industriais em tempo real.
      Uma plataforma completa para transformar dados em decisões.
    </Typography>
    <BtnAcess />
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 4 }}
      sx={{ mt: 4 }}
    >
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

const MoreInfos = () => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      py: { xs: 4, md: 8 },
    }}
  >
    <Typography
      component="h2"
      variant="h3"
      sx={{
        fontWeight: "bold",
        fontSize: { xs: "2rem", md: "2.5rem" },
      }}
    >
      Tudo que você precisa em um só lugar
    </Typography>
    <Typography
      component="p"
      variant="h6"
      color="text.secondary"
      sx={{
        mt: 1,
        maxWidth: { xs: "90%", md: "60%" },
        fontSize: { xs: "1rem", md: "1.125rem" },
      }}
    >
      Ferramentas poderosas para gerenciar sua infraestrutura IoT com eficiência
      e segurança.
    </Typography>
    <MoreInfoCards />
  </Container>
);

const CallSection = () => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      py: { xs: 4, md: 8 },
    }}
  >
    <Typography
      component="h2"
      variant="h3"
      sx={{
        fontWeight: "bold",
        mt: 2,
        fontSize: { xs: "2rem", md: "2.5rem" },
      }}
    >
      Pronto para transformar sua operação?
    </Typography>
    <Typography
      variant="h6"
      component="p"
      color="text.secondary"
      sx={{ my: 4, fontSize: { xs: "1rem", md: "1.125rem" } }}
    >
      Junte-se a empresas que já confiam na IoTurn para monitorar sua
      infraestrutura.
    </Typography>
    <BtnAcess />
  </Container>
);

const PageFooter = () => (
  <Box sx={{ width: "100%", py: 3 }}>
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: { xs: "120px", md: "60px" },
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="IoTurn Logo"
        sx={{
          height: "50px",
          width: "auto",
        }}
      />

      <Typography variant="body2" color="text.secondary">
        © 2025 IoTurn. Plataforma de Monitoramento Industrial.
      </Typography>
    </Container>
  </Box>
);

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box component="main" sx={{ flexGrow: 1 }}>
        <PageHeader />
        <Divider />
        <HeroSection />
        <Divider />
        <MoreInfos />
        <Divider />
        <CallSection />
        <Divider />
        <PageFooter />
      </Box>
    </Box>
  );
}

export default Home;
