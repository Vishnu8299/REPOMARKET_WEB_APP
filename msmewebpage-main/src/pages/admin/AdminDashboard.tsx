import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

// Add this once in your app (e.g., in App.tsx or a setup file)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_BASE = "/api/admin";

const statItems = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: <GroupIcon sx={{ color: "#90caf9" }} />,
  },
  {
    key: "totalProjects",
    label: "Total Projects",
    icon: <DashboardIcon sx={{ color: "#90caf9" }} />,
  },
  {
    key: "totalHackathons",
    label: "Total Hackathons",
    icon: <EmojiEventsIcon sx={{ color: "#90caf9" }} />,
  },
  {
    key: "activeProjects",
    label: "Active Projects",
    icon: <DashboardIcon sx={{ color: "#66bb6a" }} />,
  },
  {
    key: "completedProjects",
    label: "Completed Projects",
    icon: <DashboardIcon sx={{ color: "#ffa726" }} />,
  },
];

const sidebarItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { label: "Users", icon: <GroupIcon />, path: "/admin/userlist" },
  { label: "Hackathons", icon: <EmojiEventsIcon />, path: "/admin/hackathons" },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/stats`)
      .then((res) => {
        setStats(res.data.data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load system statistics.");
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Dummy user info for sidebar
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "",
    balance: "$0.00",
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#181A20", display: "flex" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: 70, sm: 250 },
          bgcolor: "#23272F",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", sm: "flex-start" },
          py: 3,
          px: { xs: 1, sm: 3 },
          minHeight: "100vh",
          boxShadow: "2px 0 12px 0 rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            width: "100%",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              mr: { sm: 2, xs: 0 },
              width: 48,
              height: 48,
            }}
          >
            {user.name[0]}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography fontWeight={600}>{user.name}</Typography>
            <Typography variant="body2" color="grey.400">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider
          sx={{ bgcolor: "#333", mb: 2, width: "100%" }}
        />
        <Stack
          spacing={1}
          sx={{ width: "100%" }}
        >
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              startIcon={item.icon}
              sx={{
                justifyContent: { xs: "center", sm: "flex-start" },
                color: "#90caf9",
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 1.2,
                textTransform: "none",
                bgcolor: "transparent",
                "&:hover": { bgcolor: "#181A20" },
                minWidth: 0,
              }}
              fullWidth
              onClick={() => navigate(item.path)}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {item.label}
              </Box>
            </Button>
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<LogoutIcon />}
          sx={{
            color: "#ff5252",
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            py: 1.2,
            textTransform: "none",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "#181A20" },
            minWidth: 0,
            mt: 2,
            width: "100%",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            Logout
          </Box>
        </Button>
      </Box>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          bgcolor: "#181A20",
          px: { xs: 1, sm: 5 },
          py: 4,
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            px: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MenuIcon
              sx={{
                color: "#90caf9",
                mr: 2,
                display: { sm: "none" },
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: 700,
                letterSpacing: 1,
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Dashboard
            </Typography>
          </Box>
          <Box>
            <IconButton>
              <NotificationsNoneIcon sx={{ color: "#90caf9" }} />
            </IconButton>
            <IconButton>
              <SettingsOutlinedIcon sx={{ color: "#90caf9" }} />
            </IconButton>
          </Box>
        </Box>
        {/* Stats Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            mb: 4,
          }}
        >
          {loading ? (
            <CircularProgress sx={{ color: "#90caf9", mx: 2 }} />
          ) : error ? (
            <Alert
              severity="error"
              sx={{
                bgcolor: "#2d2d34",
                color: "#ff5252",
                minWidth: 200,
              }}
            >
              {error}
            </Alert>
          ) : stats ? (
            statItems.map((item) => (
              <Paper
                key={item.key}
                sx={{
                  minWidth: 180,
                  bgcolor: "#23272F",
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ mb: 1 }}>{item.icon}</Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#90caf9",
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "2rem",
                    mt: 1,
                  }}
                >
                  {stats[item.key]}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography sx={{ color: "#fff" }}>
              No statistics available.
            </Typography>
          )}
        </Box>
        {/* Quick Actions */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#90caf9", fontWeight: 600 }}
          >
            Quick Actions
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                "&:hover": { bgcolor: "#1565c0" },
              }}
              onClick={() => navigate("/admin/userlist")}
            >
              Manage Users
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                color: "#90caf9",
                borderColor: "#90caf9",
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  bgcolor: "#222b36",
                },
              }}
              onClick={() => navigate("/admin/hackathons")}
            >
              Manage Hackathons
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
