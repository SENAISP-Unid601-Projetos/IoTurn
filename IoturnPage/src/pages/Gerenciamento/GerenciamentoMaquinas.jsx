import React from "react";
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
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Edit, AlertCircle, Activity, Trash2 } from "lucide-react";
import { alpha } from "@mui/material/styles";
import theme from "../../theme";
import { fetchAllMachineData } from "../../services/machineService";
import StatusChip from "../../components/StatusChip";
import { useDataManagement } from "../../hooks/useDataManagement";

// Função de filtro específica para máquinas
const filterCallback = (machine, term) =>
  machine.name?.toLowerCase().includes(term) ||
  machine.serialNumber?.toLowerCase().includes(term) ||
  machine.manufacturer?.toLowerCase().includes(term);

const GerenciamentoMaquinas = () => {
  const {
    filteredData: filteredMachines,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useDataManagement(fetchAllMachineData, filterCallback);

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
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Activity color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Máquinas Disponiveis
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
          + Nova Máquina
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
              bgcolor: "theme.palette.background.default",
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Total de Máquinas: {filteredMachines.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lista completa de equipamentos industriais cadastrados no
                sistema
              </Typography>
            </Box>
            <TextField
              placeholder="Buscar"
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
                      <TableCell>{machine.name || "–"}</TableCell>
                      <TableCell>{machine.serialNumber || "–"}</TableCell>
                      <TableCell>
                        {machine.manufacturer || "–"} - {machine.model || "–"}
                      </TableCell>
                      <TableCell><StatusChip status={machine.status} /></TableCell>
                      <TableCell>{machine.company || "–"}</TableCell>{" "}
                      <TableCell>{machine.iotDevice || "–"}</TableCell>{" "}
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

      {/* Mensagem de erro */}
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
            {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GerenciamentoMaquinas;