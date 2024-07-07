// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SummaryCard from './SummaryCards'; // Assuming you have a SummaryCard component
import ToDoList from './ToDoList';
import PieChart from './PieChart';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [workerCount, setWorkerCount] = useState(0);
  const [jobsDone, setJobsDone] = useState(0);
  const [acceptedRequests, setAcceptedRequests] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  // const [workerOccupationData, setWorkerOccupationData] = useState({});
  const workerData = [
    { y: 100, label: "Electrician" },
  ];
  // const [jobData, setJobData] = useState([]);

  useEffect(() => {
    // Fetch total users count
    fetch('http://localhost:3000/admin/countusers', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setTotalUsers(data);
      })
      .catch(error => console.error('Error fetching total users:', error));

    // Fetch accepted requests count
    fetch('http://localhost:3000/admin/countacceptedrequests', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setAcceptedRequests(data.totalAcceptedRequests);
      })
      .catch(error => console.error('Error fetching accepted requests:', error));

    // Fetch workers data and count
    fetch('http://localhost:3000/admin/workers', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setWorkerCount(data.count);
        const occupationData = data.workers.reduce((acc, worker) => {
          acc[worker.occupation] = (acc[worker.occupation] || 0) + 1;
          return acc;
        }, {});
        setWorkerOccupationData(occupationData);
      })
      .catch(error => console.error('Error fetching workers:', error));

    fetch('http://localhost:3000/admin/getworkers', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setWorkerCount(data.count); 
      })
      .catch(error => {
        console.error('Error fetching workers:', error);
      });

    fetch('http://localhost:3000/admin/jobhistory')
      .then(resp => resp.json())
      .then(data => {
        setJobsDone(data.length);
        setJobData(data);
        console.log(data);
      })

    // Fetch clients data and count
    fetch('http://localhost:3000/admin/getclients', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      setClientCount(data.totalClients);
    })
    .catch(error => console.error('Error fetching clients:', error));
    
    

  
  }, []);
  // const workerOccupationChartData = {
  //   labels: Object.keys(workerOccupationData),
  //   datasets: [
  //     {
  //       data: Object.values(workerOccupationData),
  //       backgroundColor: [
  //         'rgba(75, 192, 192, 0.6)', 
  //         'rgba(255, 99, 132, 0.6)', 
  //         'rgba(54, 162, 235, 0.6)',
  //         // Add more colors if you have more occupations
  //       ]
  //     }
  //   ]
  // };

  // console.log('Worker Occupation Data:', workerOccupationChartData);

  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <SummaryCard title="Total Users" value={totalUsers} />
        <SummaryCard title="Clients" value={clientCount} /> {/* Placeholder for customers */}
        <SummaryCard title="Workers" value={workerCount} />
        <SummaryCard title="Jobs Done" value={jobsDone} />
      </Box>
      <Box mt={2}>
        <Typography variant="h5" gutterBottom>
          Worker Categories Percentage
        </Typography>
        <PieChart dataPoints={Object.entries(workerOccupationData).map(([label, value]) => ({ label, value }))} title="Worker Categories" />
      </Box>
      
          <Box mt={2} bgcolor="white" p={2} borderRadius={8}>
        <Typography variant="h5" gutterBottom>
          To-Do List
        </Typography>
        <ToDoList />
      </Box>
    </Box>
        
  );
}
export default Dashboard;