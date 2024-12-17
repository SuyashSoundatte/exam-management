import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const SearchCollege = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3000/college/search?name=${searchTerm}`);
            if (!response.ok) throw new Error('Failed to fetch colleges');
            const data = await response.json();
            setResults(data.colleges || []);
            onSearch && onSearch(data.colleges);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Box>
            <TextField
                label="Search College"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" onClick={handleSearch}>
                Search
            </Button>
            <List>
                {results.map((college) => (
                    <ListItem key={college._id}>
                        <ListItemText primary={college.collegeName} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SearchCollege;
