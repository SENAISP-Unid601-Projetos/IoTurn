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
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Factory,
  FileText,
  Phone,
  Compass,
} from "lucide-react";
import ApiService from "../services/ApiServices";
import theme from "../theme";
import { useNavigate } from "react-router-dom";

//Aqui vai se fazer o registro dos clientes isso é empresas.

// Não Funcionais

// Formatação - fazer campo de 14 caracteres com formatação
// Formatação - Email
// Formatação - Telefone
// Formatação - Senha
// Formatação - Confirmar Senha

function Registro() {
  // Constantes de envio Fetch Post
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const changeLink = useNavigate();

  // Constantes de validação
  const [extraPassword, setExtraPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cnpjError, setCnpjError] = useState("");

  // Constantes de Feedback visual
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // WIP feedback visual
  const [isCnpjValid, setIsCnpjValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //EMAIL validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setIsEmailValid(true);
      setEmailError("");
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  //PASSWORD validation
  useEffect(() => {
    if (password.length >= 8) {
      setIsPasswordValid(true);
      setPasswordError("");
    } else {
      setIsPasswordValid(false);
    }
  }, [password]);

  //CNPJ validation
  useEffect(() => {
    const regex = /^\d{14}$/;
    if (cnpj.length === 0) {
      setIsCnpjValid(false);
      setCnpjError("");
    } else if (regex.test(cnpj) && !cnpj.length !== 0) {
      setIsCnpjValid(true);
      setCnpjError("");
    } else {
      setIsCnpjValid(false);
      setCnpjError("Campo CNPJ Incorreto");
    }
  }, [cnpj]);

  // PostRequest
  const handleLogin = async () => {
    if (!isEmailValid) setEmailError("Por favor, insira um email válido.");
    if (!isPasswordValid)
      setPasswordError("A senha deve ter no mínimo 8 caracteres.");
    if (!isCnpjValid) setCnpjError("Campo CNPJ Incorreto");
    if (isEmailValid && isPasswordValid && isCnpjValid) {
      const registrationData = {
        companyName: empresa,
        cnpj: cnpj,
        phone: phone,
        address: adress,
        email: email,
        password: password,
      };

      try {
        await ApiService.postRequest("/clients/create", registrationData);
      } catch (error) {
        if (error.status === 409) {
          setIsEmailValid(false);
          setEmailError("e-mail ou CNPJ já cadastrados");
        } else {
          changeLink("/login");
        }
      }
    }

    // WIP fazer post para clientes em clients/create
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
          {/*WIP Fazer validação para nome da empresa */}
          {/* Campo Empresa */}
          <Stack spacing={2.5}>
            <TextField
              label="Empresa"
              fullWidth
              sx={textFieldStyles}
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Factory size={20} color="gray" />
                  </InputAdornment>
                ),
              }}
            />

            {/* WIP especificar CNPJ trocando função isEmailValid*/}
            {/* Campo CNPJ */}
            <TextField
              label="CNPJ (Apenas números)"
              fullWidth
              sx={textFieldStyles}
              value={cnpj}
              error={!!cnpjError}
              helperText={cnpjError}
              onChange={(e) => setCnpj(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FileText size={20} color="gray" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Campo Telefone */}
            <TextField
              label="Telefone"
              fullWidth
              sx={textFieldStyles}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={20} color="gray" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Campo Endereço */}
            <TextField
              label="Endereço"
              fullWidth
              sx={adress}
              value={adress}
              onChange={(e) => setAddress(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Compass size={20} color="gray" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Campo Email */}
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

            {/* Campo Senha */}
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

            {/* Campo ConfirmaSenha */}
            <TextField
              label="Confirmar Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={textFieldStyles}
              value={extraPassword}
              onChange={(e) => setExtraPassword(e.target.value)}
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
              href="/login"
              variant="body2"
              sx={{ alignSelf: "flex-end", textDecoration: "none" }}
            >
              Já tem uma conta ?
            </Link>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleLogin}
            >
              Registrar
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default Registro;
