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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { supabase } from '@/lib/supabase';

interface Vehicle {
  id: string;
  registration_number: string;
  vehicle: string;
  site: string;
  driver: string;
  mileage: number;
  route: string;
  notes: string;
}

const TransportationPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('transport')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setVehicles(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transport Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Vehicles
              </Typography>
              <Typography variant="h4">
                {vehicles.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Active Drivers
              </Typography>
              <Typography variant="h4">
                {/* Implement logic to count active drivers */}
                1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Active Routes
              </Typography>
              <Typography variant="h4">
                {/* Implement logic to count active routes */}
                1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Vehicles
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Registration Number</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Mileage</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.registration_number}
                </TableCell>
                <TableCell>{row.vehicle}</TableCell>
                <TableCell>{row.site}</TableCell>
                <TableCell>{row.driver}</TableCell>
                <TableCell>{row.mileage}</TableCell>
                <TableCell>{row.route}</TableCell>
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

export default TransportationPage;
