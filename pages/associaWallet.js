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
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const WalletAssociation = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  const handleAssociateWallet = async () => {
    try {
      setConnecting(true);
      // Connect to Phantom Wallet
      await window.solana.connect();
      // Get connected wallet address
      const connectedAddress = window.solana.publicKey.toString();
      setWalletAddress(connectedAddress);
      // Redirect to dashboard or another page after successful association
      sessionStorage.setItem("wallet", connectedAddress);
      setTimeout(() => {
        router.push({
          pathname: "/",
          query: { walletAddress: connectedAddress },
        });
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setConnecting(false);
    }
  };

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
        backgroundImage: 'url(/backgroundsolana.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
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
            <Typography variant="h4" component="h1" gutterBottom>
              Associa il tuo Wallet
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
              disabled={connecting}
              sx={{ mt: 2 }}
            >
              {connecting ? "Connecting..." : "Associa Wallet"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default WalletAssociation;
