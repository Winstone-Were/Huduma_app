// src/components/ToDoList.js

import React, { useState } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    setTasks([...tasks, { text: task, done: false }]);
    setTask('');
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTaskDone = (index) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, done: !task.done } : task)));
  };

  return (
    <Box component={Paper} p={3}>
      <TextField
        label="New Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={addTask} variant="contained" color="primary" fullWidth>
        Add Task
      </Button>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
              <DeleteIcon />
            </IconButton>
          }>
            <Checkbox
              edge="start"
              checked={task.done}
              onChange={() => toggleTaskDone(index)}
            />
            <ListItemText
              primary={task.text}
              style={{ textDecoration: task.done ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ToDoList;
