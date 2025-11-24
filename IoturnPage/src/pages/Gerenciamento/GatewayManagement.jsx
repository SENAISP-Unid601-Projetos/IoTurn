import React, { useState } from "react";
import { WifiCog } from "lucide-react";
import GenericManagementPage from "../Gerenciamento/components/GenericManagementPage";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllGatewayData } from "../../services/GatewayService";
import GatewayModal from "../Cadastro/components/Modals/GatewayModal/GatewayModal";
import EditGatewayModal from "../Gerenciamento/components/Edit/EditGatewayModal";
import StatusChip from "../../components/StatusChip";

const filterCallback = (gateway, term) =>
  gateway.gatewayId?.toLowerCase().includes(term) ||
  gateway.description?.toLowerCase().includes(term);

const GerenciamentoGateways = () => {
  const {
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetchData,
  } = useDataManagement(fetchAllGatewayData, filterCallback);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);

  const handleEditClick = (gateway) => {
    setEditingGateway(gateway);
    setEditModalOpen(true);
  };

  const handleGatewayUpdated = () => {
    setEditModalOpen(false);
    if (refetchData) refetchData();
  };

  const columns = [
    { header: "Gateway ID", field: "gatewayId" },
    { header: "Descrição / Localização", field: "description" },
    {
      header: "Status",
      render: (item) => <StatusChip status={item.status} />,
    },
    {
      header: "Dispositivos Conectados",
      field: "connectedDevices",
      render: (item) => item.connectedDevices ?? "–",
    },
    { header: "Último Heartbeat", field: "lastHeartbeat" },
  ];

  return (
    <>
      <GenericManagementPage
        title="Gateways ESP32"
        icon={WifiCog}
        total={filteredData.length}
        description="Lista completa de Gateways ESP32 cadastrados no sistema"
        searchPlaceholder="Buscar por Gateway ID"
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        onAdd={() => setModalOpen(true)}
        onEdit={handleEditClick}
        onDelete={(item) => console.log("Deletar gateway", item)}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        addButtonLabel="+ Novo Gateway"
      />

      <GatewayModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <EditGatewayModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        gatewayData={editingGateway}
        onGatewayUpdated={handleGatewayUpdated}
      />
    </>
  );
};

export default GerenciamentoGateways;
