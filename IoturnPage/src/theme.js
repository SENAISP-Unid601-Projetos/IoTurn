import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Tema escuro
    primary: {
      main: "#2979ff", // --primary-blue
      dark: "#1c64f2", // --primary-blue-hover
    },
    secondary: {
      main: "#58a6ff", // --text-link
    },
    background: {
      default: "#0d1117", // --background-dark
      paper: "#161b22", // --background-light
    },
    text: {
      primary: "#f0f6fc", // --text-light
      secondary: "#8b949e", // --text-secondary
    },
    success: {
      main: "#238636", // --success
    },
    warning: {
      main: "#dbab09", // --warning
    },
    error: {
      main: "#da3633", // --danger
    },
  },
});

export default theme;
