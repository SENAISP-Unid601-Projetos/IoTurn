import React, { useState } from "react";
import { Cpu } from "lucide-react";
import GenericManagementPage from "../Gerenciamento/components/GenericManagementPage";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllDeviceData } from "../../services/DeviceServices";
import DispositivoModal from "../Cadastro/components/Modals/DeviceModal/DeviceModal";
import StatusChip from "../../components/StatusChip"; 

const filterCallback = (device, term) =>
  device.nodeId?.toLowerCase().includes(term) ||
  device.description?.toLowerCase().includes(term) ||
  device.machineName?.toLowerCase().includes(term);

const GerenciamentoDispositivos = () => {
  const {
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useDataManagement(fetchAllDeviceData, filterCallback);

  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { header: "Node ID", field: "nodeId" },
    { header: "Descrição", field: "description" },
    { header: "Máquina Vinculada", field: "machineName" },
    { header: "Gateway", field: "gatewayId" },
    { 
      header: "Status", 
      render: (item) => <StatusChip status={item.status} /> 
    },
    { header: "Último Heartbeat", field: "lastHeartbeat" },
  ];

  return (
    <> 
      <GenericManagementPage
        title="Dispositivos IoT"
        icon={Cpu}
        total={filteredData.length}
        description="Lista completa de sensores IoT cadastrados. A vinculação com gateway e máquina é feita no cadastro da máquina."
        searchPlaceholder="Buscar por Node ID"
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        onAdd={() => setModalOpen(true)}
        onEdit={(item) => console.log("Editar dispositivo", item)}
        onDelete={(item) => console.log("Deletar dispositivo", item)}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        addButtonLabel="+ Novo Dispositivo"
      />
      <DispositivoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default GerenciamentoDispositivos;