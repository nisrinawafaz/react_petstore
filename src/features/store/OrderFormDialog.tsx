import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import BaseDialog from "../../components/BaseDialog";
import type { OrderStatus } from "../../core/models/order.model";
import type { Pet } from "../../core/models/pet.model";
import { orderSchema } from "../../core/schemas/order.schema";
import { orderService } from "../../services/order.service";
import { petService } from "../../services/pet.service";

type OrderForm = z.infer<typeof orderSchema>;

const STATUS_OPTIONS: OrderStatus[] = ["placed", "approved", "delivered"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderFormDialog({ open, onClose, onSuccess }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      petId: 0,
      quantity: 1,
      shipDate: new Date().toISOString().split("T")[0],
      status: "placed",
      complete: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    petService.findByStatus(["available"]).then(setPets);
  }, []);

  useEffect(() => {
    if (open) {
      reset({
        petId: 0,
        quantity: 1,
        shipDate: new Date().toISOString().split("T")[0],
        status: "placed",
        complete: false,
      });
    }
  }, [open]);

  const onSubmit = async (data: OrderForm) => {
    await orderService.createOrder({
      petId: data.petId,
      quantity: data.quantity,
      shipDate: new Date(data.shipDate).toISOString(),
      status: data.status as OrderStatus,
      complete: data.complete,
    });
    onSuccess();
  };

  return (
    <BaseDialog
      open={open}
      title="Buat Order Baru"
      mode="form"
      confirmLabel="Buat Order"
      isLoading={isSubmitting}
      isFormInvalid={!isValid}
      onConfirm={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl fullWidth error={!!errors.petId}>
          <InputLabel>Pet</InputLabel>
          <Controller
            name="petId"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Pet">
                <MenuItem value={0} disabled>
                  Pilih Pet
                </MenuItem>
                {pets.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} — ID: {p.id}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.petId && (
            <Box
              component="span"
              sx={{ color: "error.main", fontSize: 12, mt: 0.5, ml: 1.5 }}
            >
              {errors.petId.message}
            </Box>
          )}
        </FormControl>

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          {...register("quantity", { valueAsNumber: true })}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />
        <TextField
          label="Ship Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register("shipDate")}
          error={!!errors.shipDate}
          helperText={errors.shipDate?.message}
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Status">
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Controller
          name="complete"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  sx={{
                    color: "#f97316",
                    "&.Mui-checked": { color: "#f97316" },
                  }}
                />
              }
              label="Tandai sebagai selesai"
            />
          )}
        />
      </Box>
    </BaseDialog>
  );
}
