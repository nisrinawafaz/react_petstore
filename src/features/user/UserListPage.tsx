import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";
import SnackbarAlert from "../../components/SnackbarAlert";
import type { User } from "../../core/models/user.model";
import { useSnackbar } from "../../hooks/useSnackbar";
import { userService } from "../../services/user.service";
import UserDetailDialog from "./UserDetailDialog";
import UserFormDialog from "./UserFormDialog";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch {
      showSnackbar("Gagal memuat data user.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteUser?.username) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deleteUser.username);
      showSnackbar("User berhasil dihapus!", "success");
      setDeleteUser(null);
      loadUsers();
    } catch {
      showSnackbar("Gagal menghapus user.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Daftar User
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola semua data user
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
            sx={{
              bgcolor: "#f97316",
              "&:hover": { bgcolor: "#ea580c" },
              borderRadius: 2,
            }}
          >
            Tambah User
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#fed7aa" }} />

        <Box sx={{ p: 3 }}>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress sx={{ color: "#f97316" }} />
            </Box>
          )}

          {!isLoading && (
            <TableContainer sx={{ px: 1 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fff7ed" }}>
                    {[
                      "Username",
                      "First Name",
                      "Last Name",
                      "Email",
                      "Phone",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ color: "#f97316", fontWeight: 700, fontSize: 13 }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ color: "#999", py: 5 }}
                      >
                        Tidak ada data user
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.username} hover>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              user.userStatus === 1 ? "Active" : "Inactive"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                user.userStatus === 1 ? "#e8f5e9" : "#fce4ec",
                              color:
                                user.userStatus === 1 ? "#2e7d32" : "#c62828",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Detail">
                            <IconButton
                              size="small"
                              sx={{ color: "#3b82f6" }}
                              onClick={() => setDetailUser(user)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              sx={{ color: "#f97316" }}
                              onClick={() => setEditUser(user)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton
                              size="small"
                              sx={{ color: "#ef4444" }}
                              onClick={() => setDeleteUser(user)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={users.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{ borderTop: "1px solid #fed7aa", bgcolor: "#fff7ed" }}
              />
            </TableContainer>
          )}
        </Box>
      </Card>

      <UserFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          loadUsers();
          showSnackbar("User berhasil dibuat!", "success");
        }}
      />

      <UserFormDialog
        open={!!editUser}
        mode="edit"
        user={editUser ?? undefined}
        onClose={() => setEditUser(null)}
        onSuccess={() => {
          setEditUser(null);
          loadUsers();
          showSnackbar("User berhasil diupdate!", "success");
        }}
      />

      <UserDetailDialog
        open={!!detailUser}
        username={String(detailUser?.username)}
        onClose={() => setDetailUser(null)}
      />

      <ConfirmDialog
        open={!!deleteUser}
        title="Hapus User"
        message={`Yakin ingin menghapus user <strong>${deleteUser?.username}</strong>?`}
        subMessage="Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteUser(null)}
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
}
