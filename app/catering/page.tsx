"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  Chip,
  IconButton,
  Tab,
  Tabs,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Restaurant, ShoppingCart, Edit, Delete, LocalDining } from "@mui/icons-material"
import { supabase } from "@/lib/supabase"
import type { Catering } from "@/app/types/catering"

// State interface
interface CateringState {
  meals: Catering[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CateringState = {
  meals: [],
  loading: true,
  error: null,
};

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`catering-tabpanel-${index}`}
      aria-labelledby={`catering-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "in progress":
      return "primary"
    case "scheduled":
      return "info"
    case "completed":
      return "success"
    case "low":
      return "warning"
    case "sufficient":
      return "success"
    default:
      return "default"
  }
}

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
)

export default function CateringManagement() {
  const [tabValue, setTabValue] = useState(0)
  const [state, setState] = useState<CateringState>(initialState);

  const fetchCateringData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data: mealsData, error: mealsError } = await supabase
        .from('catering')
        .select('*');

      if (mealsError) {
        throw new Error('Failed to fetch catering data');
      }

      setState({
        meals: mealsData || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  useEffect(() => {
    fetchCateringData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (state.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (state.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{state.error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Catering Management
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total Meals Today" value={state.meals.length} icon={<Restaurant color="primary" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Menu Items" value={0} icon={<LocalDining color="primary" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Low Stock Items"
            value={0}
            icon={<ShoppingCart color="primary" />}
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Meals" />
          <Tab label="Menu Items" />
          <Tab label="Inventory" />
        </Tabs>
      </Box>

      {/* Meals Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Meal</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Average Attendance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>{meal.site}</TableCell>
                  <TableCell>{meal.building_name}</TableCell>
                  <TableCell>{meal.chef_name}</TableCell>
                  <TableCell>{meal.shift}</TableCell>
                  <TableCell>{meal.item}</TableCell>
                  <TableCell>{meal.quantity}</TableCell>
                  <TableCell>{meal.date_reported}</TableCell>
                  <TableCell>
                    <Chip label={meal.status || "N/A"} color={getStatusColor(meal.status || "default")} size="small" />
                  </TableCell>
                  <TableCell>{meal.notes}</TableCell>
                  <TableCell>{meal.created_at}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Menu Items Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Dietary Info</TableCell>
                <TableCell>Popularity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.dietaryInfo}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress variant="determinate" value={item.popularity} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${item.popularity}%`}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Inventory Tab */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  )
}
