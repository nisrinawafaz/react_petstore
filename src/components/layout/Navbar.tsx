import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material";
import { Pets } from "@mui/icons-material";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const { username, setLoggedOut } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setLoggedOut();
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "#f97316", boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}
    >
      <Toolbar>
        <IconButton color="inherit" onClick={onToggleSidebar} edge="start">
          <MenuIcon />
        </IconButton>

        <Pets sx={{ ml: 1, mr: 1 }} />
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          Petstore
        </Typography>

        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <AccountCircle sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={500}>
            {username}
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
