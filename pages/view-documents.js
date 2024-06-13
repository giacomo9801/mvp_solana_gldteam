import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
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
import wallet from "./wallet.json";
import NavigationBar from "./components/NavigationBar";

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerPublicKey, setOwnerPublicKey] = useState(null);

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

        const walletAddress = sessionStorage.getItem("wallet");
        // const ownerPublicKey = "Akkx5jEA1m3yiG5jAnmJUuzaWccpUGZTFHWEvk5rsDzw" NUOVO
        // const ownerPublicKey = "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"; // Replace with your public key, VECCHIO
        //ricavo wallet da storage
        // const ownerPublicKey = sessionStorage.getItem("wallet");
        // console.log("Owner Public Key from storage:", ownerPublicKey);
        //INDIRIZZO WALLET RICAVATO DA CHIAVE PRIVATA
        // const ownerPublicKey = keypair.publicKey  //prendi la chiave pubblica del wallet
        // console.log("Owner Public Key:", ownerPublicKey);
        setOwnerPublicKey(walletAddress);

        const assets = await fetchAllDigitalAssetByOwner(umi, walletAddress);
        console.log("UMI:", umi);
        console.log("walletAddress:", walletAddress);
        console.log("Assets:", assets);

        const documentsData = await Promise.all(
          assets.map(async (asset) => {
            const metadataUri = asset.metadata.uri;
            const res = await axios.get(metadataUri);
            console.log("Metadata URI:", metadataUri);
            return res.data;
          })
        );

        setDocuments(documentsData);
      } catch (err) {
        setError("Error fetching documents: " + err.message);
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <Container>
      <NavigationBar />
      <Typography variant="h3" gutterBottom style={{ marginBlock: 20 }}>
        I tuoi documenti
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : documents.length === 0 ? (
        <Typography variant="h6" gutterBottom>
          Per il wallet {ownerPublicKey} non sono stati trovati documenti
          caricati.
        </Typography>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
        >
          {documents.map((doc, index) => (
            <Box
              key={index}
              sx={{
                margin: 2,
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 4,
                width: 300,
                maxWidth: "100%",
                backgroundColor: "#fff",
                color: "#000",
                flexDirection: "column",
                display: "flex",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom style={{ marginBottom: 10 }}>
                {doc.name}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  marginBottom: 10,
                  flex: 1,
                  overflowWrap: 'break-word',
                }}
              >
                {doc.description}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  marginBottom: 10,
                  flex: 1,
                  wordBreak: 'break-all',
                }}
              >
                {doc.attributes.map((attr, index) => (
                  <span
                    key={index}
                    style={{ display: "block", marginBottom: 5 }}
                  >
                    <strong>{attr.trait_type}:</strong> {attr.value}
                  </span>
                ))}
              </Typography>

              <img
                src={doc.image}
                alt={doc.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  marginBottom: 10,
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ViewDocuments;













// import React, { useState, useEffect } from "react";
// import { Container, Typography, Box, CircularProgress } from "@mui/material";
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
// import wallet from "./wallet.json"; // Assicurati che il percorso sia corretto
// import NavigationBar from "./components/NavigationBar";

// const ViewDocuments = () => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [ownerPublicKey, setOwnerPublicKey] = useState(null);

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

//         const walletAddress = sessionStorage.getItem("wallet");
//         // const ownerPublicKey = "Akkx5jEA1m3yiG5jAnmJUuzaWccpUGZTFHWEvk5rsDzw" NUOVO
//         // const ownerPublicKey = "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"; // Replace with your public key, VECCHIO
//         //ricavo wallet da storage
//         // const ownerPublicKey = sessionStorage.getItem("wallet");
//         // console.log("Owner Public Key from storage:", ownerPublicKey);
//         //INDIRIZZO WALLET RICAVATO DA CHIAVE PRIVATA
//         // const ownerPublicKey = keypair.publicKey  //prendi la chiave pubblica del wallet
//         // console.log("Owner Public Key:", ownerPublicKey);
//         setOwnerPublicKey(walletAddress);

//         const assets = await fetchAllDigitalAssetByOwner(umi, walletAddress);
//         console.log("UMI:", umi);
//         console.log("walletAddress:", walletAddress);
//         console.log("Assets:", assets);

//         const documentsData = await Promise.all(
//           assets.map(async (asset) => {
//             const metadataUri = asset.metadata.uri;
//             const res = await axios.get(metadataUri);
//             console.log("Metadata URI:", metadataUri);
//             return res.data;
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

//   return (
//     <Container>
//       <NavigationBar />
//       <Typography variant="h3" gutterBottom style={{ marginBlock: 20 }}>
//         I tuoi documenti
//       </Typography>
//       {loading ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height="80vh"
//         >
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : documents.length === 0 ? (
//         <Typography variant="h6" gutterBottom>
//           Per il wallet {ownerPublicKey} non sono stati trovati documenti
//           caricati.
//         </Typography>
//       ) : (
//         <Box display="flex" flexDirection="column" alignItems="center">
//           {documents.map((doc, index) => (
//             <Box
//               key={index}
//               sx={{
//                 margin: 2,
//                 padding: 2,
//                 border: "1px solid #ccc",
//                 borderRadius: 4,
//                 width: "100%",
//                 maxWidth: 600,
//                 backgroundColor: "#fff",
//                 color: "#000",
//                 flexDirection: "column",
//                 display: "flex",
//               }}
//             >
//               <Typography variant="h6" gutterBottom>
//                 {doc.name}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 {doc.description}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 {doc.attributes.map((attr, index) => (
//                   <span
//                     key={index}
//                     style={{ display: "flex", flexDirection: "column" }}
//                   >
//                     <strong>{attr.trait_type}:</strong> {attr.value}
//                     {index < doc.attributes.length - 1 && ", "}
//                   </span>
//                 ))}
//               </Typography>

//               <img
//                 src={doc.image}
//                 alt={doc.name}
//                 style={{
//                   alignSelf: "center",
//                   maxWidth: "200px",
//                   maxHeight: "200px",
//                   marginBlock: 20,
//                   objectFit: "scale-down",
//                 }}
//               />
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default ViewDocuments;