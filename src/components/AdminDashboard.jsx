import React, { useState, useEffect, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";

// Setup axios interceptors
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = 240;

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("exams");
  const [examForm, setExamForm] = useState({
    examTitle: "",
    examDate: null,
    description: "",
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/student/allStudents"
      );
      setStudents(response.data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/admin/examConfig"
      );
      setExams(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      if (!mounted) return;
      try {
        if (activeSection === "students") {
          await fetchStudents();
        } else if (activeSection === "exams") {
          await fetchExams();
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to fetch data");
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [activeSection, fetchStudents, fetchExams, navigate]);

  const handleCreateExam = async () => {
    try {
      if (!examForm.examTitle || !examForm.examDate) {
        setError("Please fill all required fields");
        return;
      }

      setLoading(true);
      const formattedDate = dayjs(examForm.examDate).format("YYYY-MM-DD");

      const response = await axios.put(
        "http://localhost:3000/admin/examConfig",
        {
          ...examForm,
          examDate: formattedDate,
        }
      );

      if (response.data) {
        await fetchExams();
        setDialogOpen(false);
        setExamForm({ examTitle: "", examDate: null, description: "" });
        setError("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const examColumns = [
    { field: "examTitle", headerName: "Exam Title", flex: 1 },
    { field: "examDate", headerName: "Date", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
  ];

const studentColumns = [
  { field: "studentId", headerName: "Student ID", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "schoolName", headerName: "School Name", flex: 1 },
  { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
  { field: "DOB", headerName: "DOB", flex: 1 },
  // Add more columns as needed
];

  const redTheme = createTheme({
    palette: {
      primary: {
        main: "#EF4444",
      },
      secondary: {
        main: "#EF4444",
      },
    },
  });

  return (
    <ThemeProvider theme={redTheme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem
                button
                selected={activeSection === "exams"}
                onClick={() => setActiveSection("exams")}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Exams" />
              </ListItem>
              <ListItem
                button
                selected={activeSection === "students"}
                onClick={() => setActiveSection("students")}
              >
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Students" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar />

          {activeSection === "exams" && (
            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ mb: 2 }}
              startIcon={<AssignmentIcon />}
            >
              Create New Exam
            </Button>
          )}

          <Box sx={{ height: "calc(100vh - 180px)", width: "100%" }}>
            <DataGrid
              rows={activeSection === "exams" ? exams : students}
              columns={activeSection === "exams" ? examColumns : studentColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row._id || row.studentId}
              loading={loading}
              sx={{
                boxShadow: 2,
                border: 2,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
            />
          </Box>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Create New Exam</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Exam Title"
                  value={examForm.examTitle}
                  onChange={(e) =>
                    setExamForm({ ...examForm, examTitle: e.target.value })
                  }
                  required
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Exam Date"
                    value={examForm.examDate}
                    onChange={(newValue) =>
                      setExamForm({ ...examForm, examDate: newValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  label="Description"
                  value={examForm.description}
                  onChange={(e) =>
                    setExamForm({ ...examForm, description: e.target.value })
                  }
                  required
                  multiline
                  rows={4}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleCreateExam}
                color="primary"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError("")}
          >
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
