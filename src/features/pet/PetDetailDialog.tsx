import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BaseDialog from "../../components/BaseDialog";
import type { Pet, PetStatus } from "../../core/models/pet.model";
import { petService } from "../../services/pet.service";

const statusColor: Record<PetStatus, { bg: string; color: string }> = {
  available: { bg: "#e8f5e9", color: "#2e7d32" },
  pending: { bg: "#fff8e1", color: "#f57f17" },
  sold: { bg: "#fce4ec", color: "#c62828" },
};

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
}

function InfoRow({ label, children }: InfoRowProps) {
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
  petId: number | null;
  onClose: () => void;
}

export default function PetDetailDialog({ open, petId, onClose }: Props) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && petId) {
      setIsLoading(true);
      petService
        .findById(petId)
        .then((data) => {
          setPet(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          onClose();
        });
    }
  }, [open, petId]);

  return (
    <BaseDialog open={open} title="Detail Pet" mode="detail" onClose={onClose}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#f97316" }} />
        </Box>
      ) : pet ? (
        <Box>
          <InfoRow label="ID">
            <Typography variant="body2">{pet.id}</Typography>
          </InfoRow>
          <InfoRow label="Nama">
            <Typography variant="body2">{pet.name}</Typography>
          </InfoRow>
          <InfoRow label="Kategori">
            <Typography variant="body2">{pet.category?.name || "-"}</Typography>
          </InfoRow>
          <InfoRow label="Status">
            <Chip
              label={pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
              size="small"
              sx={{
                bgcolor: statusColor[pet.status].bg,
                color: statusColor[pet.status].color,
                fontWeight: 500,
              }}
            />
          </InfoRow>
          <InfoRow label="Tags">
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {pet.tags?.length ? (
                pet.tags.map((t, i) => (
                  <Chip key={i} label={t.name} size="small" />
                ))
              ) : (
                <Typography variant="body2">-</Typography>
              )}
            </Box>
          </InfoRow>
          {pet.photoUrls?.length > 0 && (
            <InfoRow label="Foto">
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {pet.photoUrls.map((url, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={url}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #eee",
                    }}
                    onError={(e: any) => (e.target.style.display = "none")}
                  />
                ))}
              </Box>
            </InfoRow>
          )}
        </Box>
      ) : null}
    </BaseDialog>
  );
}
