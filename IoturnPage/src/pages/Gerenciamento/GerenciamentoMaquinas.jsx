// src/pages/Gerenciamento/GerenciamentoMaquinas.jsx
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
  Divider,
} from "@mui/material";
import { Search as SearchIcon, Edit, Delete } from "lucide-react";
import { alpha } from '@mui/material/styles';
import theme from "../../theme";

// Simulação de dados (substitua pelo fetch real)
const mockMachines = [
  {
    id: 1,
    name: "Torno CNC Setor A - Linha 1",
    serialNumber: "SN-2024-ABC-12345",
    manufacturer: "Siemens",
    model: "CNC-5000X",
    status: "ativo",
    client: "Indústria Metalúrgica Silva LTDA",
    iotDevice: "HELTEC-A8F3B2",
  },
  {
    id: 2,
    name: "Fresadora Setor B - Linha 2",
    serialNumber: "SN-2024-DEF-67890",
    manufacturer: "Fanuc",
    model: "MILL-3000",
    status: "ativo",
    client: "Fábrica de Componentes Tech SA",
    iotDevice: "HELTEC-C4D9E1",
  },
  {
    id: 3,
    name: "Prensa Hidráulica Setor C",
    serialNumber: "SN-2023-GHI-11223",
    manufacturer: "Haas",
    model: "PRESS-2000H",
    status: "suspenso",
    client: "Manufatura Industrial Brasil",
    iotDevice: "HELTEC-F7A2C8",
  },
];

const GerenciamentoMaquinas = () => {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Simula o carregamento dos dados
  useEffect(() => {
    const loadData = async () => {
      // Em produção, use: const data = await fetchAllMachineData();
      setTimeout(() => {
        setMachines(mockMachines);
        setLoading(false);
      }, 800); // Simula delay de API
    };
    loadData();
  }, []);

  // Filtra as máquinas pelo termo de busca
  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderiza o chip de status
  const renderStatusChip = (status) => {
    const isAtivo = status === "ativo";
    return (
      <Chip
        label={isAtivo ? "Ativo" : "Suspenso"}
        size="small"
        sx={{
          bgcolor: isAtivo ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
          color: isAtivo ? theme.palette.success.main : theme.palette.warning.main,
          border: `1px solid ${isAtivo ? theme.palette.success.main : theme.palette.warning.main}`,
          fontWeight: 600,
          fontSize: "0.75rem",
        }}
      />
    );
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
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Máquinas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerenciar equipamentos industriais
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 2,
            py: 1,
          }}
        >
          + Nova Máquina
        </Button>
      </Box>

      {/* Total e busca */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Total de Máquinas: {filteredMachines.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Lista completa de equipamentos industriais cadastrados no sistema
          </Typography>
        </Box>
        <TextField
          placeholder="Buscar por nome, número de série ou cliente"
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
          bgcolor: "background.paper",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Máquina</TableCell>
              <TableCell>Número de Série</TableCell>
              <TableCell>Fabricante/Modelo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Dispositivo IoT</TableCell>
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
            ) : filteredMachines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma máquina encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.serialNumber}</TableCell>
                  <TableCell>
                    {machine.manufacturer} - {machine.model}
                  </TableCell>
                  <TableCell>{renderStatusChip(machine.status)}</TableCell>
                  <TableCell>{machine.client}</TableCell>
                  <TableCell>{machine.iotDevice}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          color: "primary.main",
                          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: "error.main",
                          "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
                        }}
                      >
                        <Delete size={16} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GerenciamentoMaquinas;