// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { Typography } from "@mui/material";
// import CryptoJS from "crypto-js";

// const DecryptDocuments = () => {
//   const router = useRouter();
//   const [decryptedMetadata, setDecryptedMetadata] = useState(null);

//   useEffect(() => {
//     // Simulazione di dati dei metadati criptati
//     const encryptedMetadata = {
//       // Nome: "NFTGLD",
//       Oggetto: "U2FsdGVkX1/5uKTdn6WOPtN4I6IEnqq0zheGA/xTkdQ=",
//       Data: "U2FsdGVkX1/mQerWtfTHMi9Ki+cQe3LXQv+dwGdXyKs=",
//       Descrizione: "U2FsdGVkX1/LmmpYgrXJrw+fTgdEh+GU5grr/DBGuz8=",
//       Titolo: "U2FsdGVkX19rthDpVpG/cqsLNQygf6d37zXXDKofasc="

//       // Aggiungi altri campi dei metadati criptati qui...
//     };

//     // Funzione per decriptare un valore specifico
//     const decryptValue = (encryptedValue, encryptionKey) => {
//       const bytes = CryptoJS.AES.decrypt(encryptedValue, encryptionKey);
//       const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
//       return decryptedValue;
//     };

//     // Decriptazione dei metadati
//     const decryptionKey = "static-encryption-key"; // Chiave di decriptazione statica
//     const decrypted = {};
//     for (const key in encryptedMetadata) {
//       if (Object.hasOwnProperty.call(encryptedMetadata, key)) {
//         decrypted[key] = decryptValue(encryptedMetadata[key], decryptionKey);
//       }
//     }

//     setDecryptedMetadata(decrypted);
//   }, []);

//   return (
//     <div>
//       <Typography variant="h4">Decrypted Metadata</Typography>
//       {decryptedMetadata && (
//         <div>
//           {/* <Typography variant="h6">Nome: {decryptedMetadata.Nome}</Typography> */}
//           <Typography variant="body1">Descrizione: {decryptedMetadata.Oggetto}</Typography>
//           <Typography variant="body1">Descrizione: {decryptedMetadata.Titolo}</Typography>
//           <Typography variant="body1">Descrizione: {decryptedMetadata.Descrizione}</Typography>
//           <Typography variant="body1">Data: {decryptedMetadata.Data}</Typography>
//           {/* Aggiungi altre visualizzazioni dei metadati decriptati qui... */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DecryptDocuments;

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   CircularProgress,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   TextField,
//   Modal,
//   Backdrop,
//   Fade,
// } from "@mui/material";
// import axios from "axios";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import {
//   fetchAllDigitalAssetByOwner,
//   mplTokenMetadata,
// } from "@metaplex-foundation/mpl-token-metadata";
// import {
//   createSignerFromKeypair,
//   signerIdentity,
// } from "@metaplex-foundation/umi";
// import CryptoJS from "crypto-js";
// import wallet from "./wallet.json";

// const DecryptDocuments = () => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showPasswordInput, setShowPasswordInput] = useState(false);
//   const [decryptedData, setDecryptedData] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const connectionUrl = "https://api.devnet.solana.com";
//         const commitment = "finalized";
//         const umi = createUmi(connectionUrl, commitment);
//         umi.use(mplTokenMetadata());

//         const keypair = umi.eddsa.createKeypairFromSecretKey(
//           new Uint8Array(wallet)
//         );
//         const myKeypairSigner = createSignerFromKeypair(umi, keypair);
//         umi.use(signerIdentity(myKeypairSigner));

//         const ownerPublicKey = "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"; // Replace with your public key
//         const assets = await fetchAllDigitalAssetByOwner(umi, ownerPublicKey);

//         const documentsData = await Promise.all(
//           assets.map(async (asset) => {
//             const metadataUri = asset.metadata.uri;
//             const res = await axios.get(metadataUri);
//             return { ...asset, ...res.data }; // Combine asset and metadata data
//           })
//         );

//         setDocuments(documentsData);
//       } catch (err) {
//         setError("Error fetching documents: " + err.message);
//         console.error("Error fetching documents:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocuments();
//   }, []);

//   const handleDecryptButtonClick = (document) => {
//     setSelectedDocument(document);
//     setShowPasswordInput(true);
//   };

//   const handlePasswordInputClose = () => {
//     setShowPasswordInput(false);
//     setSelectedDocument(null);
//     setDecryptedData("");
//   };

//   const decryptValue = (encryptedData, password) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedData, password);
//       const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//       return decryptedData;
//     } catch (error) {
//       console.error("Errore di decrittazione:", error);
//       throw error;
//     }
//   };

//   const handlePasswordInputSubmit = async () => {
//     if (password === "static-encryption-key") {
//       try {
//         const decryptedData = decryptValue(
//           selectedDocument.encryptedData,
//           password
//         );
//         const { oggetto, data, descrizione, titolo } = decryptedData;
//         // Utilizza i valori decriptati qui
//       } catch (error) {
//         console.error("Errore di decrittazione:", error);
//         // Handle decryption errors gracefully (e.g., display an error message)
//       }
//     } else {
//       alert("Password errata. Riprova.");
//     }
//   };

//   const handleDownloadPdfButtonClick = (document) => {
//     if (!document.pdfUrl || !document.fileName) {
//       console.warn("Document does not contain PDF URL or filename.");
//       return;
//     }

//     // Download the PDF using a suitable method (e.g., window.open, download library)
//     window.open(document.pdfUrl, "_blank"); // Open PDF in a new tab
//   };

//   return (
//     <Container>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography variant="body1" color="error">
//           {error}
//         </Typography>
//       ) : (
//         <Grid container spacing={2}>
//           {documents.map((document) => (
//   <Grid item xs={6} md={4} key={document.id || document.name}>
//     <Card>
//       {document.image && (
//         <CardMedia
//           component="img"
//           height="140"
//           image={document.image}
//           alt={document.name}
//         />
//       )}
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           {document.name}
//         </Typography>
//         <Typography variant="body1" gutterBottom>
//           {document.description}
//         </Typography>
//         <Typography variant="body1" gutterBottom>
//           {document.attributes.map((attr, index) => (
//             <span key={index}>
//               <strong>{attr.trait_type}:</strong> {attr.value}
//               {index < document.attributes.length - 1 && ', '}
//             </span>
//           ))}
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleDecryptButtonClick(document)}
//         >
//           Decripta
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleDownloadPdfButtonClick(document)}
//         >
//           Download PDF
//         </Button>
//       </CardContent>
//     </Card>
//   </Grid>
// ))}
//         </Grid>
//       )}

//       {/* Password Input Modal */}
//       <Modal
//         open={showPasswordInput}
//         onClose={handlePasswordInputClose}
//         aria-labelledby="password-input-modal-title"
//         aria-describedby="password-input-modal-description"
//       >
//         <Fade in={showPasswordInput}>
//           <Box sx={{ mt: 5, mx: 4, bgcolor: "white", p: 3 }}>
//             <Typography id="password-input-modal-title" variant="h5">
//               Inserisci la password
//             </Typography>
//             <TextField
//               id="password-input"
//               label="Password"
//               type="password"
//               value={password || ""}
//               onChange={(e) => setPassword(e.target.value)}
//               fullWidth
//               margin="normal"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handlePasswordInputSubmit}
//             >
//               Decripta
//             </Button>
//           </Box>
//         </Fade>
//       </Modal>

//       {/* Decrypted Data Display (if available) */}
//       {decryptedData && (
//         <Modal
//           open={decryptedData !== ""}
//           onClose={() => setDecryptedData("")}
//           aria-labelledby="decrypted-data-modal-title"
//           aria-describedby="decrypted-data-modal-description"
//         >
//           <Fade in={decryptedData !== ""}>
//             <Box sx={{ mt: 5, mx: 4, bgcolor: "white", p: 3 }}>
//               <Typography id="decrypted-data-modal-title" variant="h5">
//                 Dati decriptati
//               </Typography>
//               <pre>{decryptedData}</pre>
//             </Box>
//           </Fade>
//         </Modal>
//       )}
//     </Container>
//   );
// };

// export default DecryptDocuments;
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
  fetchAllDigitalAssetByOwner,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "./wallet.json"; // Assicurati che il percorso sia corretto
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const DecryptDocuments = () => {
  const router = useRouter();
  const [decryptedMetadata, setDecryptedMetadata] = useState(null);
  const [encryptedMetadata, setEncryptedMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
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

        const ownerPublicKey = "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"; // Sostituisci con la tua chiave pubblica
        const assets = await fetchAllDigitalAssetByOwner(umi, ownerPublicKey);
        console.log("Assets:", assets);

        const documentsData = await Promise.all(
          assets.map(async (asset) => {
            const metadataUri = asset.metadata.uri;
            const res = await axios.get(metadataUri);
            console.log("Metadata URI:", metadataUri);
            console.log("Encrypted Data:", res.data);
            return { ...res.data, encryptedData: res.data }; // Memorizza i dati crittografati
          })
        );

        setEncryptedMetadata(documentsData);
      } catch (err) {
        setError("Error fetching documents: " + err.message);
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    if (encryptedMetadata) {
      // Funzione per decrittografare un valore specifico
      const decryptValue = (encryptedValue, encryptionKey) => {
        if (!encryptedValue) return null; // Controllo per valori nulli
        const bytes = CryptoJS.AES.decrypt(encryptedValue, encryptionKey);
        if (bytes.toString(CryptoJS.enc.Utf8) === "") {
          return "Decryption failed";
        }
        const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedValue;
      };

      // Decrittografia dei metadati
      const decryptionKey = "static-encryption-key"; // Chiave di decrittografia statica
      const decrypted = encryptedMetadata.map((metadata) => {
        console.log("Metadata:", metadata);

        // Decrittografia degli attributi
        const decryptedAttributes = metadata.attributes.map((attribute) => {
          return {
            ...attribute,
            value: decryptValue(attribute.value, decryptionKey),
          };
        });

        return {
          ...metadata,
          Oggetto: decryptValue(metadata.encryptedData?.Oggetto, decryptionKey),
          Titolo: decryptValue(metadata.encryptedData?.Titolo, decryptionKey),
          Descrizione: decryptValue(metadata.encryptedData?.Descrizione, decryptionKey),
          Data: decryptValue(metadata.encryptedData?.Data, decryptionKey),
          attributes: decryptedAttributes,
        };
      });

      console.log("Decrypted Metadata:", decrypted); // Log per verificare i metadati decrittati
      setDecryptedMetadata(decrypted);
    }
  }, [encryptedMetadata]);

  return (
    <div>
      <Typography variant="h4">Decrypted Metadata</Typography>
      {decryptedMetadata && (
        <div>
          {decryptedMetadata.map((metadata, index) => (
            <div key={index}>
              {metadata.attributes.map((attribute, attrIndex) => (
                <Typography key={attrIndex} variant="body1">
                  {attribute.trait_type}: {attribute.value}
                </Typography>
              ))}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DecryptDocuments;
