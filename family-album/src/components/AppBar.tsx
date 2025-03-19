import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Box } from '@mui/material';
import { Logo } from './Logo';

export const AppBar: React.FC = () => {
  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <Logo />
          <Typography variant="h6" component="div">
            Aile Albümü
          </Typography>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}; 