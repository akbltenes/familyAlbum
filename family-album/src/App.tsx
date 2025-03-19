import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import UploadPage from './pages/UploadPage';
import PasswordPage from './pages/PasswordPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

// Şifre kontrolü için özel component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('albumPassword') === '3011';
  
  if (!isAuthenticated) {
    return <Navigate to="/password/ailealbumu" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/password/:id" element={<PasswordPage />} />
          <Route 
            path="/album/:id" 
            element={
              <ProtectedRoute>
                <AlbumPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload/:id" 
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
