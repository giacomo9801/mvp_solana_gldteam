import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { useRouter } from "next/router";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import {
  IconButton,
  Typography,
  Container,
  Box,
  Button,
  CssBaseline,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import "aos/dist/aos.css";
import AOS from "aos";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          "&:hover": {
            boxShadow: "white 0px 0px 10px 0px",
            transform: "scale(1.04)",
          },
        },
      },
    },
  },
});

const teamMembers = [
  {
    name: "Giacomo Corcella",
    role: "CEO (Chief Executive Officer)",
    image: "./giacomo.jpeg",
    description: "Esperto Blockchain e Full Stack. Dev in EY",
    linkedin: "https://www.linkedin.com/in/giacomocorcella/",
    email: "giacomocorcella17@gmail.com",
  },
  {
    name: "Davide Porcelluzzi",
    role: "CTO (Chief Technology Officer)",
    image: "./davide.jpg",
    description: "Esperto Java e Full Stack. Dev in EY.",
    linkedin: "https://www.linkedin.com/in/davide-porcelluzzi-969b66171/",
    email: "Davide.por15@gmail.com",
  },
  {
    name: "Luigi Cafagna",
    role: "CIO (Chief Information Officer)",
    image: "./luigi.jpg",
    description: "Esperto Back-End. Dev in Accenture.",
    linkedin: "https://www.linkedin.com/in/luigicafagna/",
    email: "luigi.cafagna01@gmail.com",
  },
];

const LoginSection = ({
  handleLogin,
  handleSpidLogin,
  email,
  setEmail,
  password,
  setPassword,
  errorMessage,
  isLoading,
}) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap={4}
    sx={{ mt: 4, width: "100%" }}
  >
    <Card
      sx={{
        flex: 1,
        margin: 2,
        padding: 4,
        backgroundColor: "rgba(5, 40, 76, 0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        borderRadius: 10,
        border: "1px solid rgba(255, 255, 255, 0.18)",
        color: "white",
        textAlign: "center",
        marginInline: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
        marginBottom: { xs: 4, sm: 6, md: 8, lg: 10, xl: 12 },
        maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" }, // aggiunta per ridurre la larghezza su schermi grandi
        position: "relative", // rende possibile posizionare l'icona in modo assoluto
      }}
      data-aos="fade-up"
    >
      <Box position="absolute" top={20} right={10} p={2}>
        <Tooltip
          title={
            "Per questo test utilizza le seguenti credenziali:" +
            "\nEmail: gld@gmail.com" +
            "\nPassword: Test\n"
          }
        >
          <InfoOutlinedIcon fontSize="small" />
        </Tooltip>
      </Box>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Login con Email e Password
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ color: "error.main" }}
        >
          {errorMessage}
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          placeholder="Inserisci la tua email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
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
          placeholder="Inserisci la tua password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
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
          disabled={isLoading}
        >
          {isLoading ? "Login in corso..." : "Accedi"}
        </Button>
        <Divider style={{ marginBlock: 10 }}>O</Divider>
        <Typography variant="h5" component="h2" gutterBottom>
          Login con SPID
        </Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{
            backgroundColor: "yellow",
            color: "black",
            fontWeight: "bold",
            borderRadius: 1,
            padding: 1,
            marginBottom: 2,
            marginInline: 2,
          }}
        >
          Work in progress...
        </Typography>
        <Button
          disabled
          variant="contained"
          color="primary"
          endIcon={<AccountCircleIcon />}
          onClick={handleSpidLogin}
          sx={{ mt: 1 }}
        >
          Accedi con SPID
        </Button>
      </CardContent>
    </Card>
  </Box>
);

const Homepage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleLogin = () => {
    console.log("handleLogin chiamato");
    setIsLoading(true);
    setErrorMessage(null); // Resetta il messaggio di errore
    setTimeout(() => {
      if (email === "gld@gmail.com" && password === "Test") {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("verifylogin", "true");
        console.log(
          "Valore di verifylogin in index: ",
          sessionStorage.getItem("verifylogin")
        );
        router.push("/associaWallet");
      } else {
        setErrorMessage("Email o password non validi. Riprova.");
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleSpidLogin = () => {
    router.push("/spid-login");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <main>
        <Box
          sx={{
            backgroundImage: `url('/solanawp.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
          }}
          data-aos="fade"
        >
          <Container maxWidth="md" sx={{}}>
            <Box textAlign="center" sx={{}}>
              <Typography variant="h2" component="h1" gutterBottom>
                <span style={{ fontWeight: "bold" }}>
                  Notarize DOC/NFT - MVP
                </span>
              </Typography>
              <Typography variant="h2" component="h1" gutterBottom>
                <span style={{ fontWeight: "bold" }}>S</span>
                <img
                  src="./solanaicon2.png"
                  alt="Solana"
                  style={{
                    verticalAlign: "middle",
                    height: "1.0em",
                    marginLeft: "-0.2em",
                    borderRadius: "100%",
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                />
                <span style={{ marginLeft: "-0.2em", fontWeight: "bold" }}>
                  LANA
                </span>
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom>
                Soluzione Blockchain sviluppata dal{"  "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    color: "yellow",
                  }}
                >
                  "GLD Team"
                </span>{" "}
                per la notarizzazione di documenti in forma criptata su
                Blockchain Solana.
              </Typography>
            </Box>
          </Container>

          <Container maxWidth="md" sx={{ mt: 8, mb: 6 }} data-aos="fade">
            <Typography variant="h4" component="h2" gutterBottom>
              Punti Fondamentali del Progetto
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    backgroundColor: "rgba(5, 40, 76, 0.7)",
                    color: "white",
                    borderRadius: 5,
                  }}
                  data-aos="fade-right"
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image="./digitalize.png"
                    alt="Img digitalizzazione"
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Digitalizzazione
                    </Typography>
                    <Typography variant="body2" color="white">
                      Digitalizza i tuoi documenti e trasformali in NFT per
                      garantire la loro autenticità
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    backgroundColor: "rgba(5, 40, 76, 0.7)",
                    color: "white",
                    borderRadius: 5,
                  }}
                  data-aos="fade-left"
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image="./cost.png"
                    alt="Img costi ridotti"
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Costi ridotti
                    </Typography>
                    <Typography variant="body2" color="white">
                      Riduci i costi di notarizzazione e garantisce la sicurezza
                      dei tuoi documenti
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    backgroundColor: "rgba(5, 40, 76, 0.7)",
                    color: "white",
                    borderRadius: 5,
                  }}
                  data-aos="fade-right"
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image="./delete.png"
                    alt="Img perdita dati"
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Prevenzione perdita dati
                    </Typography>
                    <Typography variant="body2" color="white">
                      Preveniamo la cancellazione/modifica accidentale dei tuoi
                      documenti grazie alla tecnologia blockchain
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    backgroundColor: "rgba(5, 40, 76, 0.7)",
                    color: "white",
                    borderRadius: 5,
                  }}
                  data-aos="fade-left"
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image="./notarize.png"
                    alt="Scalabilità"
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Certificazione
                    </Typography>
                    <Typography variant="body2" color="white">
                      Certifichiamo i tuoi documenti in modo sicuro e semplice
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth="md" sx={{ mt: 8, mb: 6 }} data-aos="fade">
            <Typography variant="h4" component="h2" gutterBottom>
              Il Nostro Team
            </Typography>
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card data-aos="fade-up" sx={{ borderRadius: 7 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={member.image}
                      alt={member.name}
                      sx={{
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.description}
                      </Typography>
                      <Box display="flex" justifyContent="center" mt={2}>
                        <IconButton
                          aria-label="LinkedIn"
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedInIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Email"
                          href={`mailto:${member.email}`}
                        >
                          <EmailIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <br />
            <br />
            <Typography variant="h5" gutterBottom>
              Documenti caricati attualmente:
            </Typography>
            <Typography
              variant="h4"
              component="span"
              sx={{ fontWeight: "bold" }}
              data-aos="fade"
            >
              <CountUp
                end={32673489}
                duration={12}
                separator=","
                prefix="📄"
                delay={1}
              />
            </Typography>
          </Container>
          <LoginSection
            handleLogin={handleLogin}
            handleSpidLogin={handleSpidLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            errorMessage={errorMessage}
            isLoading={isLoading} // Assicurati che isLoading venga passato correttamente
            data-aos="fade"
          />
        </Box>
      </main>
      <Box
        component="footer"
        sx={{
          py: 6,
          mt: "auto",
          backgroundColor: (theme) => theme.palette.grey[900],
        }}
        data-aos="fade"
      >
        <Container maxWidth="md">
          <Typography variant="body2" align="center" gutterBottom>
            &copy; {currentYear} GLD Team. Tutti i diritti riservati. MVP -
            MasterZ x Solana
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Homepage;
