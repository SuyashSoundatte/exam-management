import React, { useState, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import dayjs from 'dayjs';
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
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  SupervisorAccount as SupervisorAccountIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';

// Setup axios interceptors
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = Bearer ${token};
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 240;

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [superAdminDialogOpen, setSuperAdminDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('exams');
  const [examForm, setExamForm] = useState({
    examTitle: '',
    examDate: null,
    description: '',
  });
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/student/allStudents');
      setStudents(response.data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin/examConfig');
      setExams(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin/allAdmins');
      setPendingAdmins(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending admins');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuperAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin/allSuperAdmins');
      setSuperAdmins(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch superadmins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      if (!mounted) return;
      try {
        if (activeSection === 'students') {
          await fetchStudents();
        } else if (activeSection === 'exams') {
          await fetchExams();
        } else if (activeSection === 'admins') {
          await fetchPendingAdmins();
        } else if (activeSection === 'superadmins') {
          await fetchSuperAdmins();
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch data');
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [activeSection, fetchStudents, fetchExams, fetchPendingAdmins, fetchSuperAdmins, navigate]);

  const handleCreateExam = async () => {
    try {
      if (!examForm.examTitle || !examForm.examDate) {
        setError('Please fill all required fields');
        return;
      }

      setLoading(true);
      const formattedDate = dayjs(examForm.examDate).format('YYYY-MM-DD');

      const response = await axios.put('http://localhost:3000/admin/examConfig', {
        ...examForm,
        examDate: formattedDate,
      });

      setExams([...exams, response.data]);
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const handleModifySuperAdminStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(http://localhost:3000/admin/approveSuperAdmin/${username}, { isAdmin, isSuperAdmin });
      setSuperAdmins(response.data || []);
      setSuperAdminDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to modify superadmin status');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAdmin = async (adminId) => {
    try {
      setLoading(true);
      await axios.patch(http://localhost:3000/admin/approve/${adminId}, { approved: true });
      setPendingAdmins(pendingAdmins.filter(admin => admin._id !== adminId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const examColumns = [
    { field: 'examTitle', headerName: 'Exam Title', flex: 1 },
    { field: 'examDate', headerName: 'Exam Date', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  const studentColumns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'schoolName', headerName: 'School Name', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'DOB', headerName: 'DOB', flex: 1 },
  ];

  const adminColumns = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'isSuperAdmin', headerName: 'Super Admin', flex: 1, renderCell: (params) => (params.row.isSuperAdmin ? 'Yes' : 'No') },
    { field: 'isAdmin', headerName: 'Admin', flex: 1, renderCell: (params) => (params.row.isAdmin ? 'Yes' : 'No') },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApproveAdmin(params.row._id)}
        >
          Approve
        </Button>
      ),
    },
  ];

  const superAdminColumns = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 1, renderCell: (params) => dayjs(params.row.createdAt).format('YYYY-MM-DD') },
  ];

  const redTheme = createTheme({
    palette: {
      primary: {
        main: '#EF4444',
      },
      secondary: {
        main: '#EF4444',
      },
    },
  });

  return (
    <ThemeProvider theme={redTheme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Super Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem
                button
                selected={activeSection === 'exams'}
                onClick={() => setActiveSection('exams')}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Exams" />
              </ListItem>
              <ListItem
                button
                selected={activeSection === 'students'}
                onClick={() => setActiveSection('students')}
              >
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Students" />
              </ListItem>
              <ListItem
                button
                selected={activeSection === 'admins'}
                onClick={() => setActiveSection('admins')}
              >
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Approve Admins" />
              </ListItem>
              <ListItem
                button
                selected={activeSection === 'superadmins'}
                onClick={() => setActiveSection('superadmins')}
              >
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Super Admins" />
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
            bgcolor: 'background.default',
            p: 3,
            marginTop: '64px',
          }}
        >
          <Typography variant="h4" gutterBottom>
            {activeSection === 'exams' ? 'Manage Exams' : activeSection === 'students' ? 'Manage Students' : activeSection === 'admins' ? 'Approve Admins' : 'Super Admins'}
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {error && <Snackbar open autoHideDuration={6000} onClose={() => setError('')}><Alert severity="error">{error}</Alert></Snackbar>}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                {activeSection === 'exams' && (
                  <Button variant="contained" onClick={() => setDialogOpen(true)}>
                    Create Exam
                  </Button>
                )}
                {activeSection === 'superadmins' && (
                  <Button variant="contained" onClick={() => setSuperAdminDialogOpen(true)}>
                    Modify Super Admin
                  </Button>
                )}
              </Box>

              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={activeSection === 'exams' ? exams : activeSection === 'students' ? students : activeSection === 'admins' ? pendingAdmins : superAdmins}
                  columns={activeSection === 'exams' ? examColumns : activeSection === 'students' ? studentColumns : activeSection === 'admins' ? adminColumns : superAdminColumns}
                  pageSize={5}
                  disableSelectionOnClick
                />
              </div>

              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{activeSection === 'exams' ? 'Create Exam' : 'Add Student'}</DialogTitle>
                <DialogContent>
                  {activeSection === 'exams' ? (
                    <>
                      <TextField
                        label="Exam Title"
                        fullWidth
                        value={examForm.examTitle}
                        onChange={(e) => setExamForm({ ...examForm, examTitle: e.target.value })}
                        sx={{ marginBottom: 2 }}
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Exam Date"
                          value={examForm.examDate}
                          onChange={(newValue) => setExamForm({ ...examForm, examDate: newValue })}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                      <TextField
                        label="Description"
                        fullWidth
                        multiline
                        value={examForm.description}
                        onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                        sx={{ marginTop: 2 }}
                      />
                    </>
                  ) : null}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateExam}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Exam'}
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={superAdminDialogOpen} onClose={() => setSuperAdminDialogOpen(false)}>
                <DialogTitle>Modify Admin Status</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Username"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ marginBottom: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAdmin}
                        onChange={(e) => {
                          setIsAdmin(e.target.checked);
                          if (!e.target.checked) {
                            setIsSuperAdmin(false);
                          }
                        }}
                        name="isAdmin"
                        color="primary"
                      />
                    }
                    label="Admin"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSuperAdmin}
                        onChange={(e) => setIsSuperAdmin(e.target.checked)}
                        name="isSuperAdmin"
                        color="primary"
                        disabled={!isAdmin}
                      />
                    }
                    label="Super Admin"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSuperAdminDialogOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleModifySuperAdminStatus}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Modifying...' : 'Modify'}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SuperAdminDashboard;