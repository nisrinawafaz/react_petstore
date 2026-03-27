import { Close, Warning } from "@mui/icons-material";
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

interface Props {
  open: boolean;
  title: string;
  message: string;
  subMessage?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  subMessage,
  confirmLabel = "Hapus",
  isLoading = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="error">
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: "center", py: 3 }}>
        <Warning sx={{ fontSize: 56, color: "#f97316", mb: 1 }} />
        <Typography dangerouslySetInnerHTML={{ __html: message }} />
        {subMessage && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subMessage}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, borderTop: "1px solid #f3f4f6" }}>
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
          disabled={isLoading}
          sx={{
            bgcolor: "#ef4444",
            "&:hover": { bgcolor: "#dc2626" },
            borderRadius: 2,
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
