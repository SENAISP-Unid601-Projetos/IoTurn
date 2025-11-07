import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import { Zap, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import ApiService from "../services/ApiServices";
import JWTToken from "../services/JWTToken";
import theme from "../theme";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //WIP
  async function getCookie() {
    // "user=JohnDoe; expires=" +
    //   new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString() +
    //   "; path=/";
    try {
      const loginCredentials = {
        email: email,
        password: password,
      };

      // Espera a resposta da API (provavelmente um token JWT)
      const response = await ApiService.postRequest(
        "/clients/login",
        loginCredentials
      );

      // Verifica se a resposta contém um token
      if (response && response.token) {
        // Armazenando o token diretamente no cookie
        const cookie = JWTToken.setCookie("loginCookie", response.token, 7);
        document.cookie = cookie;
      } else {
        console.error("Token não encontrado na resposta da API", response);
      }
    } catch (error) {
      console.error("Erro ao tentar obter o cookie:", error);
    }
  }

  //WIP

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setIsEmailValid(true);
      setEmailError("");
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 8) {
      setIsPasswordValid(true);
      setPasswordError("");
    } else {
      setIsPasswordValid(false);
    }
  }, [password]);

  const handleLogin = () => {
    console.log("EEE");
    console.log("EEE");
    console.log("EEE");
    console.log("EEE");
    console.log("EEE");

    if (!isEmailValid) {
      setEmailError("Por favor, insira um email válido.");
    }
    if (!isPasswordValid) {
      setPasswordError("A senha deve ter no mínimo 8 caracteres.");
    }

    if (isEmailValid && isPasswordValid) {
      const data = { email: email, password: password };
    }
    document.cookie = getCookie();
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        transition:
          "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      },
      "&:hover fieldset": {
        borderColor: "primary.dark",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
      },
    },
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Stack sx={{ maxWidth: "400px", width: "100%" }} spacing={3}>
        <Stack alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              display: "inline-flex",
              backgroundColor: "background.paper",
            }}
          >
            <Zap color="#2979ff" size={32} />
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Monitoramento IoT
          </Typography>
          <Typography color="text.secondary">
            Acesse sua plataforma inteligente
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "text.tertiary",
            backgroundColor: "transparent",
          }}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              fullWidth
              sx={textFieldStyles}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color="gray" />
                  </InputAdornment>
                ),
                endAdornment: isEmailValid && (
                  <InputAdornment position="end">
                    <CheckCircle size={20} color={theme.palette.success.main} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={textFieldStyles}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="gray" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isPasswordValid && !showPassword && (
                      <CheckCircle
                        size={20}
                        color={theme.palette.success.main}
                      />
                    )}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Link
              href="#"
              variant="body2"
              sx={{ alignSelf: "flex-end", textDecoration: "none" }}
            >
              Esqueceu a senha?
            </Link>

            <Button
              variant="contained"
              size="large"
              fullWidth
              // href="/main/maquinas"
              sx={{ py: 1.5 }}
              onClick={handleLogin}
            >
              Acessar Plataforma
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default Login;
