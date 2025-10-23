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
import { Zap, Mail, Lock, Eye, EyeOff, CheckCircle, User } from "lucide-react";
import theme from "../theme";
import ApiService from "../services/ApiServices";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    
    // Usar bcrypt para rashear senha antes de enviar para o back-end

    // Envio deverá ser:
    // name: z.string().nonempty("O nome é obrigatório."), 
    // email: z.email(), 
    // password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    // userType: z.enum(UserType), 
    // status: z.enum(Status),
    // clientId: z.number().int().positive("O ID do cliente deve ser um número positivo."), 

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
        if (!isEmailValid) {
            setEmailError("Por favor, insira um email válido.");
        }
        if (!isPasswordValid) {
            setPasswordError("A senha deve ter no mínimo 8 caracteres.");
        }

        if (isEmailValid && isPasswordValid) {
            const data = {email: email, password: password};
            console.log("Validação OK!");
            console.log("Email:", email);
            console.log("Senha:", password);
        }


    };

    const textFieldStyles = {
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
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
                            label="Usuário"
                            fullWidth
                            sx={textFieldStyles}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} color="gray" />
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
                            label="Digite uma Senha"
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
                                        {isPasswordValid && !showPassword && <CheckCircle size={20} color={theme.palette.success.main} />}
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
                        <TextField
                            label="Confirme sua Senha"
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
                                        {isPasswordValid && !showPassword && <CheckCircle size={20} color={theme.palette.success.main} />}
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
                            href="login"
                            variant="body2"
                            sx={{ alignSelf: "flex-end", textDecoration: "none" }}
                        >
                            Já possuí conta?
                        </Link>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            href="/main/maquinas"
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

export default Register;