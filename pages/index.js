import React from 'react';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, Typography, Container, Box } from '@mui/material';

const App = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <header>
        <Typography variant="h2" align="center" gutterBottom>
          Benvenuto nella tua Dashboard
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Ciao tizio loggato
        </Typography>
      </header>
      <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Card
            sx={{
              margin: 2,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Carica i tuoi documenti
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/upload-documents')}
              >
                Vai alla pagina
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              margin: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Visualizza tutti i tuoi documenti
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/view-documents')}
              >
                Vai alla pagina
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              margin: 2,
              background: 'linear-gradient(45deg, #66BB6A 30%, #B2FF59 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Decripta i tuoi documenti
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/decrypt-documents')}
              >
                Vai alla pagina
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <footer>
        <Typography variant="body2" align="center" gutterBottom>
        &copy; {currentYear} GLD Team. Tutti i diritti riservati.
        MVP - MasterZ x Solana
        </Typography>
      </footer>
    </Box>
  );
};

export default App;
