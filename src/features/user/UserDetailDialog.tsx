import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BaseDialog from "../../components/BaseDialog";
import type { User } from "../../core/models/user.model";
import { userService } from "../../services/user.service";

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
          sx={{ width: 100, flexShrink: 0 }}
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
  username: string | null;
  onClose: () => void;
}

export default function UserDetailDialog({ open, username, onClose }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && username) {
      setIsLoading(true);
      userService
        .getUserByUsername(username)
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          onClose();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (!open) setUser(null);
  }, [open, username]);
  return (
    <BaseDialog open={open} title="Detail User" mode="detail" onClose={onClose}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#f97316" }} />
        </Box>
      ) : user ? (
        <Box>
          <InfoRow label="Username">
            <Typography variant="body2">@{user.username}</Typography>
          </InfoRow>
          <InfoRow label="Nama">
            <Typography variant="body2">
              {user.firstName} {user.lastName}
            </Typography>
          </InfoRow>
          <InfoRow label="Email">
            <Typography variant="body2">{user.email}</Typography>
          </InfoRow>
          <InfoRow label="Phone">
            <Typography variant="body2">{user.phone}</Typography>
          </InfoRow>
          <InfoRow label="Status">
            <Chip
              label={user.userStatus === 1 ? "Active" : "Inactive"}
              size="small"
              sx={{
                bgcolor: user.userStatus === 1 ? "#e8f5e9" : "#fce4ec",
                color: user.userStatus === 1 ? "#2e7d32" : "#c62828",
                fontWeight: 500,
              }}
            />
          </InfoRow>
        </Box>
      ) : null}
    </BaseDialog>
  );
}
