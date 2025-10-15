import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Link,
    InputAdornment,
    IconButton,
    Divider,
    Stack,
    Paper,
} from "@mui/material";
import { Zap, Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import { transform } from "framer-motion";
import theme from "../theme";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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
                            label="Email"
                            fullWidth
                            sx={textFieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail size={20} color="gray" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Senha"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            sx={textFieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={20} color="gray" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
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

                        <Button href="/main" variant="contained" size="large" fullWidth sx={{ py: 1.5 }}>
                            Acessar Plataforma
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}

export default Login;