import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card 
    sx={{ 
      height: '100%', 
      transition: 'transform 0.2s', 
      '&:hover': { transform: 'translateY(-5px)' },
      background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 2,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div" sx={{ color: color }}>
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h3" 
        component="div" 
        sx={{ 
          fontWeight: 'bold',
          color: color,
          textAlign: 'center',
          mt: 2
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
     

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#333' }}>
          Welcome to Admin Dashboard
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Employers"
              value={stats.counts?.employers || 0}
              icon={<BusinessIcon sx={{ color: '#1976d2', fontSize: 40 }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Job Seekers"
              value={stats.counts?.jobSeekers || 0}
              icon={<PeopleIcon sx={{ color: '#2e7d32', fontSize: 40 }} />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Jobs"
              value={stats.counts?.totalJobs || 0}
              icon={<WorkIcon sx={{ color: '#ed6c02', fontSize: 40 }} />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Applications"
              value={stats.counts?.totalApplications || 0}
              icon={<AssignmentIcon sx={{ color: '#9c27b0', fontSize: 40 }} />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 