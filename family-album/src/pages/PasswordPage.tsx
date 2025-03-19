import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const ALBUM_PASSWORD = "enes2121"; // Bu şifreyi istediğiniz gibi değiştirebilirsiniz

const PasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ALBUM_PASSWORD) {
      // Şifreyi localStorage'a kaydet
      localStorage.setItem('albumPassword', password);
      // Albüm sayfasına yönlendir
      navigate(`/album/${id}`);
    } else {
      setError(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <LockIcon
            sx={{
              fontSize: 48,
              color: '#667eea',
              mb: 2
            }}
          />
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              color: '#1a237e',
              fontWeight: 700,
              mb: 3
            }}
          >
            Aile Albümüne Hoş Geldiniz
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4
            }}
          >
            Fotoğrafları görmek için lütfen şifreyi girin
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Şifre"
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              error={error}
              helperText={error ? "Yanlış şifre" : ""}
              sx={{ mb: 3 }}
              autoFocus
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #764ba2, #667eea)',
                },
              }}
            >
              Giriş Yap
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default PasswordPage; 