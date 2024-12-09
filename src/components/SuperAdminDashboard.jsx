import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import axios from 'axios';

const SuperAdminDashboard = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('/api/admins');
                setAdmins(response.data);
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        fetchAdmins();
    }, []);

    const handleApprove = async (adminId) => {
        try {
            await axios.patch(`/api/admins/${adminId}`, { isApproved: true });
            setAdmins(admins.map(admin => admin._id === adminId ? { ...admin, isApproved: true } : admin));
        } catch (error) {
            console.error('Error approving admin:', error);
        }
    };

    const handleDisapprove = async (adminId) => {
        try {
            await axios.patch(`/api/admins/${adminId}`, { isApproved: false });
            setAdmins(admins.map(admin => admin._id === adminId ? { ...admin, isApproved: false } : admin));
        } catch (error) {
            console.error('Error disapproving admin:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Super Admin Dashboard
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Is Super Admin</TableCell>
                                <TableCell>Is Approved</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map((admin) => (
                                <TableRow key={admin._id}>
                                    <TableCell>{admin.username}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>{admin.isSuperAdmin ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{admin.isApproved ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleApprove(admin._id)}
                                            disabled={admin.isApproved}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDisapprove(admin._id)}
                                            disabled={!admin.isApproved}
                                            sx={{ ml: 2 }}
                                        >
                                            Disapprove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default SuperAdminDashboard;