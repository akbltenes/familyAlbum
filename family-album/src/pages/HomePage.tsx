import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const HomePage: React.FC = () => {
  const albumId = 'ailealbumu';
  const baseUrl = 'http://172.20.10.2:3000'; // Update this with your IP address

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: { xs: 3, md: 6 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: '#1a237e',
              fontWeight: 800,
              textAlign: 'center',
              mb: 4,
              fontSize: { xs: '2rem', md: '3rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: '-0.5px'
            }}
          >
            Aile Albümümüz
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: 'center',
              color: '#555',
              mb: 4,
              maxWidth: '80%',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Sevdiklerinizle paylaştığınız anıları ölümsüzleştirin
          </Typography>

          <Box
            sx={{
              bgcolor: 'white',
              p: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              width: '100%',
              maxWidth: 400,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                mb: 3,
                textAlign: 'center',
                color: '#666',
                fontWeight: 500
              }}
            >
              Albüme erişmek için QR kodu okutun
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  zIndex: -1,
                  borderRadius: 2,
                  opacity: 0.5
                }
              }}
            >
              <QRCodeSVG
                value={`${baseUrl}/album/${albumId}`}
                size={250}
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: '#666',
                mt: 2,
                fontStyle: 'italic'
              }}
            >
              Telefonunuzun kamerasını QR koduna doğrultun
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 