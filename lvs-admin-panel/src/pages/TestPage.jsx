import React from 'react';
import { Box, Typography } from '@mui/material';

const TestPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Test Page</Typography>
      <Typography>If you can see this, the app is working!</Typography>
    </Box>
  );
};

export default TestPage;