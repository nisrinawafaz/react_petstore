import {
  Add,
  CheckCircle,
  Delete,
  RadioButtonUnchecked,
  Visibility,
} from "@mui/icons-material";
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
import type { Order, OrderStatus } from "../../core/models/order.model";
import { useSnackbar } from "../../hooks/useSnackbar";
import { orderService } from "../../services/order.service";
import OrderDetailDialog from "./OrderDetailDialog";
import OrderFormDialog from "./OrderFormDialog";

const statusColor: Record<OrderStatus, { bg: string; color: string }> = {
  placed: { bg: "#e3f2fd", color: "#1565c0" },
  approved: { bg: "#fff8e1", color: "#f57f17" },
  delivered: { bg: "#e8f5e9", color: "#2e7d32" },
};

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch {
      showSnackbar("Gagal memuat data order.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async () => {
    if (!deleteOrder?.id) return;
    setIsDeleting(true);
    try {
      await orderService.deleteOrder(deleteOrder.id);
      showSnackbar("Order berhasil dihapus!", "success");
      setDeleteOrder(null);
    } catch {
      showSnackbar("Gagal menghapus Order.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const paginatedOrders = orders.slice(
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
              Daftar Order
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola semua data order
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
            Tambah Order
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fff7ed" }}>
                    {[
                      "Pet Name",
                      "Qty",
                      "Ship Date",
                      "Status",
                      "Selesai",
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
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ color: "#999", py: 5 }}
                      >
                        Tidak ada data order
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell sx={{ width: 80 }}>
                          {order.petName || "-"}
                        </TableCell>
                        <TableCell
                          sx={{ maxWidth: 200, wordBreak: "break-word" }}
                        >
                          {order.quantity || "-"}
                        </TableCell>
                        <TableCell>{order.shipDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)
                            }
                            size="small"
                            sx={{
                              bgcolor: statusColor[order.status].bg,
                              color: statusColor[order.status].color,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {order.complete ? (
                            <CheckCircle
                              sx={{ color: "#2e7d32" }}
                              fontSize="small"
                            />
                          ) : (
                            <RadioButtonUnchecked
                              sx={{ color: "#9e9e9e" }}
                              fontSize="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Detail">
                            <IconButton
                              size="small"
                              sx={{ color: "#3b82f6" }}
                              onClick={() => setDetailOrderId(order.id!)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton
                              size="small"
                              sx={{ color: "#ef4444" }}
                              onClick={() => setDeleteOrder(order)}
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
                count={orders.length}
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
      <OrderFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          loadOrders();
          showSnackbar("Order berhasil dibuat!", "success");
        }}
      />

      <OrderDetailDialog
        open={!!detailOrderId}
        orderId={detailOrderId}
        onClose={() => setDetailOrderId(null)}
      />

      <ConfirmDialog
        open={!!deleteOrder}
        title="Hapus Pet"
        message={`Yakin ingin menghapus order <strong>${deleteOrder?.petName}</strong>?`}
        subMessage="Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOrder(null)}
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
