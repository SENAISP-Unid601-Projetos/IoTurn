import { Container, Typography, Box } from "@mui/material";
import { Activity, BarChart3, Bell, Shield, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const cardData = [
  {
    icon: <Activity />,
    title: "Monitoramento em Tempo Real",
    description:
      "Acompanhe o status de todos os seus dispositivos e máquinas instantaneamente",
  },
  {
    icon: <BarChart3 />,
    title: "Análise de Dados",
    description:
      "Visualize métricas e tendências com dashboards intuitivos e personalizáveis",
  },
  {
    icon: <Bell />,
    title: "Alertas Inteligentes",
    description:
      "Receba notificações automáticas sobre eventos críticos e anomalias",
  },
  {
    icon: <Shield />,
    title: "Segurança Avançada",
    description:
      "Proteção de dados com criptografia e controle de acesso granular",
  },
  {
    icon: <Zap />,
    title: "Alta Performance",
    description: "Processamento rápido de milhares de eventos por segundo",
  },
  {
    icon: <Globe />,
    title: "Acesso Remoto",
    description: "Gerencie sua operação de qualquer lugar, a qualquer momento",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const MotionBox = motion(Box);

const InfoCard = ({ icon, title, description }) => (
  <MotionBox
    component="div"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={cardVariants}
    sx={{
      p: 3,
      textAlign: "left",
      backgroundColor: "background.default",
      border: "1px solid",
      borderColor: "grey.800",
      borderRadius: 3,
      cursor: 'pointer',
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      height: "100%",
      transition: "transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        borderColor: "primary.main",
      },
      "&:hover .icons": {
        backgroundColor: "primary.main",
        color: "text.primary",
      },
    }}
  >
    <Box
      className="icons"
      sx={{
        width: 48,
        height: 48,
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.paper",
        color: "primary.main",
        mb: 1,
        transition: "0.3s ease-in",
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
      {title}
    </Typography>
    <Typography color="text.secondary">{description}</Typography>
  </MotionBox>
);

const MoreInfos = () => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      py: 8,
    }}
  >
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 3,
      }}
    >
      {cardData.map((card, index) => (
        <InfoCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
        />
      ))}
    </Box>
  </Container>
);

export default MoreInfos;