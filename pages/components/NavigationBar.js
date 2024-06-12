import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Home, Visibility, LockOpen } from "@mui/icons-material";
import { useRouter } from "next/router";
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// Definisce l'animazione di rimbalzo più lenta e meno marcata
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-2.5px);
  }
`;

// Crea un bottone con lo stile di rimbalzo
const BounceButton = styled(Button)`
  color: white;
  font-weight: bold;
  margin: 0 16px;
  transition: color 0.3s ease-in-out;
  &:hover {
    color: #17162A; // Colore al passaggio del mouse
    text-decoration: underline;
    animation: ${bounce} 1s;
  }
`;

function NavigationBar() {
  const router = useRouter();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(20px)",
        borderRadius: 2,
        padding: 1,
      }}
    >
      <Toolbar>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <BounceButton
            onClick={() => router.push("/homepage")}
            startIcon={<Home />}
          >
            Homepage
          </BounceButton>
          <BounceButton
            onClick={() => router.push("/view-documents")}
            startIcon={<Visibility />}
          >
            Visualizza Documenti
          </BounceButton>
          <BounceButton
            onClick={() => router.push("/decrypt-documents")}
            startIcon={<LockOpen />}
          >
            Decripta Documenti
          </BounceButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
