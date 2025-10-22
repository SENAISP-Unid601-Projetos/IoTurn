// pages/Gerenciamento/GerenciamentoGateways.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Edit, Trash2, AlertCircle } from "lucide-react";
import { alpha } from "@mui/material/styles";
import theme from "../../theme";
import { WifiCog } from "lucide-react";
import { fetchAllGatewayData } from "../../services/GatewayService";


const formatTimestamp = (timestamp) => {
  if (!timestamp) return '–';
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR');
};

const GerenciamentoGateways = () => {
  const [gateways, setGateways] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllGatewayData(); real
        setGateways(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar gateways:", err);
        setError("Falha ao carregar os gateways");
      } finally {
        setLoading(false);
      }
    }; 

    loadData();
  }, []);

  const filteredGateways = gateways.filter((gateway) =>
    gateway.gatewayId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gateway.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusChip = (status) => {
    switch (status) {
      case "ONLINE":
        return (
          <Chip
            label="Online"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              border: `1px solid ${theme.palette.success.main}`,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        );
      case "OFFLINE":
        return (
          <Chip
            label="Offline"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              border: `1px solid ${theme.palette.error.main}`,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        );
      default:
        return (
          <Chip
            label={status || "Desconhecido"}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.text.secondary, 0.1),
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.text.secondary}`,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: "10px" }}>
          <WifiCog color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gateways ESP32
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 2,
            py: 1,
          }}
        >
          + Novo Gateway
        </Button>
      </Box>

      {!error && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Total de Gateways: {filteredGateways.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lista completa de Gateways ESP32 cadastrados no sistema
              </Typography>
            </Box>
            <TextField
              placeholder="Buscar por Gateway ID"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 300,
                bgcolor: "background.default",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={16} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Tabela */}
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Gateway ID</TableCell>
                  <TableCell>Descrição / Localização</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Dispositivos Conectados</TableCell>
                  <TableCell>Último Heartbeat</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredGateways.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum gateway encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGateways.map((gateway) => (
                    <TableRow key={gateway.id}>
                      <TableCell>{gateway.gatewayId || "–"}</TableCell>
                      <TableCell>{gateway.description || "–"}</TableCell>
                      <TableCell>{renderStatusChip(gateway.status)}</TableCell>
                      <TableCell>{gateway.connectedDevices ?? "–"}</TableCell>
                      <TableCell>{formatTimestamp(gateway.lastHeartbeat)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <Edit size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: "error.main",
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {error && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "#2d0000",
            color: "white",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderLeft: `4px solid ${theme.palette.error.main}`,
          }}
        >
          <AlertCircle size={18} color="#ff6b6b" />
          <Typography variant="body2" fontWeight="medium">
            Falha ao carregar os dados: {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GerenciamentoGateways;