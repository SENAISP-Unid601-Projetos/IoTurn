import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} />

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          color: "text.primary",
          p: 3,
          transition: "margin-left 0.3s ease-in-out",
          ml: isSidebarOpen ? "280px" : "0px",
        }}
      >
        <IconButton
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          sx={{
            position: "fixed",
            top: 16,
            left: isSidebarOpen ? 290 : 16,
            zIndex: 1201,
            backgroundColor: "background.paper",
            boxShadow: 1,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <Menu />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MainLayout;
