import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>
);
