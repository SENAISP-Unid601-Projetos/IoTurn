import React, { useState } from "react";
import { User } from "lucide-react";
import GenericManagementPage from "../../pages/Gerenciamento/components/GenericManagementPage";
import { useDataManagement } from "../../hooks/useDataManagement";
import { fetchAllUserData } from "../../services/usersService";
import { formatTimestamp } from "../../utils/formatters";
import UserModal from "../Cadastro/components/Modals/UserModal/UserModal";
import EditUserModal from "../Gerenciamento/components/Edit/EditUserModal";
import StatusChip from "../../components/StatusChip";

const filterCallback = (user, term) =>
  user.name?.toLowerCase().includes(term) ||
  user.email?.toLowerCase().includes(term) ||
  user.userType?.toLowerCase().includes(term);

const GerenciamentoUsers = () => {
  const { filteredData, loading, error, searchTerm, setSearchTerm } =
    useDataManagement(fetchAllUserData, filterCallback);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    setEditModalOpen(false);
    if (refetchData) refetchData();
  };

  const columns = [
    { header: "Nome", field: "name" },
    { header: "Email", field: "email" },
    { header: "Cargo", field: "userType" },
    {
      header: "Status",
      render: (user) => <StatusChip status={user.status} />,
    },
    {
      header: "Data Criação",
      render: (user) => formatTimestamp(user.createdAt),
    },
    {
      header: "Cliente",
      render: (user) => user.client?.companyName || "–",
    },
  ];

  return (
    <>
      <GenericManagementPage
        title="Usuários"
        icon={User}
        total={filteredData.length}
        description="Lista completa de usuários cadastrados no sistema"
        searchPlaceholder="Buscar"
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        onAdd={() => setModalOpen(true)}
        onEdit={handleEditClick}
        onDelete={(user) => console.log("Deletar usuário", user)}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        addButtonLabel="+ Novo Usuário"
      />

      <UserModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userData={editingUser}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
};

export default GerenciamentoUsers;
