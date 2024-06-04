import React, { useState } from "react";
import Image from "next/image";
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
} from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js"; // Import crypto-js
import { ArrowBackIos, AttachFile, AutoAwesome, Backup, DriveFileRenameOutline, Home } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from "./components/NavigationBar";
import { useRouter } from "next/router";


const connectionUrl = "https://api.devnet.solana.com";
const commitment = "finalized";

const UploadDocuments = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uri, setUri] = useState("");
  const [completed, setCompleted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadataValues, setMetadataValues] = useState({
    Titolo: "",
    Oggetto: "",
    Descrizione: "",
    Data: "",
  });
  
  const router = useRouter();

  const steps = ["Carica immagine", "Inserisci i dati", "Mint documento su blockchain", "Processo Completato"];

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  

  const encryptionKey = "static-encryption-key"; // Static encryption key
  const encryptValue = (value) => {
    return CryptoJS.AES.encrypt(value, encryptionKey).toString();
  };

  async function initializeUmi(image) {
    const umi = createUmi(connectionUrl, commitment);
    umi.use(irysUploader());

    const keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(wallet)
    );
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));

    const nftImage = createGenericFile(image, "Document");

    const [myUri] = await umi.uploader.upload([nftImage]);
    return myUri;
  }

  const uploadImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const assets = await fetchAllDigitalAssetByOwner(
        umi2,
        "BpuAW2VoNuwex4Nu9LzcABSdHe42nPNFtrapoxiuDFtA"
      );
      console.log(assets[0]);
      const res = await axios.get(
        "https://arweave.net/f0AjqtphISJ4z_ZiaLVY5eqI6P0w2qWjzggP-T55qVs"
      );
      console.log(res);
      const image = await readFile(selectedImage);
      const myUri = await initializeUmi(image);
      setUploadResult(myUri);
      console.log("Immagine caricata correttamente: ", myUri);
  
      console.log("Ho caricato notify()");
      handleNext();
    notify("Immagine caricata correttamente ", myUri);
    } catch (err) {
      setError("Errore nel caricamento dell'immagine: " + err.message);
      console.error("Errore nel caricamento dell'immagine ", err);
    } finally {
      setLoading(false);
    }
  };
  
  const notify = (text,link) => toast(
    <div>
      {text} 
      <a href={link} style={{ color: "yellow", marginBlock: 10 }} target="_blank" rel="noopener noreferrer">{link}</a>
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
        Descrizione: encryptValue(metadataValues.Descrizione), // Cripta solo il valore della descrizione
        image: uploadResult,
        attributes: [
          { trait_type: "Oggetto", value: encryptValue(metadataValues.Oggetto) },
          { trait_type: "Data", value: encryptValue(metadataValues.Data) }, // Cripta solo il valore della data
          { trait_type: "Descrizione", value: encryptValue(metadataValues.Descrizione) }, // Non cripta il valore del titolo
          { trait_type: "Titolo", value: encryptValue(metadataValues.Titolo) }, // Non cripta il valore della descrizione
        ],
        properties: {
          files: [{ type: "image/jpeg", uri: uploadResult }],
        },
      };

      const nftUri = await umi.uploader.uploadJson(metadata);
      setUri(nftUri);
      console.log("Metadata upload successful:", nftUri);
      handleNext();
      notify("Metadata caricati correttamente: ", nftUri); // Chiamata a notify dopo setUri
    } catch (err) {
      console.error("Error uploading metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  const umi2 = createUmi("https://api.devnet.solana.com", "finalized");
  let keypair2 = umi2.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
  const myKeypairSigner2 = createSignerFromKeypair(umi2, keypair2);
  umi2.use(signerIdentity(myKeypairSigner2)).use(mplTokenMetadata());
  const mint = generateSigner(umi2);
  const sellerFeeBasisPoints = percentAmount(5, 2);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMetadataValues({ ...metadataValues, [name]: value });
  };

  const name = "NFTGLD";

  const mintNFT = async () => {
    setLoading(true);

    try {
      let tx = createNft(umi2, {
        symbol: "MVPGLD",
        mint,
        name,
        uri,
        sellerFeeBasisPoints,
      });

      let result = await tx.sendAndConfirm(umi2);
      console.log("result: ", result);
      const signature = base58.deserialize(result.signature);
      console.log("Signature: ",signature);
      console.log("NFT minted successfully:", result);
      notify("Documento NFT mintato correttamente!");
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

  return (
    <div className="App">
      <NavigationBar/>
      <header className="App-header">
        <Stepper activeStep={activeStep} style={{ backgroundColor: 'white', borderRadius: 10, padding: 10}}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box sx={{flexDirection: "column", display: 'flex', borderRadius: 5, backgroundColor: 'white', padding: 5, alignContent: 'center', alignSelf: 'center', marginInline: '20%', marginBlock: 10}}>
            <label htmlFor="imageInput" style={{color: 'black'}}>Seleziona la tua immagine: </label>
            <br />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AttachFile />}
              onChange={handleImageChange}
              style={{width: '30%', marginBlock: 15}}
            >
              Seleziona file 
              <VisuallyHiddenInput id="imageInput" type="file" accept="image/*" />
            </Button>
            {selectedImage && (
              <div className="image-preview">
                <br />
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  style={{ alignSelf: 'center', maxWidth: "200px", maxHeight: "200px", objectFit: "scale-down", marginBottom: 15}}
                />
              </div>
            )}
            <Button onClick={uploadImage} disabled={!selectedImage || loading} variant="contained" endIcon={<Backup/>}>
              {loading ? "Uploading..." : "Upload immagine"}
             
            </Button>
            {/*<LoadingButton
              onClick={uploadImage}
              endIcon={<Backup/>}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              <span>Send</span>
            </LoadingButton>*/}
          </Box>
        )}
        {activeStep === 1 && uploadResult && (
          <Box sx={{flexDirection: "column", display: 'flex', borderRadius: 5, backgroundColor: 'white', padding: 5, paddingInline: 10, alignContent: 'center', alignSelf: 'center', marginInline: '20%', marginBlock: 10}}>
            <Typography variant="h5" color={'black'} style={{marginBlock: 10}}>Metadata</Typography>
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
              <Button onClick={createMetadata} disabled={loading} variant="contained" endIcon={<DriveFileRenameOutline/>}>
                {loading ? "Caricamento..." : "Crea metadati"}
              </Button>
          </Box>
        )}
        {activeStep === 2 && uri && (
          <Box sx={{flexDirection: "column", display: 'flex', borderRadius: 5, backgroundColor: 'white', padding: 5, paddingInline: 10, alignContent: 'center', alignSelf: 'center', marginInline: '20%', marginBlock: 10, alignItems: 'center'}}>
            <Typography variant="h5" color={'black'} style={{marginBlock: 15}}>Ready to Mint your NFT!</Typography>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  style={{ alignSelf: 'center', maxWidth: "200px", maxHeight: "200px", objectFit: "scale-down", marginBlock: 15}}
                />
            <Button onClick={mintNFT} disabled={loading} variant="contained" endIcon={<AutoAwesome/>} style={{width: '50%'}}>
              {loading ? "Minting..." : "Mint NFT"}
            </Button>
          </Box>
        )}
        {activeStep === 3 && completed && (
          <Box sx={{flexDirection: "column", display: 'flex', borderRadius: 5, backgroundColor: 'white', padding: 5, paddingInline: 10, alignContent: 'center', alignSelf: 'center', marginInline: '20%', marginBlock: 10, alignItems: 'center'}}>
            <Typography variant="h5" color={'black'} style={{marginBlock: 15}}>Documento NFT mintato correttamente!</Typography>
            <Button onClick={() => router.push("/")} disabled={loading} variant="contained" color="success" endIcon={<Home/>} style={{width: '50%'}}>
              {"Home"}
            </Button>
          </Box>
        )}
        {activeStep < steps.length - 1 && (
          <Button disabled={activeStep === 0 || loading} onClick={handleBack} variant="contained" style={{color: 'white'}} startIcon={<ArrowBackIos/>}>
            Indietro
          </Button>
        )}
        {error && <Typography color="error">{error}</Typography>}
        <ToastContainer />
      </header>
    </div>
  );
};

export default UploadDocuments;
