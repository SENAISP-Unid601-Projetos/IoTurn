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
import { Search as SearchIcon, Edit, Delete, AlertCircle } from "lucide-react";
import { alpha } from "@mui/material/styles";
import theme from "../../theme";
import { fetchAllUserData } from "../../services/usersService";
import { Activity, Trash2 } from "lucide-react";

const GerenciamentoUsers = () => {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // const data = (await fetchAllUserData())
        const data = [
          {
            id: "1",
            name: "João da Silva",
            email: "joao.silva@example.com",
            userType: "ADMIN",
            status: "ACTIVE",
            createdAt: "2025-10-22T16:56:25.922Z",
            client: { companyName: "Nome da Empresa LTDA" },
          },
        ];
        setMachines(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar máquinas:", err);
        setError("Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredMachines = machines.filter(
    (machine) =>
      machine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusChip = (machineStatus) => {
    switch (machineStatus) {
      case "ACTIVE":
        return (
          <Chip
            label="Ativo"
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
      case "SUSPENDED":
        return (
          <Chip
            label="Suspenso"
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              border: `1px solid ${theme.palette.warning.main}`,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        );
      case "CANCELED":
        return (
          <Chip
            label="Cancelado"
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
            label="Desconhecido"
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
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data Criação</TableCell>
                  <TableCell>Cliente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody key={"uniqueId"}>
                <>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredMachines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMachines.map((user) => (
                      <React.Fragment key={user.id}>
                        {/* key added here */}
                        <TableRow key={user.id}>
                          <TableCell>{user.name || "–"}</TableCell>
                          <TableCell>{user.email || "–"}</TableCell>
                          <TableCell>{user.userType || "–"}</TableCell>
                          <TableCell>{renderStatusChip(user.status)}</TableCell>
                          <TableCell>{user.createdAt || "–"}</TableCell>
                          <TableCell>
                            {user.client.companyName || "–"}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "primary.main",
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
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
                                    bgcolor: alpha(
                                      theme.palette.error.main,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* ✅ Mensagem de erro (só aparece se houver erro) */}
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

export default GerenciamentoUsers;
