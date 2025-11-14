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
  Card,
  CardContent,
  Stack,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Email,
  Send,
  Refresh,
  Settings,
  Search,
  FilterList,
  Download,
  CheckCircle,
  Error,
  Schedule,
  Visibility,
  Delete,
  Edit,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { emailService } from '../services/api';

const EmailManagement = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'LVS Machine Tools',
    enableSSL: true,
    testMode: false,
  });

  const emailTypes = [
    { value: 'invoice', label: 'Invoice', color: 'primary' },
    { value: 'order-confirmation', label: 'Order Confirmation', color: 'success' },
    { value: 'shipping-update', label: 'Shipping Update', color: 'info' },
    { value: 'promotional', label: 'Promotional', color: 'warning' },
    { value: 'support', label: 'Support', color: 'secondary' },
  ];

  const emailStatuses = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'sent', label: 'Sent', color: 'success' },
    { value: 'failed', label: 'Failed', color: 'error' },
    { value: 'bounced', label: 'Bounced', color: 'error' },
    { value: 'opened', label: 'Opened', color: 'info' },
  ];

  useEffect(() => {
    fetchEmails();
    fetchEmailSettings();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await emailService.getAllEmails();
      console.log('Emails response:', response);
      setEmails(response.emails || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailSettings = async () => {
    try {
      const response = await emailService.getEmailSettings();
      console.log('Email settings response:', response);
      setEmailSettings(response.settings || emailSettings);
    } catch (error) {
      console.error('Error fetching email settings:', error);
    }
  };

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setOpenDialog(true);
  };

  const handleResendEmail = async (emailId) => {
    try {
      await emailService.resendEmail(emailId);
      toast.success('Email queued for resending');
      fetchEmails();
    } catch (error) {
      console.error('Error resending email:', error);
      toast.error('Failed to resend email');
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (window.confirm('Are you sure you want to delete this email record?')) {
      try {
        await emailService.deleteEmail(emailId);
        toast.success('Email record deleted');
        fetchEmails();
      } catch (error) {
        console.error('Error deleting email:', error);
        toast.error('Failed to delete email');
      }
    }
  };

  const handleSaveEmailSettings = async () => {
    try {
      await emailService.updateEmailSettings(emailSettings);
      toast.success('Email settings saved successfully');
      setOpenSettingsDialog(false);
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
    }
  };

  const handleTestEmail = async () => {
    try {
      await emailService.sendTestEmail({
        email: emailSettings.fromEmail,
        subject: 'LVS Admin Panel - Email Test',
        message: 'This is a test email from the LVS Admin Panel.'
      });
      toast.success('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = emailStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'default';
  };

  const getTypeColor = (type) => {
    const typeConfig = emailTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : 'default';
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || email.status === statusFilter;
    const matchesType = !typeFilter || email.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getEmailsByStatus = (status) => {
    return emails.filter(email => email.status === status);
  };

  const emailStats = {
    total: emails.length,
    sent: getEmailsByStatus('sent').length,
    failed: getEmailsByStatus('failed').length,
    pending: getEmailsByStatus('pending').length,
    opened: getEmailsByStatus('opened').length,
  };

  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={emailTypes.find(t => t.value === params.value)?.label || params.value}
          color={getTypeColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'to',
      headerName: 'Recipient',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={emailStatuses.find(s => s.value === params.value)?.label || params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'sentAt',
      headerName: 'Sent At',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? format(new Date(params.value), 'MMM dd, yyyy HH:mm') : 'Not sent'}
        </Typography>
      ),
    },
    {
      field: 'openedAt',
      headerName: 'Opened At',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? format(new Date(params.value), 'MMM dd, yyyy HH:mm') : 'Not opened'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => handleViewEmail(params.row)}
            color="primary"
          >
            <Visibility />
          </IconButton>
          {params.row.status === 'failed' && (
            <IconButton
              size="small"
              onClick={() => handleResendEmail(params.row._id)}
              color="warning"
            >
              <Send />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => handleDeleteEmail(params.row._id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Email Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchEmails}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setOpenSettingsDialog(true)}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleTestEmail}
          >
            Test Email
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Emails
                  </Typography>
                  <Typography variant="h4">
                    {emailStats.total}
                  </Typography>
                </Box>
                <Email color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Sent
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {emailStats.sent}
                  </Typography>
                </Box>
                <CheckCircle color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Failed
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {emailStats.failed}
                  </Typography>
                </Box>
                <Error color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {emailStats.pending}
                  </Typography>
                </Box>
                <Schedule color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Opened
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {emailStats.opened}
                  </Typography>
                </Box>
                <Visibility color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={emailStats.total} color="primary">
                All Emails
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={emailStats.sent} color="success">
                Sent
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={emailStats.failed} color="error">
                Failed
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={emailStats.pending} color="warning">
                Pending
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search emails by recipient, subject, or type..."
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
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {emailStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Filter by Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {emailTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {/* Export functionality */}}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Emails Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredEmails}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Paper>

      {/* Email Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Email Details
        </DialogTitle>
        <DialogContent>
          {selectedEmail && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Email Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography><strong>Type:</strong></Typography>
                        <Chip
                          label={emailTypes.find(t => t.value === selectedEmail.type)?.label || selectedEmail.type}
                          color={getTypeColor(selectedEmail.type)}
                          size="small"
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography><strong>Status:</strong></Typography>
                        <Chip
                          label={emailStatuses.find(s => s.value === selectedEmail.status)?.label || selectedEmail.status}
                          color={getStatusColor(selectedEmail.status)}
                          size="small"
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography><strong>To:</strong></Typography>
                        <Typography>{selectedEmail.to}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography><strong>Subject:</strong></Typography>
                        <Typography>{selectedEmail.subject}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography><strong>Sent At:</strong></Typography>
                        <Typography>
                          {selectedEmail.sentAt ? 
                            format(new Date(selectedEmail.sentAt), 'PPpp') : 
                            'Not sent yet'}
                        </Typography>
                      </Box>
                      {selectedEmail.openedAt && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography><strong>Opened At:</strong></Typography>
                          <Typography>
                            {format(new Date(selectedEmail.openedAt), 'PPpp')}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Email Content
                    </Typography>
                    <Box 
                      sx={{ 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 1, 
                        p: 2,
                        maxHeight: 300,
                        overflow: 'auto'
                      }}
                      dangerouslySetInnerHTML={{ __html: selectedEmail.content || selectedEmail.html }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedEmail?.status === 'failed' && (
            <Button 
              onClick={() => handleResendEmail(selectedEmail._id)} 
              startIcon={<Send />}
              variant="contained"
            >
              Resend Email
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Email Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Email Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info">
                Configure your SMTP settings to enable email functionality. Make sure to test your settings after saving.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Host"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="SMTP Port"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Username"
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="SMTP Password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Name"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailSettings.enableSSL}
                    onChange={(e) => setEmailSettings({ ...emailSettings, enableSSL: e.target.checked })}
                  />
                }
                label="Enable SSL/TLS"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailSettings.testMode}
                    onChange={(e) => setEmailSettings({ ...emailSettings, testMode: e.target.checked })}
                  />
                }
                label="Test Mode (Don't actually send emails)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>Cancel</Button>
          <Button onClick={handleTestEmail} variant="outlined" startIcon={<Send />}>
            Test Settings
          </Button>
          <Button onClick={handleSaveEmailSettings} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailManagement;