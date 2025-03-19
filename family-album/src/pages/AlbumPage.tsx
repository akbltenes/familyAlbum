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
  Snackbar,
  Alert,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  CloudDownload as CloudDownloadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api, { Photo, ApiError } from '../services/api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const fetchedPhotos = await api.getAllPhotos();
      setPhotos(fetchedPhotos);
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = () => {
    navigate(`/upload/${id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Aile Albümümüz',
        url: window.location.href
      });
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDialog = () => {
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (id: number) => {
    try {
      setDeleteLoading(id);
      await api.deletePhoto(id);
      setPhotos(photos.filter(photo => photo.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCloseError = () => {
    setError(null);
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
                onClick={handleAddPhoto}
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
            {photos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo.id}>
                <Fade in={true} style={{ transitionDelay: `${photo.id * 100}ms` }}>
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        '& .deleteButton': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={api.getPhotoUrl(photo.fileName)}
                      alt={`Uploaded by ${photo.uploadedBy}`}
                      onClick={() => handlePhotoClick(photo)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <IconButton
                      className="deleteButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                      disabled={deleteLoading === photo.id}
                    >
                      {deleteLoading === photo.id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        padding: 1,
                        borderBottomLeftRadius: 1,
                        borderBottomRightRadius: 1,
                      }}
                    >
                      <Box sx={{ fontSize: '0.875rem' }}>{photo.uploadedBy}</Box>
                      <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {format(new Date(photo.uploadDate), 'dd.MM.yyyy HH:mm', { locale: tr })}
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* EA Kutucuğu */}
      <Tooltip 
        title={
          <Typography style={{ fontSize: '14px', padding: '8px' }}>
            Enes AKBULUT'tan ailesine ufak bir sanal albüm hediyesi.
          </Typography>
        }
        arrow
        placement="top"
      >
        <Paper
          sx={{
            position: 'fixed',
            left: 20,
            bottom: 20,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }
          }}
        >
          EA
        </Paper>
      </Tooltip>

      <Dialog
        open={!!selectedPhoto}
        onClose={handleCloseDialog}
        maxWidth="lg"
        PaperProps={{
          sx: {
            position: 'relative',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        {selectedPhoto && (
          <>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={api.getPhotoUrl(selectedPhoto.fileName)}
              alt={`Uploaded by ${selectedPhoto.uploadedBy}`}
              sx={{
                maxHeight: '90vh',
                maxWidth: '90vw',
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlbumPage; 