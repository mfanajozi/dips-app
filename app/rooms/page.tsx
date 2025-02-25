"use client"

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Delete, Hotel, Person, CheckCircle, Build } from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface Room {
  id: string;
  site: string;
  building: string;
  room_type: string;
  room_number: string;
  occupant: string;
  check_in_date: string | null;
  notes: string | null;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('rooms')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setRooms(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const occupiedRooms = rooms.filter(room => room.occupant);
  const availableRooms = rooms.filter(room => !room.occupant);

  // TODO: Implement logic to fetch maintenance requests related to rooms
  const maintenanceRequests = 3;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Room Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: "100%",
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)'
            },
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Rooms
              </Typography>
              <Typography variant="h4">
                {rooms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: "100%",
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)'
            },
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Occupied Rooms
              </Typography>
              <Typography variant="h4">
                {occupiedRooms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: "100%",
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)'
            },
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Available Rooms
              </Typography>
              <Typography variant="h4">
                {availableRooms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: "100%",
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)'
            },
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Maintenance Requests
              </Typography>
              <Typography variant="h4">
                {maintenanceRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Rooms" />
          <Tab label="Maintenance" />
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        '& .MuiTableHead-root': {
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        },
        '& .MuiTableRow-root': {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }
        },
        '& .MuiTableCell-head': {
          fontWeight: 700,
          color: '#1a237e',
          fontSize: '0.95rem',
          whiteSpace: 'nowrap'
        }
      }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Site</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Room Number</TableCell>
              <TableCell>Occupant</TableCell>
              <TableCell>Check-In Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.site}
                </TableCell>
                <TableCell>{row.building}</TableCell>
                <TableCell>{row.room_type}</TableCell>
                <TableCell>{row.room_number}</TableCell>
                <TableCell>{row.occupant}</TableCell>
                <TableCell>{row.check_in_date ? format(new Date(row.check_in_date), 'dd MMM yyyy') : 'N/A'}</TableCell>
                <TableCell>{row.notes}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RoomsPage;
