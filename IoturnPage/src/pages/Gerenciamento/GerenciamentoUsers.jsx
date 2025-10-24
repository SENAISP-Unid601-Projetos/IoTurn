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
import { Search as SearchIcon, Edit, AlertCircle, User, Trash2 } from "lucide-react";
import { alpha } from "@mui/material/styles";
import theme from "../../theme";
import { fetchAllUserData } from "../../services/usersService";
import StatusChip from "../../components/StatusChip";
import { formatTimestamp } from "../../utils/formatters";
import { useDataManagement } from "../../hooks/useDataManagement";

// Função de filtro específica para usuários
const filterCallback = (user, term) =>
  user.name?.toLowerCase().includes(term) ||
  user.email?.toLowerCase().includes(term) ||
  user.userType?.toLowerCase().includes(term);

const GerenciamentoUsers = () => {
  const {
    filteredData: filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useDataManagement(fetchAllUserData, filterCallback);

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
          <User color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Usuários
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
          + Novo Usuário
        </Button>
      </Box>

      {!error && (
        <>
          {/* Info Box */}
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
                Total de Usuários: {filteredUsers.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lista completa de usuários cadastrados no sistema
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
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name || "–"}</TableCell>
                        <TableCell>{user.email || "–"}</TableCell>
                        <TableCell>{user.userType || "–"}</TableCell>
                        <TableCell><StatusChip status={user.status} /></TableCell>
                        <TableCell>{formatTimestamp(user.createdAt)}</TableCell>
                        <TableCell>
                          {user.client?.companyName || "–"}
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
                    ))
                  )}
                </>
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
            Falha ao carregar os dados: {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GerenciamentoUsers;