import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Recommend from './pages/Recommend';
import Login from './pages/Login';
import Register from './pages/Register'; // Import the new Register page

const App = () => (
  <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exercise/:id" element={<ExerciseDetail />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* Add Register route */}
    </Routes>
    <Footer />
  </Box>
);

export default App;
