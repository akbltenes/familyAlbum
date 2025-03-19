import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  CircularProgress,
  IconButton,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import api from '../services/api';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploaderName) return;

    try {
      setIsUploading(true);
      await api.uploadPhoto(selectedFile, uploaderName);
      navigate('/album/ailealbumu');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Fotoğraf yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <IconButton
              onClick={() => navigate('/album/ailealbumu')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Fotoğraf Yükle
            </Typography>
          </Box>

          <Fade in={true}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <TextField
                  fullWidth
                  label="Adınız"
                  variant="outlined"
                  value={uploaderName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUploaderName(e.target.value)}
                  disabled={isUploading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#764ba2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#764ba2',
                      }
                    }
                  }}
                />

                <Box
                  sx={{
                    border: '2px dashed #764ba2',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: isUploading ? 'transparent' : 'rgba(118,75,162,0.04)',
                      transform: isUploading ? 'none' : 'translateY(-2px)'
                    }
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  {!previewUrl ? (
                    <>
                      <PhotoCameraIcon sx={{ fontSize: 64, color: '#764ba2', mb: 2 }} />
                      <Typography variant="h6" gutterBottom sx={{ color: '#764ba2', fontWeight: 600 }}>
                        Fotoğraf Seç
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        veya buraya sürükleyip bırakın
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
                        Maksimum dosya boyutu: 10MB
                      </Typography>
                    </>
                  ) : (
                    <Box
                      sx={{
                        position: 'relative',
                        '&:hover .overlay': {
                          opacity: 1
                        }
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Önizleme"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '8px'
                        }}
                      />
                      {!isUploading && (
                        <Box
                          className="overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            borderRadius: '8px'
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ color: 'white', fontWeight: 500 }}
                          >
                            Fotoğrafı Değiştir
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!selectedFile || !uploaderName || isUploading}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #764ba2, #667eea)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                    },
                    '&.Mui-disabled': {
                      background: '#ccc'
                    }
                  }}
                >
                  {isUploading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ mr: 1 }} />
                      Yükle
                    </>
                  )}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadPage; 