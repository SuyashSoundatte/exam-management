import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  createTheme,
  ThemeProvider
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#ffffff'
    }
  }
});

const drawerWidth = 240;

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("students");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examForm, setExamForm] = useState({
    examTitle: '',
    examDate: null,
    description: ''
  });

  useEffect(() => {
    if (activeSection === "students") {
      fetchStudents();
    } else if (activeSection === "exams") {
      fetchExams();
    }
  }, [activeSection]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/student/allStudents");
      setStudents(response.data.students || []);
    } catch (error) {
      setError("Failed to fetch students");
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:3000/exam/all");
      setExams(response.data || []);
    } catch (error) {
      setError("Failed to fetch exams");
    }
  };

  const handleCreateExam = async () => {
    if (!examForm.examTitle || !examForm.examDate) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formattedDate = dayjs(examForm.examDate).format('YYYY-MM-DD');
      await axios.post("http://localhost:3000/exam/create", {
        ...examForm,
        examDate: formattedDate
      });
      await fetchExams();
      setDialogOpen(false);
      setExamForm({ examTitle: '', examDate: null, description: '' });
      setError("");
    } catch (error) {
      setError("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    { 
      field: 'fullName', 
      headerName: 'Full Name', 
      flex: 2,
      valueGetter: (params) => 
        `${params.row.firstName || ''} ${params.row.middleName || ''} ${params.row.lastName || ''}`.trim()
    },
    { field: "seatNumber", headerName: "Seat No.", flex: 1 },    
    { field: "mobileNumber", headerName: "Mobile", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "schoolName", headerName: "School", flex: 1.5 }
  ];

  const examColumns = [
    { field: "examTitle", headerName: "Exam Title", flex: 2 },
    { 
      field: "examDate", 
      headerName: "Date", 
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    { field: "description", headerName: "Description", flex: 2 }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open={open}
        >
          <Toolbar />
          <List>
            <ListItemButton
              selected={activeSection === "students"}
              onClick={() => setActiveSection("students")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Students" />
            </ListItemButton>
            <ListItemButton
              selected={activeSection === "exams"}
              onClick={() => setActiveSection("exams")}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Exam Management" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          
          {activeSection === "students" && (
            <Card sx={{ height: "calc(100vh - 130px)" }}>
              <CardContent>
                <DataGrid
                  rows={students}
                  columns={studentColumns}
                  pageSize={10}
                  getRowId={(row) => row._id}
                  density="comfortable"
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              </CardContent>
            </Card>
          )}

          {activeSection === "exams" && (
            <Card sx={{ height: "calc(100vh - 130px)" }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                  >
                    Add New Exam
                  </Button>
                </Box>
                <DataGrid
                  rows={exams}
                  columns={examColumns}
                  pageSize={10}
                  getRowId={(row) => row._id}
                  density="comfortable"
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              </CardContent>
            </Card>
          )}

          <Dialog 
            open={dialogOpen} 
            onClose={() => {
              setDialogOpen(false);
              setError("");
              setExamForm({ examTitle: '', examDate: null, description: '' });
            }}
          >
            <DialogTitle>Create New Exam</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 2, minWidth: 400 }}>
                <TextField
                  label="Exam Title"
                  value={examForm.examTitle}
                  onChange={(e) => setExamForm({...examForm, examTitle: e.target.value})}
                  fullWidth
                  required
                  error={!examForm.examTitle && !!error}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Exam Date"
                    value={examForm.examDate}
                    onChange={(date) => setExamForm({...examForm, examDate: date})}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        required
                        error={!examForm.examDate && !!error}
                      />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  label="Description"
                  value={examForm.description}
                  onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setDialogOpen(false);
                setError("");
                setExamForm({ examTitle: '', examDate: null, description: '' });
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateExam}
                variant="contained"
                disabled={loading || !examForm.examTitle || !examForm.examDate}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;