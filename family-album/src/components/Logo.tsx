import React from 'react';
import { Typography } from '@mui/material';

export const Logo: React.FC = () => {
  return (
    <Typography
      variant="h4"
      component="div"
      sx={{
        fontWeight: 'bold',
        color: '#1976d2',
        userSelect: 'none'
      }}
    >
      EA
    </Typography>
  );
}; 