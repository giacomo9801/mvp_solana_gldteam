import React from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { PrivacyTip, Search } from "@mui/icons-material";
import NavigationBar from "./components/NavigationBar";

const App = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  //const storedMail = sessionStorage.getItem('email');
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        backgroundImage: 'url(/backgroundsolana.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
      }}
    >
      <header>
        <Typography variant="h2" align="center" gutterBottom marginTop={5}>
          Benvenuto nella tua Dashboard
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Ciao {"tizio"} 👋
        </Typography>
      </header>
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            // left: "30%",
            right: "70%",
            transform: "translateY(-50%) scaleX(-1)",
            zIndex: -1,
          }}
        >
          <img src="/robot.png" alt="Robot" style={{ width: "300px", height: "auto" }} />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Card
            sx={{
              minWidth: 275,
              margin: 2,
              padding: 2,
              backgroundColor: "rgba(5, 40, 76, 0.7)", // Background glass effect
              backdropFilter: "blur(10px)", // Blur effect
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)", // Border for glass effect
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
              >
                Carica i tuoi documenti
              </Typography>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={() => router.push("/upload-documents")}
                sx={{ mt: 2 }}
              >
                Carica
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              minWidth: 275,
              margin: 2,
              padding: 2,
              backgroundColor: "rgba(5, 40, 76, 0.7)", // Background glass effect
              backdropFilter: "blur(10px)", // Blur effect
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)", // Border for glass effect
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
              >
                Visualizza tutti i tuoi documenti
              </Typography>
              <Button
                variant="contained"
                color="primary"
                endIcon={<Search />}
                onClick={() => router.push("/view-documents")}
                sx={{ mt: 2 }}
              >
                Visualizza
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              minWidth: 275,
              margin: 2,
              padding: 2,
              backgroundColor: "rgba(5, 40, 76, 0.7)", // Background glass effect
              backdropFilter: "blur(10px)", // Blur effect
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)", // Border for glass effect
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
              >
                Decripta i tuoi documenti
              </Typography>
              <Button
                variant="contained"
                color="primary"
                endIcon={<PrivacyTip />}
                onClick={() => router.push("/decrypt-documents")}
                sx={{ mt: 2 }}
              >
                Decripta
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <footer>
        <Typography variant="body2" align="center" gutterBottom>
          &copy; {currentYear} GLD Team. Tutti i diritti riservati. MVP -
          MasterZ x Solana
        </Typography>
      </footer>
    </Box>
  );
};

export default App;

//Con password in decript 
// import React from "react";
// import { useRouter } from "next/router";
// import {
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Container,
//   Box,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import { PrivacyTip, Search } from "@mui/icons-material";
// import { useState } from "react";

// const App = () => {
//   const router = useRouter();
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const currentYear = new Date().getFullYear();

//   const handleDecryptClick = () => {
//     // Mostra un prompt per inserire la password
//     const enteredPassword = prompt(
//       "Inserisci la password per accedere alla sezione Decripta:"
//     );
//     // Verifica se la password inserita è corretta
//     if (enteredPassword === "segreto") {
//       // Sostituisci "LaTuaPasswordSegreta" con la tua password reale
//       // Reindirizza l'utente alla pagina "Decripta"
//       router.push("/decrypt-documents");
//     } else {
//       setError("Password errata. Riprova.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#333",
//         color: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         overflow: "hidden",
//         backgroundImage: "url(/backgroundsolana.png)",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         opacity: 0.9,
//       }}
//     >
//       <header>
//         <Typography variant="h2" align="center" gutterBottom>
//           Benvenuto nella tua Dashboard
//         </Typography>
//         <Typography variant="h6" align="center" gutterBottom>
//           Ciao tizio loggato 👋
//         </Typography>
//       </header>
//       <Container
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "40%",
//             // left: "30%",
//             right: "70%",
//             transform: "translateY(-50%) scaleX(-1)",
//             zIndex: -1,
//           }}
//         >
//           <img
//             src="/robot.png"
//             alt="Robot"
//             style={{ width: "300px", height: "auto" }}
//           />
//         </Box>
//         <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
//           <Card
//             sx={{
//               minWidth: 275,
//               margin: 2,
//               padding: 2,
//               backgroundColor: "rgba(5, 40, 76, 0.7)", // Background glass effect
//               backdropFilter: "blur(10px)", // Blur effect
//               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
//               borderRadius: 10,
//               border: "1px solid rgba(255, 255, 255, 0.18)", // Border for glass effect
//               color: "white",
//               textAlign: "center",
//             }}
//           >
//             <CardContent
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 component="h2"
//                 align="center"
//                 gutterBottom
//               >
//                 Carica i tuoi documenti
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 endIcon={<SendIcon />}
//                 onClick={() => router.push("/upload-documents")}
//                 sx={{ mt: 2 }}
//               >
//                 Carica
//               </Button>
//             </CardContent>
//           </Card>
//           <Card
//             sx={{
//               minWidth: 275,
//               margin: 2,
//               padding: 2,
//               backgroundColor: "rgba(5, 40, 76, 0.7)", // Background glass effect
//               backdropFilter: "blur(10px)", // Blur effect
//               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
//               borderRadius: 10,
//               border: "1px solid rgba(255, 255, 255, 0.18)", // Border for glass effect
//               color: "white",
//               textAlign: "center",
//             }}
//           >
//             <CardContent
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 component="h2"
//                 align="center"
//                 gutterBottom
//               >
//                 Visualizza tutti i tuoi documenti
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 endIcon={<Search />}
//                 onClick={() => router.push("/view-documents")}
//                 sx={{ mt: 2 }}
//               >
//                 Visualizza
//               </Button>
//             </CardContent>
//           </Card>
//           <Card
//             sx={{
//               minWidth: 275,
//               margin: 2,
//               padding: 2,
//               backgroundColor: "rgba(5, 40, 76, 0.7)", // Background glass effect
//               backdropFilter: "blur(10px)", // Blur effect
//               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow for depth
//               borderRadius: 10,
//               border: "1px solid rgba(255, 255, 255, 0.18)", // Border for glass effect
//               color: "white",
//               textAlign: "center",
//             }}
//           >
//             <CardContent
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 component="h2"
//                 align="center"
//                 gutterBottom
//               >
//                 Decripta i tuoi documenti
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 endIcon={<PrivacyTip />}
//                 onClick={handleDecryptClick}
//                 sx={{ mt: 2 }}
//               >
//                 Decripta
//               </Button>
//               {error && (
//                 <Typography variant="body2" color="error" sx={{ mt: 2 }}>
//                   {error}
//                 </Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Box>
//       </Container>
//       <footer>
//         <Typography variant="body2" align="center" gutterBottom>
//           &copy; {currentYear} GLD Team. Tutti i diritti riservati. MVP -
//           MasterZ x Solana
//         </Typography>
//       </footer>
//     </Box>
//   );
// };

// export default App;