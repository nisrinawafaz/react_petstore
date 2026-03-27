import { Group, Pets, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Pets", icon: <Pets />, route: "/pets" },
  { label: "Orders", icon: <ShoppingCart />, route: "/orders" },
  { label: "Users", icon: <Group />, route: "/users" },
];

export default function Sidebar() {
  return (
    <Box sx={{ height: "100%", bgcolor: "#fff7ed" }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "1px solid #fed7aa",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            color: "#f97316",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Menu
        </Typography>
      </Box>

      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive ? "#f97316" : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? "#ea580c" : "#ffedd5",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isActive ? "white" : "#fb923c", minWidth: 40 }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ color: isActive ? "white" : "#78350f" }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  );
}
