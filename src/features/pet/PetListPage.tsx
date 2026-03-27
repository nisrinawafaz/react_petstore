import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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
import type { Pet, PetStatus } from "../../core/models/pet.model";
import { useSnackbar } from "../../hooks/useSnackbar";
import { petService } from "../../services/pet.service";
import PetDetailDialog from "./PetDetailDialog";
import PetFormDialog from "./PetFormDialog";

const STATUS_OPTIONS: PetStatus[] = ["available", "pending", "sold"];

const statusColor: Record<PetStatus, { bg: string; color: string }> = {
  available: { bg: "#e8f5e9", color: "#2e7d32" },
  pending: { bg: "#fff8e1", color: "#f57f17" },
  sold: { bg: "#fce4ec", color: "#c62828" },
};

export default function PetListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<PetStatus[]>([
    "available",
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [detailPetId, setDetailPetId] = useState<number | null>(null);
  const [deletePet, setDeletePet] = useState<Pet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const loadPets = async () => {
    setIsLoading(true);
    try {
      const data = await petService.findByStatus(selectedStatuses);
      setPets(data);
    } catch {
      showSnackbar("Gagal memuat data pet.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, [selectedStatuses]);

  const handleDelete = async () => {
    if (!deletePet?.id) return;
    setIsDeleting(true);
    try {
      await petService.deletePet(deletePet.id);
      showSnackbar("Pet berhasil dihapus!", "success");
      setDeletePet(null);
      loadPets();
    } catch {
      showSnackbar("Gagal menghapus pet.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const paginatedPets = pets.slice(
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
              Daftar Pet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola semua data pet
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
            Tambah Pet
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#fed7aa" }} />

        <Box sx={{ p: 3 }}>
          <FormControl size="small" sx={{ minWidth: 250, mb: 3 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              multiple
              value={selectedStatuses}
              onChange={(e) =>
                setSelectedStatuses(e.target.value as PetStatus[])
              }
              input={<OutlinedInput label="Filter Status" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress sx={{ color: "#f97316" }} />
            </Box>
          )}

          {!isLoading && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fff7ed" }}>
                    {["ID", "Nama", "Kategori", "Status", "Aksi"].map((h) => (
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
                  {paginatedPets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ color: "#999", py: 5 }}
                      >
                        Tidak ada data pet
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPets.map((pet) => (
                      <TableRow key={pet.id} hover>
                        <TableCell sx={{ width: 80 }}>{pet.id}</TableCell>
                        <TableCell
                          sx={{ maxWidth: 200, wordBreak: "break-word" }}
                        >
                          {pet.name}
                        </TableCell>
                        <TableCell>{pet.category?.name || "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              pet.status.charAt(0).toUpperCase() +
                              pet.status.slice(1)
                            }
                            size="small"
                            sx={{
                              bgcolor: statusColor[pet.status].bg,
                              color: statusColor[pet.status].color,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Detail">
                            <IconButton
                              size="small"
                              sx={{ color: "#3b82f6" }}
                              onClick={() => setDetailPetId(pet.id!)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              sx={{ color: "#f97316" }}
                              onClick={() => setEditPet(pet)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton
                              size="small"
                              sx={{ color: "#ef4444" }}
                              onClick={() => setDeletePet(pet)}
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
                count={pets.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{ borderTop: "1px solid #fed7aa", bgcolor: "#fff7ed" }}
              />
            </TableContainer>
          )}
        </Box>
      </Card>
      <PetFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          loadPets();
          showSnackbar("Pet berhasil dibuat!", "success");
        }}
      />

      <PetFormDialog
        open={!!editPet}
        mode="edit"
        pet={editPet ?? undefined}
        onClose={() => setEditPet(null)}
        onSuccess={() => {
          setEditPet(null);
          loadPets();
          showSnackbar("Pet berhasil diupdate!", "success");
        }}
      />

      <PetDetailDialog
        open={!!detailPetId}
        petId={detailPetId}
        onClose={() => setDetailPetId(null)}
      />

      <ConfirmDialog
        open={!!deletePet}
        title="Hapus Pet"
        message={`Yakin ingin menghapus pet <strong>${deletePet?.name}</strong>?`}
        subMessage="Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeletePet(null)}
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
