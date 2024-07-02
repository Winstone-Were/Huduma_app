import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users 
    fetch('http://localhost:3000/admin/listallusers', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDeleteUser = async (uid) => {
    setLoading(true);
    fetch(`http://localhost:3000/admin/deleteuser/${uid}`, { method: 'GET' })
    .then(resp=> 
      {
        alert('Worker Deleted');
        setLoading(false);
      })
    .catch(error => {
      console.error('Error fetching workers:', error);
      setLoading(false);
    });
  } 

  const handleBanUser = (userId) => {
    //yet to implement
    console.log(`Banning user with ID: ${userId}`);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: '16px' }}>
        Create User
      </Button>
      <TableContainer component={Paper}>
        {loading ?
          (<React.Fragment>
            <CircularProgress />
          </React.Fragment>) :
          (<React.Fragment>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <Link to={`/users/${user.uid}`}>
                        {user.uid}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${user.email}`}>
                        {user.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleBanUser(user.uid)} aria-label="ban">
                        <BlockIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.uid)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>)}
      </TableContainer>
    </Box>
  );
}

export default Users;
