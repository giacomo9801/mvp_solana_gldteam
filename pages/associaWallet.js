import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import wallet from "./wallet.json";
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const WalletAssociation = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [airdropInProgress, setAirdropInProgress] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true); // Stato per la verifica del login
  const router = useRouter();

  const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "finalized"
  );

  useEffect(() => {
    const verifylogin = sessionStorage.getItem("verifylogin");
    if (verifylogin !== "true") {
      router.push("/");
    } else {
      setIsVerifying(false); // Verifica completata
    }
  }, [router]);

  const handleAssociateWallet = async () => {
    try {
      setConnecting(true);
      // Connect to Phantom Wallet
      await window.solana.connect();
      // Get connected wallet address
      const connectedAddress = window.solana.publicKey.toString();
      setWalletAddress(connectedAddress);
      // Store the wallet address in session storage
      sessionStorage.setItem("wallet", connectedAddress);
      sessionStorage.setItem("verifywallet", "true");
      // Request airdrop
      await handleAirdrop(connectedAddress);
    } catch (error) {
      console.error("Errore nella connessione al wallet:", error);
      setConnecting(false);
    }
  };

  const handleAirdrop = async (wallet) => {
    try {
      setAirdropInProgress(true);

      const airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        5 * LAMPORTS_PER_SOL
      );
      console.log(
        `Airdrop OK! Transazione: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`
      );

      toast.info("Airdrop Ricevuto!");

      // Redirect to dashboard or another page after successful association and airdrop
      setTimeout(() => {
        router.push({
          pathname: "/subscriptionSelector",
          query: { walletAddress: wallet },
        });
      }, 2500); // Redirect after 2 seconds

      setAirdropInProgress(false);
    } catch (err) {
      console.error("Errore Airdrop:", err);
      setAirdropInProgress(false);
    }
  };

  // Mostra un caricamento fino al completamento della verifica
  if (isVerifying) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#333",
          color: "#fff",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundImage: "url(/solanawp.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        opacity: 0.9,
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card
          sx={{
            minWidth: 275,
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
            <Typography variant="h3" component="h1" gutterBottom>
              Associa il tuo Wallet
            </Typography>
            <Typography variant="h5" component="h1" gutterBottom>
              Collega il wallet e richiede automaticamente Solana
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="walletAddress"
              label="Indirizzo Wallet"
              name="walletAddress"
              autoComplete="wallet-address"
              autoFocus
              value={walletAddress}
              InputProps={{
                readOnly: true,
                style: { color: "white" },
              }}
              sx={{
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
              fullWidth
              variant="contained"
              color="primary"
              endIcon={<AccountBalanceWalletIcon />}
              onClick={handleAssociateWallet}
              disabled={connecting || airdropInProgress}
              sx={{
                mt: 2,
                color: connecting ? "white" : "inherit", // Imposta il colore del testo su bianco quando connecting è true
              }}
            >
              {connecting ? (
                <>
                  <span style={{ color: "white" }}>Connessione... </span>
                  <CircularProgress size={24} sx={{ ml: 2, color: "white" }} />
                </>
              ) : (
                "Associa Wallet"
              )}
            </Button>
          </CardContent>
        </Card>
      </Container>
      <ToastContainer />
    </Box>
  );
};

export default WalletAssociation;

// import React, { useState } from "react";
// import { useRouter } from "next/router";
// import {
//   Button,
//   TextField,
//   Card,
//   CardContent,
//   Typography,
//   Container,
//   Box,
// } from "@mui/material";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

// const WalletAssociation = () => {
//   const [walletAddress, setWalletAddress] = useState("");
//   const [connecting, setConnecting] = useState(false);
//   const router = useRouter();

//   const handleAssociateWallet = async () => {
//     try {
//       setConnecting(true);
//       // Connect to Phantom Wallet
//       await window.solana.connect();
//       // Get connected wallet address
//       const connectedAddress = window.solana.publicKey.toString();
//       setWalletAddress(connectedAddress);
//       // Redirect to dashboard or another page after successful association
//       sessionStorage.setItem("wallet", connectedAddress);
//       setTimeout(() => {
//         router.push({
//           // pathname: "/",
//           pathname: "/homepage",
//           query: { walletAddress: connectedAddress },
//         });
//       }, 2000); // Redirect after 2 seconds
//     } catch (error) {
//       console.error("Error connecting to wallet:", error);
//       setConnecting(false);
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
//         justifyContent: "center",
//         alignItems: "center",
//         overflow: "hidden",
//         backgroundImage: "url(/solanawp.png)",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         opacity: 0.9,
//       }}
//     >
//       <Container
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <Card
//           sx={{
//             minWidth: 275,
//             padding: 4,
//             backgroundColor: "rgba(5, 40, 76, 0.7)",
//             backdropFilter: "blur(10px)",
//             boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//             borderRadius: 10,
//             border: "1px solid rgba(255, 255, 255, 0.18)",
//             color: "white",
//             textAlign: "center",
//           }}
//         >
//           <CardContent>
//             <Typography variant="h4" component="h1" gutterBottom>
//               Associa il tuo Wallet
//             </Typography>
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               id="walletAddress"
//               label="Indirizzo Wallet"
//               name="walletAddress"
//               autoComplete="wallet-address"
//               autoFocus
//               value={walletAddress}
//               InputProps={{
//                 readOnly: true,
//                 style: { color: "white" },
//               }}
//               sx={{
//                 label: { color: "white" },
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "white",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "white",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "white",
//                   },
//                 },
//               }}
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               endIcon={<AccountBalanceWalletIcon />}
//               onClick={handleAssociateWallet}
//               disabled={connecting}
//               sx={{ mt: 2 }}
//             >
//               {connecting ? "Connecting..." : "Associa Wallet"}
//             </Button>
//           </CardContent>
//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default WalletAssociation;
