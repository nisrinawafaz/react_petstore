import { zodResolver } from "@hookform/resolvers/zod";
import { Pets, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthStore } from "../..//store/auth.store";
import { loginSchema } from "../../core/schemas/auth.schema";
import { authService } from "../../services/auth.service";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuthStore();
  const [hidePassword, setHidePassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMessage("");
      await authService.login(data);
      setLoggedIn(data.username);
      navigate("/pets");
    } catch {
      setErrorMessage("Login gagal. Periksa username dan password.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Pets sx={{ fontSize: 48, color: "#f97316", mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Petstore App
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Silakan login untuk melanjutkan
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type={hidePassword ? "password" : "text"}
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

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid || isSubmitting}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: "#f97316",
                "&:hover": { bgcolor: "#ea580c" },
                "&:disabled": { bgcolor: "#fed7aa" },
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
