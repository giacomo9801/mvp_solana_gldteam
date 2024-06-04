
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { DriveFileRenameOutline, Home, SimCardDownload } from "@mui/icons-material";
import { useRouter } from "next/router";

function NavigationBar() {
    const router = useRouter();

    return (
        <Container>
            <Box
                px={{ xs: 5, sm:  5, lg: 5 }}
                my={2}
                mx={3}
                width={"85%"}
                borderRadius={25}
                shadow={"md"}
                color={"black"}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                left={0}
                zIndex={3}
                sx={() => ({
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: `saturate(200%) blur(30px)`,
                    flexDirection: 'row',
                    display: 'flex'
                })}
            >
                <Typography variant="h6" gutterBottom style={{marginBlock: 20}}>
                    Notarize Doc
                </Typography>
                <Box>
                    <Button
                        onClick={() => router.push("/")}
                        variant="text"
                        color="primary"
                        startIcon={<Home/>}
                    >
                        Home
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => router.push("/upload-documents")}
                        startIcon={<DriveFileRenameOutline/>}
                    >
                        Notarize
                    </Button>
                </Box>
            </Box>
        </Container>
  );




};

export default NavigationBar;