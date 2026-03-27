import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  mode?: "form" | "detail";
  confirmLabel?: string;
  closeLabel?: string;
  isLoading?: boolean;
  isFormInvalid?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
  children: ReactNode;
}

export default function BaseDialog({
  open,
  title,
  subtitle,
  mode = "form",
  confirmLabel = "Simpan",
  closeLabel = "Tutup",
  isLoading = false,
  isFormInvalid = false,
  onConfirm,
  onClose,
  children,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          px: 3,
          pt: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} color="#ea580c">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{ px: 3, py: 2, maxHeight: "65vh", overflowY: "auto" }}
      >
        {children}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 2, borderTop: "1px solid #f3f4f6" }}>
        {mode === "form" ? (
          <>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderColor: "#d1d5db", color: "#6b7280" }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              disabled={isFormInvalid || isLoading}
              sx={{
                bgcolor: "#f97316",
                "&:hover": { bgcolor: "#ea580c" },
                "&:disabled": { bgcolor: "#fed7aa" },
                borderRadius: 2,
                minWidth: 100,
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                confirmLabel
              )}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: "#f97316",
              "&:hover": { bgcolor: "#ea580c" },
              borderRadius: 2,
            }}
          >
            {closeLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
