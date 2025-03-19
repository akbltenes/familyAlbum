import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  IconButton,
  Fade,
  Dialog,
  DialogContent,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';
import api, { Photo } from '../services/api';

const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const fetchedPhotos = await api.getAllPhotos();
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = () => {
    navigate('/upload/ailealbumu');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Aile Albümümüz',
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2,
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ pt: 4, pb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 6,
              flexWrap: 'wrap',
              gap: 2
            }}
          >
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
              Aile Albümümüz
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                onClick={handleShare}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                <ShareIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/upload/${id}`)}
                sx={{
                  bgcolor: 'white',
                  color: '#764ba2',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Fotoğraf Ekle
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {photos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} key={photo.id}>
                <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      bgcolor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={api.getPhotoUrl(photo.fileName)}
                      alt="Aile fotoğrafı"
                      sx={{
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontWeight: 500,
                          mb: 1
                        }}
                      >
                        Yükleyen: {photo.uploadedBy}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#888' }}
                      >
                        Tarih: {new Date(photo.uploadDate).toLocaleDateString('tr-TR')}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto' }}>
                      <Button
                        size="small"
                        startIcon={<CloudDownloadIcon />}
                        sx={{
                          color: '#764ba2',
                          '&:hover': {
                            bgcolor: 'rgba(118,75,162,0.1)',
                          }
                        }}
                        onClick={() => window.open(api.getPhotoUrl(photo.fileName), '_blank')}
                      >
                        İndir
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #764ba2, #667eea)',
          }
        }}
        onClick={() => navigate(`/upload/${id}`)}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedPhoto && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.4)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.6)',
                }
              }}
              onClick={() => setSelectedPhoto(null)}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={api.getPhotoUrl(selectedPhoto.fileName)}
              alt={selectedPhoto.fileName}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default AlbumPage; 