import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import {
  Visibility,
  Email,
  Block,
  Person,
  Search,
  FilterList,
  Download,
  ShoppingCart,
  LocationOn,
  Phone,
  CalendarToday,
  TrendingUp,
  ExpandMore,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { customerService, orderService } from '../services/api';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      console.log('Customers response:', response);
      setCustomers(response.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      console.log('Orders response in Customers:', response);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set empty array on error
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleBlockCustomer = async (customerId, isBlocked) => {
    try {
      await api.put(`/customers/${customerId}`, { isBlocked: !isBlocked });
      toast.success(`Customer ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Failed to update customer status');
    }
  };

  const handleSendEmail = (customer) => {
    // In a real app, this would open an email composer
    window.open(`mailto:${customer.email}?subject=LVS Machine Tools - Important Update`);
  };

  const getCustomerOrders = (customer) => {
    if (!orders || !Array.isArray(orders) || !customer) {
      return [];
    }
    
    // Match orders by customerInfo.email with customer email
    // Also match by userId for backward compatibility
    return orders.filter(order => 
      order.customerInfo?.email?.toLowerCase() === customer.email?.toLowerCase() ||
      order.userId === customer._id || 
      order.user?._id === customer._id ||
      order.user?.email?.toLowerCase() === customer.email?.toLowerCase()
    );
  };

  const getCustomerStats = (customer) => {
    const customerOrders = getCustomerOrders(customer);
    console.log(`Customer ${customer.firstName} ${customer.lastName} (${customer.email}) has ${customerOrders.length} orders:`, 
      customerOrders.map(o => ({ id: o._id, totalPrice: o.totalPrice, email: o.customerInfo?.email })));
    
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const completedOrders = customerOrders.filter(order => 
      order.orderStatus === 'Delivered' || order.status === 'completed'
    ).length;
    
    // Safely get last order date
    let lastOrderDate = null;
    if (customerOrders.length > 0) {
      try {
        const dates = customerOrders
          .filter(order => order.createdAt)
          .map(order => new Date(order.createdAt))
          .filter(date => !isNaN(date.getTime()));
        
        if (dates.length > 0) {
          lastOrderDate = new Date(Math.max(...dates)).toISOString();
        }
      } catch (error) {
        console.warn('Error calculating last order date:', error);
        lastOrderDate = null;
      }
    }
    
    return {
      totalOrders: customerOrders.length,
      totalSpent,
      completedOrders,
      lastOrderDate
    };
  };

  const getCustomerType = (customer) => {
    const stats = getCustomerStats(customer);
    
    // Calculate days since customer registered
    const accountAge = customer.createdAt ? 
      Math.floor((new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24)) : 0;
    
    // VIP: Total spent > ₹1,00,000 (1 lakh)
    if (stats.totalSpent > 100000) return { label: 'VIP', color: 'error' };
    
    // Premium: Total spent > ₹50,000 (50k)  
    if (stats.totalSpent > 50000) return { label: 'Premium', color: 'warning' };
    
    // Regular: Has placed 3+ orders OR spent > ₹10,000 OR account older than 7 days
    if (stats.totalOrders >= 3 || stats.totalSpent > 10000 || accountAge > 7) {
      return { label: 'Regular', color: 'success' };
    }
    
    // New: Account created within last 7 days AND low activity
    return { label: 'New', color: 'info' };
  };

  const filteredCustomers = customers.filter(customer => {
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && !customer.isBlocked) ||
      (statusFilter === 'blocked' && customer.isBlocked) ||
      (statusFilter === getCustomerType(customer).label.toLowerCase());
    
    // Filter by selected tab
    const customerType = getCustomerType(customer).label.toLowerCase();
    const matchesTab = tabValue === 0 || // All customers tab
      (tabValue === 1 && customerType === 'vip') ||
      (tabValue === 2 && customerType === 'premium') ||
      (tabValue === 3 && customerType === 'regular') ||
      (tabValue === 4 && customerType === 'new');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getCustomersByType = (type) => {
    return customers.filter(customer => getCustomerType(customer).label.toLowerCase() === type);
  };

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => {
        const firstName = params.row.firstName || '';
        const firstLetter = firstName.charAt(0).toUpperCase();
        
        return (
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            {firstLetter || <Person />}
          </Avatar>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Customer Name',
      width: 200,
      valueGetter: (params) => {
        const firstName = params.row.firstName || '';
        const lastName = params.row.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      },
      renderCell: (params) => {
        const firstName = params.row.firstName || '';
        const lastName = params.row.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'N/A';
        
        return (
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {fullName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'customerType',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => {
        const customerType = getCustomerType(params.row);
        return (
          <Chip
            label={customerType.label}
            color={customerType.color}
            size="small"
          />
        );
      },
    },
    {
      field: 'totalOrders',
      headerName: 'Orders',
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {getCustomerStats(params.row).totalOrders}
        </Typography>
      ),
    },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          ₹{getCustomerStats(params.row).totalSpent.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'lastOrder',
      headerName: 'Last Order',
      width: 120,
      renderCell: (params) => {
        const lastOrderDate = getCustomerStats(params.row).lastOrderDate;
        return (
          <Typography variant="body2">
            {lastOrderDate ? format(new Date(lastOrderDate), 'MMM dd, yyyy') : 'Never'}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.isBlocked ? 'Blocked' : 'Active'}
          color={params.row.isBlocked ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => handleViewCustomer(params.row)}
            color="primary"
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleSendEmail(params.row)}
            color="info"
          >
            <Email />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleBlockCustomer(params.row._id, params.row.isBlocked)}
            color={params.row.isBlocked ? 'success' : 'error'}
          >
            <Block />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => !c.isBlocked).length,
    blocked: customers.filter(c => c.isBlocked).length,
    vip: getCustomersByType('vip').length,
    premium: getCustomersByType('premium').length,
    regular: getCustomersByType('regular').length,
    new: getCustomersByType('new').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Customers Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Customers
                  </Typography>
                  <Typography variant="h4">
                    {customerStats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Customers
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {customerStats.active}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    VIP Customers
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {customerStats.vip}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Person />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Blocked Customers
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {customerStats.blocked}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Block />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customer Type Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={customerStats.total} color="primary">
                All Customers
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={customerStats.vip} color="error">
                VIP
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={customerStats.premium} color="warning">
                Premium
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={customerStats.regular} color="success">
                Regular
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={customerStats.new} color="info">
                New
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {/* Add advanced filters */}}
            >
              Advanced Filters
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {/* Export customers */}}
            >
              Export Customers
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Customers Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredCustomers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row._id || row.email}
        />
      </Paper>

      {/* Customer Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Customer Details - {selectedCustomer ? `${selectedCustomer.firstName || ''} ${selectedCustomer.lastName || ''}`.trim() || 'Unknown Customer' : 'Unknown Customer'}
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                        {selectedCustomer.firstName ? selectedCustomer.firstName.charAt(0).toUpperCase() : <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {`${selectedCustomer.firstName || ''} ${selectedCustomer.lastName || ''}`.trim() || 'Unknown Name'}
                        </Typography>
                        <Chip
                          label={getCustomerType(selectedCustomer).label}
                          color={getCustomerType(selectedCustomer).color}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Stack spacing={1}>
                      <Box display="flex" alignItems="center">
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{selectedCustomer.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{selectedCustomer.phone || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{selectedCustomer.address || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>
                          Joined: {selectedCustomer.createdAt ? 
                            format(new Date(selectedCustomer.createdAt), 'PPP') : 'Unknown'}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Customer Stats */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Purchase Statistics
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Total Orders:</Typography>
                        <Typography fontWeight="bold">
                          {getCustomerStats(selectedCustomer).totalOrders}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Total Spent:</Typography>
                        <Typography fontWeight="bold" color="success.main">
                          ₹{getCustomerStats(selectedCustomer).totalSpent.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Completed Orders:</Typography>
                        <Typography fontWeight="bold">
                          {getCustomerStats(selectedCustomer).completedOrders}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Last Order:</Typography>
                        <Typography fontWeight="bold">
                          {getCustomerStats(selectedCustomer).lastOrderDate ? 
                            format(new Date(getCustomerStats(selectedCustomer).lastOrderDate), 'PPP') : 
                            'Never'}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order History */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">
                      Order History ({getCustomerOrders(selectedCustomer._id || selectedCustomer.email).length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {getCustomerOrders(selectedCustomer._id || selectedCustomer.email).map((order, index) => (
                        <React.Fragment key={order._id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <ShoppingCart />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`Order #${order.orderId || order._id.slice(-8)}`}
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    Amount: ₹{order.totalAmount?.toLocaleString()} | 
                                    Status: {order.status} | 
                                    Date: {format(new Date(order.createdAt), 'PPP')}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Chip
                              label={order.status}
                              color={
                                order.status === 'completed' ? 'success' :
                                order.status === 'pending' ? 'warning' :
                                order.status === 'cancelled' ? 'error' : 'default'
                              }
                              size="small"
                            />
                          </ListItem>
                          {index < getCustomerOrders(selectedCustomer._id || selectedCustomer.email).length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button 
            onClick={() => handleSendEmail(selectedCustomer)} 
            startIcon={<Email />}
            variant="outlined"
          >
            Send Email
          </Button>
          <Button 
            onClick={() => handleBlockCustomer(selectedCustomer._id, selectedCustomer.isBlocked)}
            startIcon={<Block />}
            variant="contained"
            color={selectedCustomer?.isBlocked ? 'success' : 'error'}
          >
            {selectedCustomer?.isBlocked ? 'Unblock' : 'Block'} Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
