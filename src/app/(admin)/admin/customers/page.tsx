"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, Modal, Spinner } from "@/shared/ui";
import { useAdminUsers } from "@/features/admin/users";
import type { UserRole, UserStatus, UserFilters } from "@/entities/user";
import {
  Search,
  Filter,
  Eye,
  UserX,
  UserCheck,
  Shield,
  X,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  customer: { label: "Cliente", color: "bg-blue-100 text-blue-800" },
  admin: { label: "Admin", color: "bg-purple-100 text-purple-800" },
  super_admin: { label: "Super Admin", color: "bg-red-100 text-red-800" },
};

const statusConfig: Record<UserStatus, { label: string; color: string }> = {
  active: { label: "Activo", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactivo", color: "bg-gray-100 text-gray-800" },
  suspended: { label: "Suspendido", color: "bg-red-100 text-red-800" },
};

const roles: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "Todos los roles" },
  { value: "customer", label: "Clientes" },
  { value: "admin", label: "Administradores" },
  { value: "super_admin", label: "Super Admins" },
];

const statuses: { value: UserStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "suspended", label: "Suspendido" },
];

export default function CustomersPage() {
  const {
    users,
    selectedUser,
    isLoading,
    error,
    loadUsers,
    getUser,
    updateUserStatus,
    clearSelectedUser,
    clearError,
  } = useAdminUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  // Modal states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<{
    id: string;
    status: UserStatus;
  } | null>(null);

  // Load users on mount and when filters change
  useEffect(() => {
    const filters: UserFilters = {};
    if (roleFilter !== "all") {
      filters.role = roleFilter;
    }
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    if (searchQuery) {
      filters.query = searchQuery;
    }
    loadUsers(filters);
  }, [roleFilter, statusFilter, loadUsers]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: UserFilters = { query: searchQuery };
      if (roleFilter !== "all") {
        filters.role = roleFilter;
      }
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      loadUsers(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handlers
  const handleViewUser = async (id: string) => {
    await getUser(id);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    clearSelectedUser();
  };

  const handleStatusChange = (id: string, newStatus: UserStatus) => {
    setUserToUpdate({ id, status: newStatus });
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (userToUpdate) {
      await updateUserStatus(userToUpdate.id, userToUpdate.status);
      setIsStatusModalOpen(false);
      setUserToUpdate(null);
    }
  };

  const handleRefresh = () => {
    const filters: UserFilters = {};
    if (roleFilter !== "all") {
      filters.role = roleFilter;
    }
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    if (searchQuery) {
      filters.query = searchQuery;
    }
    loadUsers(filters);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500">
            Gestiona los usuarios registrados en la tienda
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "border-primary text-primary" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {(roleFilter !== "all" || statusFilter !== "all") && (
                <span className="ml-2 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as UserRole | "all")
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as UserStatus | "all")
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="text-sm"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Card className="bg-white overflow-hidden">
        {isLoading && users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Usuario
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Rol
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Registro
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.displayName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleConfig[user.role].color}`}
                        >
                          {roleConfig[user.role].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[user.status].color}`}
                        >
                          {statusConfig[user.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt instanceof Date ? user.createdAt : new Date((user.createdAt as { seconds: number }).seconds * 1000))}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          {user.status === "active" ? (
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "suspended")
                              }
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Suspender usuario"
                            >
                              <UserX className="w-4 h-4 text-red-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, "active")
                              }
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              title="Activar usuario"
                            >
                              <UserCheck className="w-4 h-4 text-green-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-gray-500">
                Mostrando {users.length} usuarios
              </p>
            </div>
          </>
        )}
      </Card>

      {/* View User Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={handleCloseView}
        title="Detalles del Usuario"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {selectedUser.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedUser.displayName}
                </h3>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleConfig[selectedUser.role].color}`}
                  >
                    {roleConfig[selectedUser.role].label}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[selectedUser.status].color}`}
                  >
                    {statusConfig[selectedUser.status].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="font-medium">
                    {selectedUser.phone || "No registrado"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Fecha de Registro</p>
                  <p className="font-medium">
                    {formatDate(selectedUser.createdAt instanceof Date ? selectedUser.createdAt : new Date((selectedUser.createdAt as { seconds: number }).seconds * 1000))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Último Acceso</p>
                  <p className="font-medium">
                    {selectedUser.lastLoginAt ? formatDateTime(selectedUser.lastLoginAt instanceof Date ? selectedUser.lastLoginAt : new Date((selectedUser.lastLoginAt as { seconds: number }).seconds * 1000)) : 'Nunca'}
                  </p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            {selectedUser.addresses && selectedUser.addresses.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Direcciones</h4>
                <div className="space-y-2">
                  {selectedUser.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{address.label}</span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {address.street} {address.number}
                        {address.apartment && `, ${address.apartment}`}
                      </p>
                      <p className="text-gray-600">
                        {address.district}, {address.city}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div>
              <h4 className="font-semibold mb-3">Preferencias</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUser.preferences?.newsletter}
                    disabled
                    className="rounded"
                  />
                  Newsletter
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUser.preferences?.notifications}
                    disabled
                    className="rounded"
                  />
                  Notificaciones
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCloseView}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Change Confirmation Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Cambiar Estado de Usuario"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            <p>
              ¿Estás seguro de que deseas{" "}
              {userToUpdate?.status === "suspended" ? "suspender" : "activar"}{" "}
              este usuario?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={
                userToUpdate?.status === "suspended" ? "danger" : "primary"
              }
              onClick={handleConfirmStatusChange}
            >
              {userToUpdate?.status === "suspended" ? (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Suspender
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activar
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
