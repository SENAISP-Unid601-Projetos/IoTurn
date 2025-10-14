  import { createTheme } from '@mui/material/styles';

  const theme = createTheme({
    palette: {
      mode: 'dark', // Tema escuro
      primary: {
        main: '#2979ff',       // --primary-blue
        dark: '#1c64f2',       // --primary-blue-hover
      },
      secondary: {
        main: '#58a6ff',       // --text-link
      },
      background: {
        default: '#000000ff',    // --background-dark
        paper: '#006aff31',      // --background-light
      },
      text: {
        primary: '#f0f6fc', 
        secondary: '#8b949e' ,  
        tertiary: '#8b949e56',  
      },
      success: {
        main: '#00e42ed5',        // --success
      },
      warning: {
        main: '#dbab09',        // --warning
      },
      error: {
        main: '#da3633',        // --danger
      },
    },
  });

  export default theme;
