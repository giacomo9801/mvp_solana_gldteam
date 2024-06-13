import React, { useEffect, useState } from "react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { PrivacyTip, Search } from "@mui/icons-material";
import axios from "axios";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchAllDigitalAssetByOwner,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "./wallet.json"; // Assicurati che il percorso sia corretto

const fetchDocuments = async (walletAddress) => {
  try {
    const connectionUrl = "https://api.devnet.solana.com";
    const commitment = "finalized";
    const umi = createUmi(connectionUrl, commitment);
    umi.use(mplTokenMetadata());

    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(wallet)
    );
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));

    const assets = await fetchAllDigitalAssetByOwner(umi, walletAddress);
    console.log("Assets:", assets);

    const documentsData = await Promise.all(
      assets.map(async (asset) => {
        const metadataUri = asset.metadata.uri;
        const res = await axios.get(metadataUri);
        console.log("Metadata URI:", metadataUri);
        return res.data;
      })
    );

    return documentsData;
  } catch (err) {
    console.error("Error fetching documents:", err);
    return [];
  }
};

const App = () => {
  const router = useRouter();
  const { walletAddress } = router.query;
  const currentYear = new Date().getFullYear();
  const todayDate = new Date().toLocaleDateString();

  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState(walletAddress || "0x123456789");
  const [uploadedDocuments, setUploadedDocuments] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(true); // Nuovo stato per il caricamento della verifica
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const verifylogin = sessionStorage.getItem("verifylogin") === "true";
    const verifywallet = sessionStorage.getItem("verifywallet") === "true";
    const verifySubscription =
      sessionStorage.getItem("verifySubscription") === "true";

    if (!verifylogin || !verifywallet || !verifySubscription) {
      router.push("/");
    } else {
      setLoadingVerify(false); // Impostiamo loadingVerify a false quando tutte le verifiche sono soddisfatte
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(sessionStorage.getItem("email") || "emailnotfound@gmail.com");
      setWallet(
        sessionStorage.getItem("wallet") || walletAddress || "0x123456789"
      );
      setSubscriptionPlan(
        sessionStorage.getItem("subscriptionPlan") || "NoSubscriptionsFound"
      );
    }
  }, [walletAddress]);

  useEffect(() => {
    const fetchAndSetDocuments = async () => {
      try {
        setLoading(true);
        const documents = await fetchDocuments(wallet);
        setUploadedDocuments(documents.length);
      } catch (err) {
        setError("Error fetching documents: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      fetchAndSetDocuments();
    }
  }, [wallet]);

  useEffect(() => {
    const getBalance = async () => {
      try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const publicKey = new PublicKey(wallet);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    if (wallet) {
      getBalance();
    }
  }, [wallet]);

  const getSubscriptionEmoji = (subscriptionPlan) => {
    switch (subscriptionPlan) {
      case "basic":
        return "🥉";
      case "standard":
        return "🥈";
      case "premium":
        return "🥇";
      default:
        return "";
    }
  };

  if (loadingVerify) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
        justifyContent: "space-between",
        overflow: "hidden",
        backgroundImage: "url(/solanawp.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        opacity: 0.9,
        position: "relative",
      }}
    >
      <header>
        <Typography variant="h2" align="center" gutterBottom marginTop={5}>
          Dashboard
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Ciao {email} 👋
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
            right: "70%",
            transform: "translateY(-50%) scaleX(-1)",
            zIndex: -1,
          }}
        >
          <img
            src="/robot.png"
            alt="Robot"
            style={{ width: "300px", height: "auto" }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Card
            sx={{
              minWidth: 275,
              margin: 2,
              padding: 2,
              backgroundColor: "rgba(5, 40, 76, 0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
              backgroundColor: "rgba(5, 40, 76, 0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
              backgroundColor: "rgba(5, 40, 76, 0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 2,
          borderRadius: 5,
          color: "white",
        }}
      >
        <Typography variant="body2">
          <strong>Email:</strong> {email} ✉️
        </Typography>
        <Typography variant="body2">
          <strong>Wallet:</strong> {wallet} 🔑
        </Typography>
        <Typography variant="body2">
          <strong>Documenti caricati:</strong>{" "}
          {loading ? <CircularProgress size={16} /> : uploadedDocuments} 📄
        </Typography>
        <Typography variant="body2">
          <strong>Abbonamento:</strong> {subscriptionPlan}{" "}
          {getSubscriptionEmoji(subscriptionPlan)}
        </Typography>
        <Typography variant="body2">
          <strong>Saldo:</strong> {balance} SOL 💰
        </Typography>
        <Typography variant="body2">
          <strong>Data odierna:</strong> {todayDate} 🗓️
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Box>
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
