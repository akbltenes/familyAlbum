import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api, { ApiError } from '../services/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('Dosya boyutu 10MB\'dan büyük olamaz.');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploaderName.trim()) {
      setError('Lütfen bir dosya seçin ve yükleyenin adını girin.');
      return;
    }

    try {
      setIsUploading(true);
      await api.uploadPhoto(selectedFile, uploaderName.trim());
      setSuccess(true);
      setSelectedFile(null);
      setUploaderName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        navigate(`/album/${id}`);
      }, 500);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        gap: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: 600,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Fotoğraf Yükle
        </Typography>

        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3,
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography>
            {selectedFile
              ? `Seçilen dosya: ${selectedFile.name}`
              : 'Fotoğraf seçmek için tıklayın veya sürükleyin'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Maksimum dosya boyutu: 10MB
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Yükleyenin Adı"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          margin="normal"
          disabled={isUploading}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || !uploaderName.trim() || isUploading}
          sx={{ mt: 2 }}
        >
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Fotoğrafı Yükle'
          )}
        </Button>
      </Paper>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={500}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            fontSize: '1.1rem',
            backgroundColor: '#4caf50',
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          Fotoğraf başarıyla yüklendi! Albüme yönlendiriliyorsunuz...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadPage; 