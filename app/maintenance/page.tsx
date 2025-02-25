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
  Tabs,
  Tab,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Build, CheckCircle, Warning, Error, Schedule, Add } from "@mui/icons-material"
import { supabase } from "@/lib/supabase"
import type { Maintenance } from "@/app/types/maintenance"

// State interface
interface MaintenanceState {
  openRequests: Maintenance[];
  closedRequests: Maintenance[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MaintenanceState = {
  openRequests: [],
  closedRequests: [],
  loading: true,
  error: null,
};

const sites = [
  "All Sites",
  "Pretoria CBD",
  "Capital Park",
  "Kempton Park | CJ",
  "Olievenhoutbosch",
  "Benoni | Tom Jones"
]

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
      id={`maintenance-tabpanel-${index}`}
      aria-labelledby={`maintenance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function getPriorityIcon(priority: string | null) {
  switch (priority?.toLowerCase()) {
    case "high":
      return <Error color="error" />
    case "medium":
      return <Warning color="warning" />
    case "low":
      return <Schedule color="info" />
    default:
      return <Build />
  }
}

function getStatusColor(status: string | null) {
  switch (status?.toLowerCase()) {
    case "in progress":
      return "primary"
    case "pending":
      return "warning"
    case "scheduled":
      return "info"
    case "completed":
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

export default function MaintenanceManagement() {
  const [siteFilter, setSiteFilter] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    site: "",
    room: "",
    issue: "",
    priority: "",
  })
  const [state, setState] = useState<MaintenanceState>(initialState);

  const handleSiteChange = (event: React.SyntheticEvent, newValue: number) => {
    setSiteFilter(newValue)
  }

  const handleModalOpen = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setNewRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("New maintenance request:", newRequest)
    // Here you would typically send the new request to your backend
    handleModalClose()
    // Reset the form
    setNewRequest({ site: "", room: "", issue: "", priority: "" })
  }

  const fetchMaintenanceData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance')
        .select('*');

      if (maintenanceError) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: maintenanceError.message
        }));
        return;
      }

      // Separate open and closed requests
      const openRequests = maintenanceData?.filter(item => item.status !== 'Completed') || [];
      const closedRequests = maintenanceData?.filter(item => item.status === 'Completed') || [];

      setState({
        openRequests: openRequests,
        closedRequests: closedRequests,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch maintenance data'
      }));
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const filteredOpenRequests =
    siteFilter === 0
      ? state.openRequests
      : state.openRequests.filter((request) => request.site === sites[siteFilter]);

  const filteredClosedRequests =
    siteFilter === 0
      ? state.closedRequests
      : state.closedRequests.filter((request) => request.site === sites[siteFilter]);

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
        <Alert severity="error" sx={{ mb: 2 }}>
          An error occurred while loading maintenance data
        </Alert>
        <Typography color="error" variant="body2">
          {state.error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Maintenance Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleModalOpen}>
          Submit Request
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Open Requests" value={state.openRequests.length} icon={<Build color="primary" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Priority"
            value={state.openRequests.filter((r) => r.priority === "High").length}
            icon={<Error color="error" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={state.openRequests.filter((r) => r.status === "In Progress").length}
            icon={<Build color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Closed (Last 30 Days)"
            value={state.closedRequests.length}
            icon={<CheckCircle color="success" />}
          />
        </Grid>
      </Grid>

      {/* Site Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={siteFilter} onChange={handleSiteChange} aria-label="site filter tabs">
          {sites.map((site, index) => (
            <Tab key={index} label={site} />
          ))}
        </Tabs>
      </Box>

      {/* Open Requests Table */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Open Maintenance Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Days Open</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOpenRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.site}</TableCell>
                <TableCell>{request.room_number}</TableCell>
                <TableCell>{request.issue}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getPriorityIcon(request.priority)}
                    <Typography sx={{ ml: 1 }}>{request.priority}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                </TableCell>
                <TableCell>
                  {request.date_reported ? 
                    Math.ceil((new Date().getTime() - new Date(request.date_reported).getTime()) / (1000 * 60 * 60 * 24))
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Closed Requests Table */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Closed Maintenance Requests (Last 30 Days)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Closed Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClosedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.site}</TableCell>
                <TableCell>{request.room_number}</TableCell>
                <TableCell>{request.issue}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getPriorityIcon(request.priority)}
                    <Typography sx={{ ml: 1 }}>{request.priority}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{request.date_resolved ? new Date(request.date_resolved).toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submit Maintenance Request Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
            Submit Maintenance Request
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="site-select-label">Site</InputLabel>
              <Select
                labelId="site-select-label"
                id="site-select"
                value={newRequest.site}
                label="Site"
                name="site"
                onChange={handleSelectChange}
                required
              >
              <MenuItem value="Pretoria CBD">Pretoria CBD</MenuItem>
              <MenuItem value="Capital Park">Capital Park</MenuItem>
              <MenuItem value="Kempton Park | CJ">Kempton Park | CJ</MenuItem>
              <MenuItem value="Olievenhoutbosch">Olievenhoutbosch</MenuItem>
              <MenuItem value="Benoni | Tom Jones">Benoni | Tom Jones</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Room Number"
              name="room"
              value={newRequest.room}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Issue Description"
              name="issue"
              value={newRequest.issue}
              onChange={handleInputChange}
              multiline
              rows={3}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                value={newRequest.priority}
                label="Priority"
                name="priority"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleModalClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}
