import React, { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "@mui/material";
import GenericManagementPage from "../../pages/Gerenciamento/components/GenericManagementPage";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllMachineData } from "../../services/machineService";
import StatusChip from "../../components/StatusChip";
import { Link } from "react-router-dom";
import EditMachineModal from "./components/Edit/EditMachineModal";


const filterCallback = (machine, term) =>
  machine.name?.toLowerCase().includes(term) ||
  machine.serialNumber?.toLowerCase().includes(term) ||
  machine.manufacturer?.toLowerCase().includes(term);

const GerenciamentoMaquinas = () => {
  const { 
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetchData 
  } = useDataManagement(fetchAllMachineData, filterCallback);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);

  const columns = [
    { header: "Nome da Máquina", field: "name" },
    { header: "Número de Série", field: "serialNumber" },
    {
      header: "Fabricante/Modelo",
      render: (m) => `${m.manufacturer || "–"} - ${m.model || "–"}`,
    },
    { header: "Status", render: (m) => <StatusChip status={m.status} /> },
    { header: "Cliente", field: "company" },
    { header: "Dispositivo IoT", field: "iotDevice" },
  ];

  const handleEditClick = (machine) => {
    setEditingMachine(machine);
    setEditModalOpen(true);
  };

  // Função chamada ao salvar no modal
  const handleMachineUpdated = (updatedMachine) => {
    console.log("Máquina atualizada:", updatedMachine);
    setEditModalOpen(false);

    if(refetchData){
      refetchData();
    }
  };

  const renderAddButton = () => (
    <Button
      component={Link}
      to="/main/maquinas/cadastro"
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
  );

  return (
    <>
      <GenericManagementPage
        title="Máquinas Disponiveis"
        icon={Activity}
        total={filteredData.length}
        description="Lista completa de equipamentos industriais cadastrados no sistema"
        searchPlaceholder="Buscar"
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        renderAddButton={renderAddButton}
        onEdit={handleEditClick}
      />
      <EditMachineModal // 👈 Corrija o nome se for outro
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        machineData={editingMachine}
        onMachineUpdated={handleMachineUpdated}
      />
    </>
  );
};

export default GerenciamentoMaquinas;
