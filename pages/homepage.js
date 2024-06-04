import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar, Avatar,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { CheckCircleOutline } from "@mui/icons-material";


function LockIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size}
      height={props.size}
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 17a3 3 0 0 0 3-3v-1h2v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5v-1h2v1a3 3 0 0 0 3 3zm3-8V6a3 3 0 0 0-6 0v3h-2V6a5 5 0 0 1 10 0v3h-2zM9 5V4a3 3 0 0 1 6 0v1h2v1H7V5h2z" />
    </svg>
  );
}

const ObjectivesSection = () => {
	  return (
	    <Box sx={{ backgroundColor: "#00000059", borderRadius:"50px", padding: 6 }}>
	      <Container sx={{ marginBottom: 20, marginTop: 20 }}>
	        <div style={{ display: 'flex', alignItems: 'center' }}>
			    {/* Immagine a sinistra */}
			    <img 
			    	src="/privacy-icon.png" 
			    	alt="Immagine" 
			    	style={{ 
						marginRight: '20px',
						width: '300px',
			    	}} 
			    />
			
			    {/* Testo */}
			    <div>
			      <Typography variant="h4" align="center" gutterBottom>
			        
			      </Typography>
			      <Typography variant="h3" align="left">
			        Digitalizziamo i tuoi documenti su Blockchain in maniera privata
			      </Typography>
			    </div>
			  </div>
	      </Container>
	      <Container sx={{ marginBottom: 20, marginTop: 20 }}>
	        <div style={{ display: 'flex', alignItems: 'center' }}>
			    {/* Testo */}
			    <div>
			      <Typography variant="h4" align="center" gutterBottom>
			        
			      </Typography>
			      <Typography variant="h3" align="left">
			        Diminuizione dei costi di storage
			      </Typography>
			    </div>
			    {/* Immagine a destra */}
			    <img 
			    	src="/price.png" 
			    	alt="Immagine" 
			    	style={{ 
						marginRight: '20px',
						width: '300px',
			    	}} 
			    />
			
			  </div>
	      </Container>
	      <Container sx={{ marginBottom: 20, marginTop: 20 }}>
	        <div style={{ display: 'flex', alignItems: 'center' }}>
			    {/* Immagine a sinistra */}
			    <svg
			      xmlns="http://www.w3.org/2000/svg"
			      viewBox="0 0 28 28"
			      width='300px'
			      height='300px'
			      fill="#FFFFFF"
			    >
			      <path d="M16,0c-2.21094,0 -4.12109,0.91797 -5.3125,2.40625c-1.19141,1.48828 -1.6875,3.41797 -1.6875,5.5v1.09375h3v-1.09375c0,-1.57812 0.39063,-2.82031 1.03125,-3.625c0.64063,-0.80469 1.51172,-1.28125 2.96875,-1.28125c1.46094,0 2.32813,0.44922 2.96875,1.25c0.64063,0.80078 1.03125,2.05859 1.03125,3.65625v1.09375h3v-1.09375c0,-2.09375 -0.52734,-4.04297 -1.71875,-5.53125c-1.19141,-1.48828 -3.07422,-2.375 -5.28125,-2.375zM9,10c-1.65625,0 -3,1.34375 -3,3v10c0,1.65625 1.34375,3 3,3h14c1.65625,0 3,-1.34375 3,-3v-10c0,-1.65625 -1.34375,-3 -3,-3zM16,15c1.10547,0 2,0.89453 2,2c0,0.73828 -0.40234,1.37109 -1,1.71875v2.28125c0,0.55078 -0.44922,1 -1,1c-0.55078,0 -1,-0.44922 -1,-1v-2.28125c-0.59766,-0.34766 -1,-0.98047 -1,-1.71875c0,-1.10547 0.89453,-2 2,-2z"></path>
				</svg>
			
			    {/* Testo */}
			    <div>
			      <Typography variant="h4" align="center" gutterBottom>
			        
			      </Typography>
			      <Typography variant="h3" align="left">
					Previeni cancellazioni e/o modifiche ai file
			      </Typography>
			    </div>
			  </div>
	      </Container>
	      <Container sx={{ marginBottom: 20, marginTop: 20 }}>
	        <div style={{ display: 'flex', alignItems: 'center' }}>
			    {/* Testo */}
			    <div>
			      <Typography variant="h4" align="center" gutterBottom>
			        
			      </Typography>
			      <Typography variant="h3" align="left">
			        Certifichiamo l’identità dei soggetti coinvolti
			      </Typography>
			    </div>
			    {/* Immagine a destra */}
			    <img 
			    	src="/identity.png" 
			    	alt="Immagine" 
			    	style={{ 
						marginRight: '20px',
						width: '300px',
						borderRadius: '30px',
			    	}} 
			    />
			
			  </div>
	      </Container>
	    </Box>
	    
	  );
	};
	
	
const HomePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = () => {
    if (email === "gdl@gmail.com" && password === "Ciao") {
      setErrorMessage(null);
      sessionStorage.setItem('email', email);
      router.push("/associaWallet");
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

	const handleSpidLogin = () => {
    // Implement your SPID login logic here
    router.push("/spid-login"); // Redirect to SPID login page
  };
  



  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundImage: 'url(/backgroundsolana.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
      }}
    >
      <header>
        <Typography variant="h1" align="center" marginTop="60px" gutterBottom>
          NOTARIZE DOC/NFT
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
			MVP SOLANA PROJECT
        </Typography>
      </header>
      <Container sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        
        <ObjectivesSection /> {/* Integra il componente ObjectivesSection */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={4} sx={{ mt: 4, width: "100%" }}>
          <Card
            sx={{
              flex: 1,
              margin: 2,
              marginBottom: 40,
              padding: 4,
              backgroundColor: "rgba(5, 40, 76, 0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Login con SPID
              </Typography>
              <Button
                variant="contained"
                color="primary"
                endIcon={<AccountCircleIcon />}
                onClick={handleSpidLogin}
                sx={{ mt: 2 }}
              >
                Accedi con SPID
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: 1,
              margin: 2,
              marginBottom: 40,
              padding: 4,
              backgroundColor: "rgba(5, 40, 76, 0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Login con Email e Password
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom sx={{color: "error.main"}}>
                {errorMessage}
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  input: { color: "white" },
                  label: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  input: { color: "white" },
                  label: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                endIcon={<LockOpenIcon />}
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Accedi
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <footer>
        <Typography variant="body2" align="center" gutterBottom>
          &copy; {new Date().getFullYear()} GLD Team. Tutti i diritti riservati. MVP - MasterZ x Solana
        </Typography>
      </footer>
    </Box>
  );
};

export default HomePage;
