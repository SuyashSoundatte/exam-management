import React, { useState, useEffect, useCallback, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdminPanelSettings } from '@mui/icons-material';
import Signup from './SignUp'; // Import the Signup component

import axios from 'axios';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import ExportButton from "./ExportExcel";
import UpdateStudentMarks from './UpdateStudentsMarks';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    TextField,
    Typography,
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
    
} from '@mui/material';
import {
    Menu as MenuIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    PersonAdd as PersonAddIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../contexts/AdminContext';
import { header } from 'server/reply';
// import { exportToExcel } from '../../server/config/excelConvertor';
// Setup axios interceptors
axios.interceptors.request.use((config) => {
    // Ensure requests include cookies
    config.withCredentials = true;
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error by redirecting to the login page
            window.location.href = '/login';
        }
        return Promise.reject(error); // Forward the error for further handling
    },
);


const AdminDashboard = () => {
    const { isSuperAdmin } = useContext(AdminContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerWidth = 240;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
      // Function to open the popup
      const openPopup = () => {
        setIsPopupOpen(true);
      };
    
      // Function to close the popup
      const closePopup = () => {
        setIsPopupOpen(false);
      };
    

    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('exams');
    const [examForm, setExamForm] = useState({
        examTitle: '',
        examDate: null,
        description: '',
    });

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/student/allStudents');

            if (!response.ok) {
                throw new Error((await response.json()).message || 'Failed to fetch students');
            }

            const data = await response.json();
            setStudents(data.students || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch students'); // Set the error message
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchExams = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/admin/examConfig', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error((await response.json()).message || 'Failed to fetch exams');
            }

            const data = await response.json();
            setExams(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err.message || 'Failed to fetch exams'); // Set error message
        } finally {
            setLoading(false); // Stop loading state
        }
    }, []);

    const fetchAdmins = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/admin/allAdmins', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error((await response.json()).message || 'Failed to fetch admins');
            }

            const data = await response.json();
            setAdmins(Array.isArray(data) ? data : [data]); // Ensure admins is an array
        } catch (err) {
            setError(err.message || 'Failed to fetch admins'); // Set error message
        } finally {
            setLoading(false); // Stop loading state
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (!mounted) return;

            try {
                if (activeSection === 'students') {
                    await fetchStudents();
                } else if (activeSection === 'exams') {
                    await fetchExams();
                } else if (activeSection === 'admins') {
                    await fetchAdmins();
                }
            } catch (err) {
                if (mounted) {
                    if (err.response?.status === 401) {
                        // Redirect to login if the user is unauthorized
                        navigate('/login');
                    } else {
                        setError('Failed to fetch data');
                    }
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [activeSection, fetchStudents, fetchExams, fetchAdmins, navigate]);

    const handleCreateExam = async () => {
        try {
            if (!examForm.examTitle || !examForm.examDate) {
                setError('Please fill all required fields');
                return;
            }

            setLoading(true);
            const formattedDate = dayjs(examForm.examDate).format('YYYY-MM-DD');

            const response = await fetch('http://localhost:3000/admin/examConfig', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...examForm,
                    examDate: formattedDate,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to create exam');
            }

            alert('Exam updated successfully.');
            const data = await response.json();

            if (data) {
                await fetchExams();
                setDialogOpen(false);
                setExamForm({ examTitle: '', examDate: null, description: '' });
                setError('');
            }
        } catch (error) {
            setError(error.message || 'Failed to create exam');
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
        { field: 'examDate', headerName: 'Date', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
    ];

    const studentColumns = [
        { field: 'seatNumber', headerName: 'Seat Number', flex: 1 },
        { field: 'firstName', headerName: 'FirstName', flex: 1 },
        { field: 'middleName', headerName: 'MiddleName', flex: 1 },
        { field: 'lastName', headerName: 'LastName', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'schoolName', headerName: 'School Name', flex: 1 },
        { field: 'mobileNumber', headerName: 'Phone Number', flex: 1 },
        { field: 'whatsappNumber', headerName: 'WA Number', flex: 1 },
        { field: 'dateOfBirth', headerName: 'DOB', flex: 1 },
        { field :'result', headerName : 'Marks', flex: 1}
    ];

    const adminColumns = [
        { field: 'username', headerName: 'Username', flex: 1 },
        {
            field: 'isSuperAdmin',
            headerName: 'Super Admin',
            flex: 1,
            renderCell: (params) => (params.row.isSuperAdmin ? 'Yes' : 'No'),
        },
        {
            field: 'isApproved',
            headerName: 'Admin',
            flex: 1,
            renderCell: (params) => (params.row.isAdmin ? 'Yes' : 'No'),
        },
        { field: 'email', headerName: 'Email', flex: 1 },
        
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
                            sx={{ mr: 3, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Admin Dashboard
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
                                selected={activeSection === 'createUser'}
                                onClick={() => setActiveSection('createUser')}
                            >
                                <ListItemIcon>
                                    <PersonAddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Create User" />
                            </ListItem>
                            {isSuperAdmin && (
                                <ListItem
                                    button
                                    selected={activeSection === 'admins'}
                                    onClick={() => setActiveSection('admins')}
                                >
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary="Admins" />
                                </ListItem>
                            )}
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

                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                    <Toolbar />

                    {activeSection === 'exams' && (
                        <Button
                            variant="contained"
                            onClick={() => setDialogOpen(true)}
                            sx={{ mb: 2 }}
                            startIcon={<AssignmentIcon />}
                        >
                            Create New Exam
                        </Button>
                    )}

                    {activeSection === 'students' && (
                        <Button
                        variant="contained"
                        onClick={() => {
                            openPopup();
                          }}
                        sx={{ mb: 2, mr:4}}
                        startIcon={<AssignmentIcon />}
                    >
                        Enter Marks
                    </Button>
                    )}

                    {activeSection === 'students' && (
                        <Button
                            variant="contained"
                            // onClick={}
                            sx={{ mb: 2 }}
                            startIcon={<AssignmentIcon />}
                        >
                            <ExportButton />
                        </Button>
                    )}
                    <Box sx={{ height: 'calc(100vh - 180px)', width: '100%' }}>
                        <DataGrid
                            rows={
                                activeSection === 'exams'
                                    ? exams
                                    : activeSection === 'admins'
                                      ? admins
                                      : students
                            }
                            columns={
                                activeSection === 'exams'
                                    ? examColumns
                                    : activeSection === 'admins'
                                      ? adminColumns
                                      : studentColumns
                            }
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            getRowId={(row) =>
                                row._id || row.studentId || row.adminId
                            }
                            loading={loading}
                            sx={{
                                boxShadow: 2,
                                border: 2,
                                borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        />
                    </Box>

                    <Dialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                    >
                        <DialogTitle>Create New Exam</DialogTitle>
                        <DialogContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <TextField
                                    label="Exam Title"
                                    value={examForm.examTitle}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            examTitle: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        label="Exam Date"
                                        value={examForm.examDate}
                                        onChange={(date) =>
                                            setExamForm({
                                                ...examForm,
                                                examDate: date,
                                            })
                                        }
                                        fullWidth
                                        margin="normal"
                                    />
                                </LocalizationProvider>
                                <TextField
                                    label="Description"
                                    value={examForm.description}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            description: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleCreateExam} color="primary" disabled={loading}>
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {error && (
                        <Snackbar
                            open={Boolean(error)}
                            autoHideDuration={6000}
                            onClose={() => setError('')}
                        >
                            <Alert
                                onClose={() => setError('')}
                                severity="error"
                            >
                                {error}
                            </Alert>
                        </Snackbar>
                    )}
                    <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                        <Alert severity="error">{error}</Alert>
                    </Snackbar>
                </Box>
            </Box>
            {isPopupOpen && <UpdateStudentMarks closePopup={closePopup} />}
        </ThemeProvider>
    );
};


export default AdminDashboard;