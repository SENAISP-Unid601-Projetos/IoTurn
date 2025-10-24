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
import StatusChip from "../../components/StatusChip";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllDeviceData } from "../../services/DeviceServices";
import { Cpu } from "lucide-react";


// Função de filtro específica para dispositivos
const filterCallback = (device, term) =>
  device.nodeId?.toLowerCase().includes(term) ||
  device.description?.toLowerCase().includes(term) ||
  device.machineName?.toLowerCase().includes(term);

const GerenciamentoDispositivos = () => {
  const {
    filteredData: filteredDevices,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useDataManagement(fetchAllDeviceData, filterCallback);

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
          <Cpu color={theme.palette.primary.dark} size={30} />{" "}
          {/* Ícone atualizado */}
          <Typography variant="h4" component="h1" fontWeight="bold">
            Dispositivos IoT
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
          + Novo Dispositivo
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
                Total de Dispositivos: {filteredDevices.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lista completa de sensores IoT cadastrados. A vinculação com
                gateway e máquina é feita no cadastro da máquina.
              </Typography>
            </Box>
            <TextField
              placeholder="Buscar por Node ID"
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
                    <SearchIcon
                      size={16}
                      color={theme.palette.text.secondary}
                    />
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
                  <TableCell>Node ID</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Máquina Vinculada</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Último Heartbeat</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhum dispositivo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.nodeId}</TableCell>
                      <TableCell>{device.description}</TableCell>
                      <TableCell>{device.machineName}</TableCell>
                      <TableCell>{device.gatewayId}</TableCell>
                      <TableCell><StatusChip status={device.status} /></TableCell>
                      <TableCell>{device.lastHeartbeat}</TableCell>
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

export default GerenciamentoDispositivos;
