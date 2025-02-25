"use client"

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Home,
  Hotel,
  DirectionsCar,
  Restaurant,
  Build,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DashboardState {
  loading: boolean;
  error: string | null;
  stats: {
    rooms: {
      total: number;
      occupied: number;
      available: number;
      maintenance: number;
    };
    maintenance: {
      total: number;
      highPriority: number;
      inProgress: number;
      completed: number;
    };
    transport: {
      total: number;
      active: number;
      completed: number;
      pending: number;
    };
    catering: {
      total: number;
      today: number;
      upcoming: number;
      completed: number;
    };
  };
}

const initialState: DashboardState = {
  loading: true,
  error: null,
  stats: {
    rooms: {
      total: 0,
      occupied: 0,
      available: 0,
      maintenance: 0,
    },
    maintenance: {
      total: 0,
      highPriority: 0,
      inProgress: 0,
      completed: 0,
    },
    transport: {
      total: 0,
      active: 0,
      completed: 0,
      pending: 0,
    },
    catering: {
      total: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
    },
  },
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "primary",
  onClick 
}: { 
  title: string; 
  value: number; 
  icon: any;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  onClick?: () => void;
}) => (
  <Card 
    sx={{
      height: "100%",
      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease-in-out',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': onClick ? {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
        '& .MuiSvgIcon-root': {
          transform: 'scale(1.1)',
        }
      } : {},
      borderRadius: 2,
      overflow: 'hidden',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5))',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
      },
      '&:hover::after': {
        opacity: 1,
      }
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Icon 
          color={color} 
          sx={{ 
            fontSize: '2rem',
            transition: 'transform 0.3s ease-in-out'
          }} 
        />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            ml: 1,
            fontWeight: 500,
            color: theme => theme.palette[color].main
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h4" 
        component="div"
        sx={{
          fontWeight: 600,
          color: '#1a237e'
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DetailDialog = ({ 
  open, 
  onClose, 
  title, 
  children 
}: { 
  open: boolean; 
  onClose: () => void; 
  title: string;
  children: React.ReactNode;
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 2,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      }
    }}
  >
    <DialogTitle sx={{ 
      bgcolor: '#1a237e', 
      color: 'white',
      fontWeight: 600
    }}>
      {title}
    </DialogTitle>
    <DialogContent>
      {children}
    </DialogContent>
  </Dialog>
);

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>(initialState);
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    open: false,
    title: '',
    content: null,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Fetch rooms data
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*');

        if (roomsError) throw new Error('Failed to fetch rooms data');

        // Fetch maintenance data
        const { data: maintenanceData, error: maintenanceError } = await supabase
          .from('maintenance')
          .select('*');

        if (maintenanceError) throw new Error('Failed to fetch maintenance data');

        // Fetch transport data
        const { data: transportData, error: transportError } = await supabase
          .from('transport')
          .select('*');

        if (transportError) throw new Error('Failed to fetch transport data');

        // Fetch catering data
        const { data: cateringData, error: cateringError } = await supabase
          .from('catering')
          .select('*');

        if (cateringError) throw new Error('Failed to fetch catering data');

        // Calculate stats
        const stats = {
          rooms: {
            total: roomsData?.length || 0,
            occupied: roomsData?.filter(room => room.occupant).length || 0,
            available: roomsData?.filter(room => !room.occupant).length || 0,
            maintenance: roomsData?.filter(room => room.status === 'maintenance').length || 0,
          },
          maintenance: {
            total: maintenanceData?.length || 0,
            highPriority: maintenanceData?.filter(item => item.priority === 'High').length || 0,
            inProgress: maintenanceData?.filter(item => item.status === 'In Progress').length || 0,
            completed: maintenanceData?.filter(item => item.status === 'Completed').length || 0,
          },
          transport: {
            total: transportData?.length || 0,
            active: transportData?.filter(item => item.status === 'Active').length || 0,
            completed: transportData?.filter(item => item.status === 'Completed').length || 0,
            pending: transportData?.filter(item => item.status === 'Pending').length || 0,
          },
          catering: {
            total: cateringData?.length || 0,
            today: cateringData?.filter(item => {
              const today = new Date();
              const itemDate = new Date(item.date);
              return itemDate.toDateString() === today.toDateString();
            }).length || 0,
            upcoming: cateringData?.filter(item => {
              const today = new Date();
              const itemDate = new Date(item.date);
              return itemDate > today;
            }).length || 0,
            completed: cateringData?.filter(item => item.status === 'Completed').length || 0,
          },
        };

        setState(prev => ({
          ...prev,
          loading: false,
          stats,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (section: string) => {
    router.push(`/${section}`);
  };

  if (state.loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="textSecondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          An error occurred while loading dashboard data
        </Alert>
        <Typography color="error" variant="body2">
          {state.error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1600px', margin: '0 auto' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          fontWeight: 600,
          color: '#1a237e',
          mb: 4
        }}
      >
        Dashboard
      </Typography>

      {/* Rooms Section */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: '#1a237e',
          display: 'flex',
          alignItems: 'center',
          '& .MuiSvgIcon-root': {
            mr: 1
          }
        }}
      >
        <Hotel /> Rooms Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rooms"
            value={state.stats.rooms.total}
            icon={Hotel}
            onClick={() => handleCardClick('rooms')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupied"
            value={state.stats.rooms.occupied}
            icon={Home}
            color="primary"
            onClick={() => handleCardClick('rooms')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available"
            value={state.stats.rooms.available}
            icon={CheckCircle}
            color="success"
            onClick={() => handleCardClick('rooms')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Under Maintenance"
            value={state.stats.rooms.maintenance}
            icon={Build}
            color="warning"
            onClick={() => handleCardClick('maintenance')}
          />
        </Grid>
      </Grid>

      {/* Maintenance Section */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: '#1a237e',
          display: 'flex',
          alignItems: 'center',
          '& .MuiSvgIcon-root': {
            mr: 1
          }
        }}
      >
        <Build /> Maintenance Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={state.stats.maintenance.total}
            icon={Build}
            onClick={() => handleCardClick('maintenance')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Priority"
            value={state.stats.maintenance.highPriority}
            icon={Warning}
            color="error"
            onClick={() => handleCardClick('maintenance')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={state.stats.maintenance.inProgress}
            icon={TrendingUp}
            color="info"
            onClick={() => handleCardClick('maintenance')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={state.stats.maintenance.completed}
            icon={CheckCircle}
            color="success"
            onClick={() => handleCardClick('maintenance')}
          />
        </Grid>
      </Grid>

      {/* Transport Section */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: '#1a237e',
          display: 'flex',
          alignItems: 'center',
          '& .MuiSvgIcon-root': {
            mr: 1
          }
        }}
      >
        <DirectionsCar /> Transport Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={state.stats.transport.total}
            icon={DirectionsCar}
            onClick={() => handleCardClick('transportation')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active"
            value={state.stats.transport.active}
            icon={TrendingUp}
            color="primary"
            onClick={() => handleCardClick('transportation')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={state.stats.transport.pending}
            icon={Warning}
            color="warning"
            onClick={() => handleCardClick('transportation')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={state.stats.transport.completed}
            icon={CheckCircle}
            color="success"
            onClick={() => handleCardClick('transportation')}
          />
        </Grid>
      </Grid>

      {/* Catering Section */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: '#1a237e',
          display: 'flex',
          alignItems: 'center',
          '& .MuiSvgIcon-root': {
            mr: 1
          }
        }}
      >
        <Restaurant /> Catering Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={state.stats.catering.total}
            icon={Restaurant}
            onClick={() => handleCardClick('catering')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Orders"
            value={state.stats.catering.today}
            icon={TrendingUp}
            color="primary"
            onClick={() => handleCardClick('catering')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming"
            value={state.stats.catering.upcoming}
            icon={Warning}
            color="info"
            onClick={() => handleCardClick('catering')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={state.stats.catering.completed}
            icon={CheckCircle}
            color="success"
            onClick={() => handleCardClick('catering')}
          />
        </Grid>
      </Grid>

      <DetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, title: '', content: null })}
        title={detailDialog.title}
      >
        {detailDialog.content}
      </DetailDialog>
    </Box>
  );
}
