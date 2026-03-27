import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BaseDialog from "../../components/BaseDialog";
import type { User } from "../../core/models/user.model";
import {
  createUserSchema,
  editUserSchema,
} from "../../core/schemas/user.schema";
import { userService } from "../../services/user.service";

type CreateUserForm = z.infer<typeof createUserSchema>;
type EditUserForm = z.infer<typeof editUserSchema>;

interface Props {
  open: boolean;
  mode: "create" | "edit";
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormDialog({
  open,
  mode,
  user,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const schema = isEdit ? editUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateUserForm | EditUserForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open && !isEdit) {
      reset({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [open, isEdit]);

  useEffect(() => {
    if (open && isEdit && user?.username) {
      setIsFetching(true);
      userService
        .getUserByUsername(user.username)
        .then((data) => {
          reset({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: "",
            confirmPassword: "",
          });
          setIsFetching(false);
        })
        .catch(() => {
          setIsFetching(false);
          onClose();
        });
    }
  }, [open, isEdit, user?.username]);

  const onSubmit = async (data: CreateUserForm | EditUserForm) => {
    if (isEdit && user?.username) {
      const payload: User = {
        username: user.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      await userService.updateUser(user.username, payload);
    } else {
      const createData = data as CreateUserForm;
      const payload: User = {
        username: createData.username,
        firstName: createData.firstName,
        lastName: createData.lastName,
        email: createData.email,
        phone: createData.phone,
        password: createData.password,
      };
      await userService.createUser(payload);
    }
    onSuccess();
  };

  return (
    <BaseDialog
      open={open}
      title={isEdit ? "Edit User" : "Tambah User Baru"}
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
          {!isEdit && (
            <TextField
              label="Username"
              fullWidth
              {...register("username" as any)}
              error={!!errors["username" as keyof typeof errors]}
              helperText={
                errors["username" as keyof typeof errors]?.message as string
              }
            />
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="First Name"
              fullWidth
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              label="Last Name"
              fullWidth
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Box>

          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Phone"
            fullWidth
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            placeholder="+6281234567890"
          />

          <TextField
            label={isEdit ? "Password Baru" : "Password"}
            type={hidePassword ? "password" : "text"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setHidePassword(!hidePassword)}>
                    {hidePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Konfirmasi Password"
            type={hideConfirmPassword ? "password" : "text"}
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setHideConfirmPassword(!hideConfirmPassword)}
                  >
                    {hideConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </BaseDialog>
  );
}
