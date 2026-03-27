import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BaseDialog from "../../components/BaseDialog";
import type { Order, OrderStatus } from "../../core/models/order.model";
import { orderService } from "../../services/order.service";

const statusColor: Record<OrderStatus, { bg: string; color: string }> = {
  placed: { bg: "#e3f2fd", color: "#1565c0" },
  approved: { bg: "#fff8e1", color: "#f57f17" },
  delivered: { bg: "#e8f5e9", color: "#2e7d32" },
};

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", py: 1.5, gap: 2 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="#888"
          sx={{ width: 90, flexShrink: 0 }}
        >
          {label}
        </Typography>
        {children}
      </Box>
      <Divider />
    </>
  );
}

interface Props {
  open: boolean;
  orderId: number | null;
  onClose: () => void;
}

export default function OrderDetailDialog({ open, orderId, onClose }: Props) {
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      setIsLoading(true);
      orderService
        .getOrderById(orderId)
        .then((data) => {
          setOrderData(data);
        })
        .catch(() => {
          onClose();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (!open) setOrderData(null);
  }, [open, orderId]);

  return (
    <BaseDialog
      open={open}
      title="Detail Order"
      mode="detail"
      onClose={onClose}
    >
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#f97316" }} />
        </Box>
      ) : orderData ? (
        <Box>
          <InfoRow label="ID">
            <Typography variant="body2">{orderData.id}</Typography>
          </InfoRow>
          <InfoRow label="Pet">
            <Typography variant="body2">
              {orderData.petName || orderData.petId}
            </Typography>
          </InfoRow>
          <InfoRow label="Quantity">
            <Typography variant="body2">{orderData.quantity}</Typography>
          </InfoRow>
          <InfoRow label="Ship Date">
            <Typography variant="body2">
              {new Date(orderData.shipDate).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </InfoRow>
          <InfoRow label="Status">
            <Chip
              label={
                orderData.status.charAt(0).toUpperCase() +
                orderData.status.slice(1)
              }
              size="small"
              sx={{
                bgcolor: statusColor[orderData.status].bg,
                color: statusColor[orderData.status].color,
                fontWeight: 500,
              }}
            />
          </InfoRow>
          <InfoRow label="Selesai">
            {orderData.complete ? (
              <CheckCircle sx={{ color: "#2e7d32" }} fontSize="small" />
            ) : (
              <RadioButtonUnchecked
                sx={{ color: "#9e9e9e" }}
                fontSize="small"
              />
            )}
          </InfoRow>
        </Box>
      ) : null}
    </BaseDialog>
  );
}
