import React from "react";
import { Box, Divider } from "@mui/material";
import PageHeader from "./components/PageHeader";
import HeroSection from "./components/HeroSection";
import MoreInfos from "./components/MoreInfos";
import CallSection from "./components/CallSection";
import PageFooter from "./components/PageFooter";

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