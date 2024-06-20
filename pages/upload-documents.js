import React, { useState } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createNft,
  mplTokenMetadata,
  fetchAllDigitalAssetByOwner,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import wallet from "./wallet.json";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js"; // Import crypto-js
import {
  ArrowBackIos,
  AttachFile,
  Backup,
  DriveFileRenameOutline,
  Home,
  Search,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "./components/NavigationBar";
import { useRouter } from "next/router";

import Tesseract from "tesseract.js"; // Import tesseract.js

const connectionUrl = "https://api.devnet.solana.com";
const commitment = "finalized";

const UploadDocuments = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uri, setUri] = useState("");
  const [completed, setCompleted] = useState(false);
  const [fileHash, setFileHash] = useState(""); // Stato per l'hash del file
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [metadataValues, setMetadataValues] = useState({
    Titolo: "",
    Oggetto: "",
    Descrizione: "",
    Data: "",
  });

  const router = useRouter();

  const steps = [
    "Carica documento",
    "Inserisci i dati",
    "Mint documento su blockchain",
  ];

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const standard_image_doc =
    "https://arweave.net/LG0it6XjCeG4syH4QOpgy3fqQ3UQEmYAPs0yB00xUTw";

  const encryptionKey = "static-encryption-key"; // Static encryption key
  const encryptValue = (value) => {
    return CryptoJS.AES.encrypt(value, encryptionKey).toString();
  };

  async function initializeUmi(file) {
    const umi = createUmi(connectionUrl, commitment);
    umi.use(irysUploader());

    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(wallet)
    );
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));

    const nftFile = createGenericFile(file, "Document");

    const [myUri] = await umi.uploader.upload([nftFile]);
    return myUri;
  }

  const uploadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const ownersession = sessionStorage.getItem("wallet", wallet);
      console.log("Wallet: ", ownersession);
      const assets = await fetchAllDigitalAssetByOwner(
        umi2,
        ownersession
        // "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"
      );
      console.log(assets[0]);
      const res = await axios.get(
        "https://arweave.net/f0AjqtphISJ4z_ZiaLVY5eqI6P0w2qWjzggP-T55qVs"
      );
      console.log(res);
      const file = await readFile(selectedFile);
      const myUri = await initializeUmi(file);
      setUploadResult(myUri);
      console.log("File caricato correttamente: ", myUri);

      console.log("Ho caricato notify()");
      handleNext();
      //notify("File caricato correttamente ", myUri);
      notify("OCR del file completato ", "");
    } catch (err) {
      setError("Errore nel caricamento del file: " + err.message);
      console.error("Errore nel caricamento del file ", err);
    } finally {
      setLoading(false);
    }
  };

  const notify = (text, link) =>
    toast.success(
      <div>
        {text}
        <a
          href={link}
          style={{ color: "yellow", marginBlock: 10 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link}
        </a>
      </div>,
      {
        position: "top-right",
        autoClose: true, // Rimuovi il tempo di chiusura automatica
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      }
    );

  const createMetadata = async () => {
    setLoading(true);

    try {
      const umi = createUmi(connectionUrl, commitment);
      umi.use(irysUploader());
      const keypair = umi.eddsa.createKeypairFromSecretKey(
        new Uint8Array(wallet)
      );
      const myKeypairSigner = createSignerFromKeypair(umi, keypair);
      umi.use(signerIdentity(myKeypairSigner));

      const metadata = {
        name: "NFTGLD",
        symbol: "MVPGLD",
        Descrizione: encryptValue(metadataValues.Descrizione),
        image: standard_image_doc, // URL dell'immagine standard
        attributes: [
          {
            trait_type: "Oggetto",
            value: encryptValue(metadataValues.Oggetto),
          },
          { trait_type: "Data", value: encryptValue(metadataValues.Data) },
          {
            trait_type: "Descrizione",
            value: encryptValue(metadataValues.Descrizione),
          },
          { trait_type: "Titolo", value: encryptValue(metadataValues.Titolo) },
          //Aggiungi data italiana
          {
            trait_type: "Mint Data",
            value:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
          },
          {
            trait_type: "File Hash",
            value: fileHash, // Aggiungi l'hash del file ai metadati
          },
        ],
        properties: {
          files: [{ type: "image/jpeg", uri: standard_image_doc }],
        },
      };

      const nftUri = await umi.uploader.uploadJson(metadata);
      setUri(nftUri);
      //console.log("Metadata upload successful:", nftUri);
      // notify("Metadata caricati correttamente: ", nftUri);
      notify("Metadata del documento caricati, mint in corso...", "");
      mintNFT(nftUri); // Mint NFT immediately after metadata upload
    } catch (err) {
      console.error("Error uploading metadata:", err);
    }
  };

  const umi2 = createUmi("https://api.devnet.solana.com", "finalized");
  let keypair2 = umi2.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
  const myKeypairSigner2 = createSignerFromKeypair(umi2, keypair2);
  umi2.use(signerIdentity(myKeypairSigner2)).use(mplTokenMetadata());
  const mint = generateSigner(umi2);
  const sellerFeeBasisPoints = percentAmount(5, 2);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    calculateFileHash(file);
    extractTextFromImage(file); // Extract text from the selected image file
  };

  const calculateFileHash = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const hash = CryptoJS.SHA256(wordArray).toString();
      setFileHash(hash);
      console.log("Hash del file: ", hash);
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromImage = (file) => {
    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        console.log(text);
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const newMetadataValues = {
          Titolo: lines[0] || "",
          Oggetto: lines[1] || "",
          Descrizione: lines[2] || "",
          Data: formatDateString(lines[3]) || "", // Format the date string
        };
        setMetadataValues(newMetadataValues);
      })
      .catch((error) => {
        console.error("Error extracting text from image:", error);
        setError("Errore nell'estrazione del testo dall'immagine");
        //ShowAlert("error", "Errore nell'estrazione del testo dall'immagine");
      });
  };

  const formatDateString = (dateString) => {
    // Assuming the date is in format "DD/MM/YYYY" or similar
    const dateParts = dateString.split("/");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString; // Return the original string if it doesn't match expected format
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMetadataValues({ ...metadataValues, [name]: value });
  };

  const name = "NFTGLD";
  const mintNFT = async (nftUri) => {
    setLoading(true);

    try {
      let tx = createNft(umi2, {
        symbol: "MVPGLD",
        mint,
        name,
        uri: nftUri,
        sellerFeeBasisPoints,
      });

      let result = await tx.sendAndConfirm(umi2);
      console.log("result: ", result);
      const signature = base58.deserialize(result.signature);
      console.log("Signature: ", signature);
      console.log("NFT minted successfully:", result);
      const transazione = base58.deserialize(result.signature);
      console.log(
        "Transazione: ",
        "https://explorer.solana.com/tx/" + transazione[0] + "?cluster=devnet"
      );
      notify(
        "Documento NFT mintato correttamente! \n",
        "https://explorer.solana.com/tx/" + transazione[0] + "?cluster=devnet"
      );
      handleNext();
      setCompleted(true);
    } catch (err) {
      console.error("Error minting NFT:", err);
    } finally {
      setLoading(false);
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleConfirmMetadata = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    setLoading(true);
    createMetadata();
  };

  return (
    <div className="App">
      <NavigationBar />
      <header className="App-header">
        <Stepper
          activeStep={activeStep}
          style={{ backgroundColor: "transparent", padding: "20px 0" }}
          alternativeLabel
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  classes: {
                    root: "custom-stepper-icon",
                    active: "custom-stepper-icon-active",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  style={{ fontWeight: "bold", color: "white" }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              borderRadius: 5,
              backgroundColor: "white",
              padding: 5,
              alignContent: "center",
              alignSelf: "center",
              marginInline: "20%",
              marginBlock: 10,
            }}
          >
            <label htmlFor="fileInput" style={{ color: "black" }}>
              Seleziona File:{" "}
            </label>
            <br />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AttachFile />}
              onChange={handleFileChange}
              style={{ width: "30%", marginBlock: 15 }}
            >
              File
              <VisuallyHiddenInput
                id="fileInput"
                type="file"
                accept="image/*"
              />
            </Button>
            {selectedFile && (
  <div className="image-preview">
    <br />
    <img
      src={URL.createObjectURL(selectedFile)}
      alt="Preview"
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "100%",
        height: "auto",
        maxHeight: "500px", // Altezza massima dell'immagine
        marginBottom: "15px",
      }}
    />
    <Typography variant="body1" align="center">
      {selectedFile.name}
    </Typography>
  </div>
)}
            <Button
              onClick={uploadFile}
              disabled={!selectedFile || loading}
              variant="contained"
              endIcon={<Backup />}
            >
              {loading ? "Scansione in corso..." : "Upload File (OCR)"}
            </Button>
          </Box>
        )}
        {activeStep === 1 && uploadResult && (
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              borderRadius: 5,
              backgroundColor: "white",
              padding: 5,
              paddingInline: 10,
              alignContent: "center",
              alignSelf: "center",
              marginInline: "20%",
              marginBlock: 10,
            }}
          >
            <Typography
              variant="h5"
              color={"black"}
              style={{ marginBlock: 10 }}
            >
              Metadata
            </Typography>
            <TextField
              label="Titolo documento"
              name="Titolo"
              value={metadataValues.Titolo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Oggetto"
              name="Oggetto"
              value={metadataValues.Oggetto}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Descrizione"
              name="Descrizione"
              value={metadataValues.Descrizione}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Data"
              name="Data"
              type="date"
              value={metadataValues.Data}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            <Button
              onClick={handleConfirmMetadata}
              disabled={loading}
              variant="contained"
              endIcon={<DriveFileRenameOutline />}
            >
              {loading ? (
                <>
                  Caricamento... <CircularProgress size={24} sx={{ ml: 2 }} />
                </>
              ) : (
                "Crea metadati e Mint Documento"
              )}
            </Button>
          </Box>
        )}
        {activeStep === 2 && uri && (
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              borderRadius: 5,
              backgroundColor: "white",
              padding: 5,
              paddingInline: 10,
              alignContent: "center",
              alignSelf: "center",
              marginInline: "20%",
              marginBlock: 10,
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              color={"black"}
              style={{ marginBlock: 15 }}
            >
              NFT creato con successo!
            </Typography>
            <Typography
              variant="body1"
              color={"black"}
              style={{ marginBlock: 15 }}
            >
              Puoi visionare l'NFT mintato nella sezione "Visualizza Documenti".
            </Typography>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Search />}
              href="/view-documents"
            >
              Visualizza
            </Button>
            <Button
              onClick={() => router.push("/homepage")}
              disabled={loading}
              variant="contained"
              color="success"
              endIcon={<Home />}
              style={{ width: "30%", marginTop: 25 }}
            >
              {"Home"}
            </Button>
          </Box>
        )}
        {/* {activeStep < steps.length - 1 && (
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="contained"
            style={{ color: "white" }}
            startIcon={<ArrowBackIos />}
          >
            Indietro
          </Button>
        )} */}
        {activeStep === 0 ? null : (
          <Button
            disabled={loading}
            onClick={handleBack}
            variant="contained"
            style={{ color: "white" }}
            startIcon={<ArrowBackIos />}
          >
            Indietro
          </Button>
        )}
        {error && <Typography color="error">{error}</Typography>}
        <ToastContainer />

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Conferma i dati</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body1">
                Titolo: {metadataValues.Titolo}
              </Typography>
              <Typography variant="body1">
                Oggetto: {metadataValues.Oggetto}
              </Typography>
              <Typography variant="body1">
                Descrizione: {metadataValues.Descrizione}
              </Typography>
              <Typography variant="body1">
                Data: {metadataValues.Data}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Modifica
            </Button>
            <Button
              onClick={handleConfirm}
              color="primary"
              variant="contained"
              autoFocus
            >
              Conferma
            </Button>
          </DialogActions>
        </Dialog>
      </header>
    </div>
  );
};

export default UploadDocuments;

// import React, { useState } from "react";
// import Image from "next/image";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import {
//   createNft,
//   mplTokenMetadata,
//   fetchAllDigitalAssetByOwner,
// } from "@metaplex-foundation/mpl-token-metadata";
// import {
//   createGenericFile,
//   createSignerFromKeypair,
//   signerIdentity,
// } from "@metaplex-foundation/umi";
// import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import { base58 } from "@metaplex-foundation/umi/serializers";
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
// import wallet from "./wallet.json";
// import {
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import CryptoJS from "crypto-js"; // Import crypto-js
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const connectionUrl = "https://api.devnet.solana.com";
// const commitment = "finalized";

// const UploadDocuments = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [uri, setUri] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [metadataValues, setMetadataValues] = useState({
//     Titolo: "",
//     Oggetto: "",
//     Descrizione: "",
//     Data: "",
//   });

//   const steps = ["Carica immagine", "Inserisci i dati", "Mint documento su blockchain"];

//   const encryptionKey = "static-encryption-key"; // Static encryption key
//   const encryptValue = (value) => {
//     return CryptoJS.AES.encrypt(value, encryptionKey).toString();
//   };

//   async function initializeUmi(image) {
//     const umi = createUmi(connectionUrl, commitment);
//     umi.use(irysUploader());

//     const keypair = umi.eddsa.createKeypairFromSecretKey(
//       new Uint8Array(wallet)
//     );
//     const myKeypairSigner = createSignerFromKeypair(umi, keypair);
//     umi.use(signerIdentity(myKeypairSigner));

//     const nftImage = createGenericFile(image, "Document");

//     const [myUri] = await umi.uploader.upload([nftImage]);
//     return myUri;
//   }

//   const uploadImage = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const assets = await fetchAllDigitalAssetByOwner(
//         umi2,
//         "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"
//       );
//       console.log(assets[0]);
//       const res = await axios.get(
//         "https://arweave.net/f0AjqtphISJ4z_ZiaLVY5eqI6P0w2qWjzggP-T55qVs"
//       );
//       console.log(res);
//       const image = await readFile(selectedImage);
//       const myUri = await initializeUmi(image);
//       setUploadResult(myUri);
//       console.log("Immagine caricata correttamente: ", myUri);

//       console.log("Ho caricato notify()");
//       handleNext();
//     notify("Immagine caricata correttamente ", myUri);
//     } catch (err) {
//       setError("Errore nel caricamento dell'immagine: " + err.message);
//       console.error("Errore nel caricamento dell'immagine ", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const notify = (text,link) => toast(
//     <div>
//       {text} <a href={link} style={{ color: "yellow" }} target="_blank" rel="noopener noreferrer">{link}</a>
//     </div>,
//     {
//       position: "top-right",
//       autoClose: true, // Rimuovi il tempo di chiusura automatica
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//     }
//   );

//   const createMetadata = async () => {
//     try {
//       const umi = createUmi(connectionUrl, commitment);
//       umi.use(irysUploader());
//       const keypair = umi.eddsa.createKeypairFromSecretKey(
//         new Uint8Array(wallet)
//       );
//       const myKeypairSigner = createSignerFromKeypair(umi, keypair);
//       umi.use(signerIdentity(myKeypairSigner));

//       const metadata = {
//         name: "NFTGLD",
//         symbol: "MVPGLD",
//         Descrizione: encryptValue(metadataValues.Descrizione), // Cripta solo il valore della descrizione
//         image: uploadResult,
//         attributes: [
//           { trait_type: "Oggetto", value: encryptValue(metadataValues.Oggetto) },
//           { trait_type: "Data", value: encryptValue(metadataValues.Data) }, // Cripta solo il valore della data
//           { trait_type: "Descrizione", value: encryptValue(metadataValues.Descrizione) }, // Non cripta il valore del titolo
//           { trait_type: "Titolo", value: encryptValue(metadataValues.Titolo) }, // Non cripta il valore della descrizione
//         ],
//         properties: {
//           files: [{ type: "image/jpeg", uri: uploadResult }],
//         },
//       };

//       const nftUri = await umi.uploader.uploadJson(metadata);
//       setUri(nftUri);
//       console.log("Metadata upload successful:", nftUri);
//       handleNext();
//       notify("Metadata caricati correttamente: ", nftUri); // Chiamata a notify dopo setUri
//     } catch (err) {
//       console.error("Error uploading metadata:", err);
//     }
//   };

//   const umi2 = createUmi("https://api.devnet.solana.com", "finalized");
//   let keypair2 = umi2.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
//   const myKeypairSigner2 = createSignerFromKeypair(umi2, keypair2);
//   umi2.use(signerIdentity(myKeypairSigner2)).use(mplTokenMetadata());
//   const mint = generateSigner(umi2);
//   const sellerFeeBasisPoints = percentAmount(5, 2);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedImage(file);
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setMetadataValues({ ...metadataValues, [name]: value });
//   };

//   const name = "NFTGLD";

//   const mintNFT = async () => {
//     let tx = createNft(umi2, {
//       symbol: "MVPGLD",
//       mint,
//       name,
//       uri,
//       sellerFeeBasisPoints,
//     });

//     let result = await tx.sendAndConfirm(umi2);
//     console.log("result: ", result);
//     const signature = base58.deserialize(result.signature);
//     console.log("Signature: ",signature);
//     console.log("NFT minted successfully:", result);
//     notify("Documento NFT mintato correttamente!");
//     handleNext();
//   };

//   const readFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   const handleNext = () =>
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   const handleBack = () =>
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Stepper activeStep={activeStep}>
//           {steps.map((label, index) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {activeStep === 0 && (
//           <div>
//             <label htmlFor="imageInput">Seleziona la tua immagine: </label>
//             <br />
//             <input
//               id="imageInput"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />

//             {selectedImage && (
//               <div className="image-preview">
//                 <br />
//                 <Image
//                   src={URL.createObjectURL(selectedImage)}
//                   alt="Preview"
//                   width={100}
//                   height={100}

//                 />
//               </div>
//             )}

//             <Button onClick={uploadImage} disabled={loading}>
//               {loading ? "Uploading..." : "Upload immagine"}

//             </Button>
//           </div>
//         )}
//         {activeStep === 1 && uploadResult && (

//           <div>

//             <TextField
//               label="Titolo documento"
//               name="Titolo"
//               value={metadataValues.Titolo}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Oggetto"
//               name="Oggetto"
//               value={metadataValues.Oggetto}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Descrizione"
//               name="Descrizione"
//               value={metadataValues.Descrizione}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Data"
//               name="Data"
//               type="date"
//               value={metadataValues.Data}
//               onChange={handleInputChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               margin="normal"
//             />
//             <Button onClick={createMetadata} disabled={loading}>
//               {loading ? "Caricamento..." : "Crea metadati"}
//             </Button>
//           </div>
//         )}
//         {activeStep === 2 && uri && (
//           <div>
//             <Typography variant="h6">Ready to Mint your NFT!</Typography>
//             <Button onClick={mintNFT} disabled={loading}>
//               {loading ? "Minting..." : "Mint NFT"}
//             </Button>
//           </div>
//         )}
//         {activeStep < steps.length - 1 && (
//           <Button disabled={activeStep === 0} onClick={handleBack}>
//             Indietro
//           </Button>
//         )}
//         {error && <Typography color="error">{error}</Typography>}
//         <ToastContainer />
//       </header>
//     </div>
//   );
// };

// export default UploadDocuments;

// import React, { useState } from "react";
// import Image from "next/image";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import {
//   createNft,
//   mplTokenMetadata,
//   fetchAllDigitalAssetByOwner,
// } from "@metaplex-foundation/mpl-token-metadata";
// import {
//   createGenericFile,
//   createSignerFromKeypair,
//   signerIdentity,
// } from "@metaplex-foundation/umi";
// import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import { base58 } from "@metaplex-foundation/umi/serializers";
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
// import wallet from "./wallet.json";
// import {
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import CryptoJS from "crypto-js"; // Import crypto-js
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Tesseract from "tesseract.js"; // Import tesseract.js

// const connectionUrl = "https://api.devnet.solana.com";
// const commitment = "finalized";

// const UploadDocuments = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [uri, setUri] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadResult, setUploadResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [metadataValues, setMetadataValues] = useState({
//     Titolo: "",
//     Oggetto: "",
//     Descrizione: "",
//     Data: "",
//   });

//   const steps = ["Carica immagine", "Inserisci i dati", "Mint documento su blockchain"];
//   const standard_image_doc = "https://arweave.net/LG0it6XjCeG4syH4QOpgy3fqQ3UQEmYAPs0yB00xUTw";

//   const encryptionKey = "static-encryption-key"; // Static encryption key
//   const encryptValue = (value) => {
//     return CryptoJS.AES.encrypt(value, encryptionKey).toString();
//   };

//   async function initializeUmi(file) {
//     const umi = createUmi(connectionUrl, commitment);
//     umi.use(irysUploader());

//     const keypair = umi.eddsa.createKeypairFromSecretKey(
//       new Uint8Array(wallet)
//     );
//     const myKeypairSigner = createSignerFromKeypair(umi, keypair);
//     umi.use(signerIdentity(myKeypairSigner));

//     const nftFile = createGenericFile(file, "Document");

//     const [myUri] = await umi.uploader.upload([nftFile]);
//     return myUri;
//   }

//   const uploadFile = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const assets = await fetchAllDigitalAssetByOwner(
//         umi2,
//         "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"
//       );
//       console.log(assets[0]);
//       const res = await axios.get(
//         "https://arweave.net/f0AjqtphISJ4z_ZiaLVY5eqI6P0w2qWjzggP-T55qVs"
//       );
//       console.log(res);
//       const file = await readFile(selectedFile);
//       const myUri = await initializeUmi(file);
//       setUploadResult(myUri);
//       console.log("File caricato correttamente: ", myUri);

//       console.log("Ho caricato notify()");
//       handleNext();
//       notify("File caricato correttamente ", myUri);
//     } catch (err) {
//       setError("Errore nel caricamento del file: " + err.message);
//       console.error("Errore nel caricamento del file ", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const notify = (text, link) => toast(
//     <div>
//       {text} <a href={link} style={{ color: "yellow" }} target="_blank" rel="noopener noreferrer">{link}</a>
//     </div>,
//     {
//       position: "top-right",
//       autoClose: true, // Rimuovi il tempo di chiusura automatica
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//     }
//   );

//   const createMetadata = async () => {
//     try {
//       const umi = createUmi(connectionUrl, commitment);
//       umi.use(irysUploader());
//       const keypair = umi.eddsa.createKeypairFromSecretKey(
//         new Uint8Array(wallet)
//       );
//       const myKeypairSigner = createSignerFromKeypair(umi, keypair);
//       umi.use(signerIdentity(myKeypairSigner));

//       const metadata = {
//         name: "NFTGLD",
//         symbol: "MVPGLD",
//         Descrizione: encryptValue(metadataValues.Descrizione),
//         image: standard_image_doc, // URL dell'immagine standard
//         attributes: [
//           { trait_type: "Oggetto", value: encryptValue(metadataValues.Oggetto) },
//           { trait_type: "Data", value: encryptValue(metadataValues.Data) },
//           { trait_type: "Descrizione", value: encryptValue(metadataValues.Descrizione) },
//           { trait_type: "Titolo", value: encryptValue(metadataValues.Titolo) },
//         ],
//         properties: {
//           files: [{ type: "image/jpeg", uri: standard_image_doc }],
//         },
//       };

//       const nftUri = await umi.uploader.uploadJson(metadata);
//       setUri(nftUri);
//       console.log("Metadata upload successful:", nftUri);
//       handleNext();
//       notify("Metadata caricati correttamente: ", nftUri);
//     } catch (err) {
//       console.error("Error uploading metadata:", err);
//     }
//   };

//   const umi2 = createUmi("https://api.devnet.solana.com", "finalized");
//   let keypair2 = umi2.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
//   const myKeypairSigner2 = createSignerFromKeypair(umi2, keypair2);
//   umi2.use(signerIdentity(myKeypairSigner2)).use(mplTokenMetadata());
//   const mint = generateSigner(umi2);
//   const sellerFeeBasisPoints = percentAmount(5, 2);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     extractTextFromImage(file); // Extract text from the selected image file
//   };

//   const extractTextFromImage = (file) => {
//     Tesseract.recognize(file, 'eng', {
//       logger: (m) => console.log(m),
//     })
//       .then(({ data: { text } }) => {
//         console.log(text);
//         const lines = text.split('\n').filter(line => line.trim() !== '');
//         const newMetadataValues = {
//           Titolo: lines[0] || "",
//           Oggetto: lines[1] || "",
//           Descrizione: lines[2] || "",
//           Data: formatDateString(lines[3]) || "", // Format the date string
//         };
//         setMetadataValues(newMetadataValues);
//       })
//       .catch((error) => {
//         console.error("Error extracting text from image:", error);
//         setError("Errore nell'estrazione del testo dall'immagine");
//       });
//   };

//   const formatDateString = (dateString) => {
//     // Assuming the date is in format "DD/MM/YYYY" or similar
//     const dateParts = dateString.split('/');
//     if (dateParts.length === 3) {
//       const [day, month, year] = dateParts;
//       return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//     }
//     return dateString; // Return the original string if it doesn't match expected format
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setMetadataValues({ ...metadataValues, [name]: value });
//   };

//   const name = "NFTGLD";
//   const mintNFT = async () => {
//     let tx = createNft(umi2, {
//       symbol: "MVPGLD",
//       mint,
//       name,
//       uri,
//       sellerFeeBasisPoints,
//     });

//     let result = await tx.sendAndConfirm(umi2);
//     console.log("result: ", result);
//     const signature = base58.deserialize(result.signature);
//     console.log("Signature: ", signature);
//     console.log("NFT minted successfully:", result);
//     const transazione = base58.deserialize(result.signature);
//     console.log("Transazione: ", "https://explorer.solana.com/tx/" + transazione[0] + "?cluster=devnet");
//     notify("Documento NFT mintato correttamente!", "https://explorer.solana.com/tx/" + transazione[0] + "?cluster=devnet");
//     handleNext();
//   };

//   const readFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   const handleNext = () =>
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   const handleBack = () =>
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Stepper activeStep={activeStep}>
//           {steps.map((label, index) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {activeStep === 0 && (
//           <div>
//             <label htmlFor="fileInput">Seleziona la tua immagine: </label>
//             <br />
//             <input
//               id="fileInput"
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//             />

//             {selectedFile && (
//               <div className="file-preview">
//                 <br />
//                 <Typography variant="body1">{selectedFile.name}</Typography>
//               </div>
//             )}

//             <Button onClick={uploadFile} disabled={loading}>
//               {loading ? "Uploading..." : "Upload immagine"}

//             </Button>
//           </div>
//         )}
//         {activeStep === 1 && uploadResult && (

//           <div>

//             <TextField
//               label="Titolo documento"
//               name="Titolo"
//               value={metadataValues.Titolo}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Oggetto"
//               name="Oggetto"
//               value={metadataValues.Oggetto}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Descrizione"
//               name="Descrizione"
//               value={metadataValues.Descrizione}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Data"
//               name="Data"
//               type="date"
//               value={metadataValues.Data}
//               onChange={handleInputChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               margin="normal"
//             />
//             <Button onClick={createMetadata} disabled={loading}>
//               {loading ? "Caricamento..." : "Crea metadati"}
//             </Button>
//           </div>
//         )}
//         {activeStep === 2 && uri && (
//           <div>
//             <Typography variant="h6">Ready to Mint your NFT!</Typography>
//             <Button onClick={mintNFT} disabled={loading}>
//               {loading ? "Minting..." : "Mint NFT"}
//             </Button>
//           </div>
//         )}
//         {activeStep < steps.length - 1 && (
//           <Button disabled={activeStep === 0} onClick={handleBack}>
//             Indietro
//           </Button>
//         )}
//         {error && <Typography color="error">{error}</Typography>}
//         <ToastContainer />
//       </header>
//     </div>
//   );
// };

// export default UploadDocuments;
