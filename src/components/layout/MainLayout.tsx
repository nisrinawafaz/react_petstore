import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const SIDEBAR_WIDTH = 240;

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: isSidebarOpen ? SIDEBAR_WIDTH : 0,
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
            bgcolor: "#fff7ed",
            borderRight: "1px solid #fed7aa",
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            bgcolor: "#f5f5f5",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
