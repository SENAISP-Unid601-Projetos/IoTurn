import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { Search as SearchIcon, Edit, Trash2, AlertCircle } from "lucide-react";
import { alpha } from "@mui/material/styles";
import theme from "../../../theme";

const GenericManagementPage = ({
  title,
  icon: IconComponent,
  total,
  description,
  searchPlaceholder,
  columns,
  data,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  renderAddButton,
  addButtonLabel = "+ Novo",
}) => {
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: "10px" }}>
          <IconComponent color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        {renderAddButton ? (
          renderAddButton()
        ) : (
          <Button
            onClick={onAdd}
            variant="contained"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              px: 2,
              py: 1,
            }}
          >
            {addButtonLabel}
          </Button>
        )}
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
              bgcolor: theme.palette.background.default,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Total de {title}: {total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            </Box>
            <TextField
              placeholder={searchPlaceholder}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={onSearchChange}
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
                  {columns.map((col, index) => (
                    <TableCell key={index}>{col.header}</TableCell>
                  ))}
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      Nenhum item encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.id}>
                      {columns.map((col, index) => (
                        <TableCell key={index}>
                          {col.render ? col.render(item) : item[col.field] || "–"}
                        </TableCell>
                      ))}
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
                            onClick={() => onEdit && onEdit(item)}
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
                            onClick={() => onDelete && onDelete(item)}
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

export default GenericManagementPage;