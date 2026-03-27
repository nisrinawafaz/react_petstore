import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Close, Image, Upload } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import BaseDialog from "../../components/BaseDialog";
import type { Category, Pet, PetStatus } from "../../core/models/pet.model";
import { petSchema } from "../../core/schemas/pet.schema";
import { categoryService } from "../../services/category.service";
import { petService } from "../../services/pet.service";

type PetForm = z.infer<typeof petSchema>;

interface Props {
  open: boolean;
  mode: "create" | "edit";
  pet?: Pet;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: PetStatus[] = ["available", "pending", "sold"];

export default function PetFormDialog({
  open,
  mode,
  pet,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PetForm>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      status: "available",
      category: null,
      tags: [],
      photoUrls: [],
    },
    mode: "onChange",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const categoryValue = watch("category");

  useEffect(() => {
    categoryService.getLovCategory().then(setCategories);
  }, []);

  useEffect(() => {
    if (open && isEdit && pet?.id) {
      setIsFetching(true);
      petService
        .findById(pet.id)
        .then((data) => {
          reset({
            name: data.name,
            status: data.status,
            category: data.category ?? null,
            tags: data.tags?.map((t) => ({ name: t.name })) ?? [],
            photoUrls: data.photoUrls ?? [],
          });
          setExistingPhotos(data.photoUrls ?? []);
          setIsFetching(false);
        })
        .catch(() => {
          setIsFetching(false);
          onClose();
        });
    } else if (open && !isEdit) {
      reset({
        name: "",
        status: "available",
        category: null,
        tags: [],
        photoUrls: [],
      });
      setExistingPhotos([]);
      setSelectedFiles([]);
    }
  }, [open, isEdit, pet?.id]);

  const onSubmit = async (data: PetForm) => {
    let newUrls: string[] = [];

    if (selectedFiles.length > 0) {
      try {
        for (let i = 0; i < selectedFiles.length; i++) {
          await petService.uploadImage(0, selectedFiles[i]);
          // simulasi URL karena API tidak return URL asli
          const url = `https://petstore.swagger.io/v2/pet/image_${Date.now()}_${i}`;
          newUrls.push(url);
        }
      } catch {
        throw new Error("Gagal upload foto.");
      }
    }

    const photoUrls = [...existingPhotos, ...newUrls];

    const payload: Pet = {
      ...(isEdit && pet?.id ? { id: pet.id } : {}),
      name: data.name,
      status: data.status as PetStatus,
      photoUrls,
      category: data.category ?? undefined,
      tags: data.tags
        ?.filter((t) => t.name.trim())
        .map((t) => ({ name: t.name })),
    };

    if (isEdit) {
      await petService.updatePet(payload);
    } else {
      await petService.addPet(payload);
    }

    onSuccess();
    setSelectedFiles([]);
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <BaseDialog
      open={open}
      title={isEdit ? "Edit Pet" : "Tambah Pet Baru"}
      mode="form"
      confirmLabel={isEdit ? "Update" : "Simpan"}
      isLoading={isSubmitting}
      isFormInvalid={!isValid}
      onConfirm={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      {isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#f97316" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nama Pet"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option?.name ?? ""}
            value={categoryValue ?? null}
            onChange={(_, val) =>
              setValue(
                "category",
                val?.id && val?.name ? { id: val.id, name: val.name } : null,
              )
            }
            isOptionEqualToValue={(opt, val) => opt.id === val?.id}
            renderInput={(params) => (
              <TextField {...params} label="Kategori (opsional)" />
            )}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={watch("status")}
              onChange={(e) => setValue("status", e.target.value as PetStatus)}
              error={!!errors.status}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#555">
                Tags (opsional)
              </Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => appendTag({ name: "" })}
                sx={{ color: "#f97316", borderColor: "#f97316" }}
                variant="outlined"
              >
                Tambah Tag
              </Button>
            </Box>
            {tagFields.map((field, i) => (
              <Box key={field.id} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  label={`Tag ${i + 1}`}
                  fullWidth
                  size="small"
                  {...register(`tags.${i}.name`)}
                />
                <IconButton color="error" onClick={() => removeTag(i)}>
                  <Close />
                </IconButton>
              </Box>
            ))}
          </Box>

          {isEdit && existingPhotos.length > 0 && (
            <Box>
              <Typography variant="body2" fontWeight={600} color="#555" mb={1}>
                Foto saat ini:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {existingPhotos.map((url, i) => (
                  <Box
                    key={i}
                    sx={{ position: "relative", width: 80, height: 80 }}
                  >
                    <Box
                      component="img"
                      src={url}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid #fed7aa",
                      }}
                      onError={(e: any) => (e.target.style.display = "none")}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeExistingPhoto(i)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "white",
                        border: "1px solid #fed7aa",
                        width: 20,
                        height: 20,
                        p: 0,
                      }}
                    >
                      <Close sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="body2" fontWeight={600} color="#555" mb={1}>
              {isEdit ? "Tambah Foto Baru" : "Foto Pet"} (opsional)
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                border: "1px dashed #fb923c",
                borderRadius: 2,
                bgcolor: "#fff7ed",
              }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<Upload />}
                sx={{ borderColor: "#f97316", color: "#f97316" }}
              >
                Pilih Foto
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </Button>

              {selectedFiles.length > 0 ? (
                <Box>
                  <Typography
                    variant="caption"
                    color="#f97316"
                    fontWeight={600}
                  >
                    {selectedFiles.length} foto dipilih:
                  </Typography>
                  {selectedFiles.map((f, i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Image sx={{ fontSize: 14, color: "#fb923c" }} />
                      <Typography variant="caption">{f.name}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="#aaa">
                  Belum ada foto dipilih
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </BaseDialog>
  );
}
