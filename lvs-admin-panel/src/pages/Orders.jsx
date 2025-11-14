import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      console.log('Orders response:', response);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'orderId', headerName: 'Order ID', width: 150 },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      width: 200,
      valueGetter: (params) => {
        if (params.row.customerInfo) {
          const first = params.row.customerInfo.firstName || '';
          const last = params.row.customerInfo.lastName || '';
          return `${first} ${last}`.trim() || 'N/A';
        }
        return 'N/A';
      }
    },
    { 
      field: 'totalPrice', 
      headerName: 'Amount', 
      width: 120,
      renderCell: (params) => `₹${(params.value || 0).toLocaleString()}`
    },
    { field: 'orderStatus', headerName: 'Status', width: 150 },
    { field: 'paymentMethod', headerName: 'Payment', width: 120 },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString()
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Orders</Typography>
      <Button onClick={fetchOrders} sx={{ mb: 2 }}>Refresh</Button>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          pageSize={10}
        />
      </Paper>
    </Box>
  );
};

export default Orders;
