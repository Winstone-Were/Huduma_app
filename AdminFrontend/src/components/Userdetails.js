import './components.css'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

function UserDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(uid);
  useEffect(() => {
    console.log("User Id is", uid)
    // Fetch user details when component mounts
    fetch(`http://localhost:3000/admin/user/${uid}`, { method: 'GET' })

      .then(response => response.json())

      .then(data => {
        console.log(data);
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        setLoading(false);
      });
  }, [uid]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box component={Paper} p={3}>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      {user ? (
        <>
          <div className='row'>
            <img src={user.photoURL} className='image' />
            <div className='user-typography'>
              <Typography>
                User Name : {user.username || user.name}
              </Typography>
              {user.locationName ?
                (<>
                  <Typography>
                    Home : {user.locationName}
                  </Typography>
                </>) : (<>
                  <Typography>
                    Occupation : {user.occupation}
                  </Typography>
                </>)}
              <Typography>
                Phone : {user.phone_number || user.phoneNumber}
              </Typography>
            </div>
          </div>

        </>
      ) : (
        <Typography variant="body1">User not found.</Typography>
      )}
    </Box>
  );
}

export default UserDetails;
