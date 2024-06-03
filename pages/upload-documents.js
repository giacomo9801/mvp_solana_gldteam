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
} from "@mui/material";
import axios from "axios";
import CryptoJS from "crypto-js"; // Import crypto-js

const connectionUrl = "https://api.devnet.solana.com";
const commitment = "finalized";

const UploadDocuments = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uri, setUri] = useState("");
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

  const steps = ["Carica immagine", "Inserisci i dati", "Mint documento su blockchain"];

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
      console.log("Image upload successful:", myUri);

      handleNext();
    } catch (err) {
      setError("Error uploading image: " + err.message);
      console.error("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };

  const createMetadata = async () => {
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
    let tx = createNft(umi2, {
      symbol: "MVPGLD",
      mint,
      name,
      uri,
      sellerFeeBasisPoints,
    });

    let result = await tx.sendAndConfirm(umi2);
    const signature = base58.deserialize(result.signature);
    console.log(signature);
    console.log("NFT minted successfully:", result);
    handleNext();
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
      <header className="App-header">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <div>
            <label htmlFor="imageInput">Seleziona la tua immagine: </label>
            <br />
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
           
            {selectedImage && (
              <div className="image-preview">
                <br />
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  width={100}
                  height={100}
                  
                />
              </div>
            )}
            <Button onClick={uploadImage} disabled={loading}>
              {loading ? "Uploading..." : "Upload immagine"}
            </Button>
          </div>
        )}
        {activeStep === 1 && uploadResult && (
          <div>
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
            <Button onClick={createMetadata} disabled={loading}>
              {loading ? "Caricamento..." : "Crea metadati"}
            </Button>
          </div>
        )}
        {activeStep === 2 && uri && (
          <div>
            <Typography variant="h6">Ready to Mint your NFT!</Typography>
            <Button onClick={mintNFT} disabled={loading}>
              {loading ? "Minting..." : "Mint NFT"}
            </Button>
          </div>
        )}
        {activeStep < steps.length - 1 && (
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Indietro
          </Button>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </header>
    </div>
  );
};

export default UploadDocuments;
