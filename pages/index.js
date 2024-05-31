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
import {
  publicKey,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import wallet from "./wallet.json";
import { Stepper, Step, StepLabel, Button, TextField, Typography } from "@mui/material";

const connectionUrl = "https://api.devnet.solana.com";
const commitment = "finalized";

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [uri, setUri] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadataValues, setMetadataValues] = useState({
    title: "",
    object: "",
    description: "",
    date: "",
  });

  const steps = ["Upload Image", "Enter Metadata", "Mint NFT"];

  async function initializeUmi(image) {
    const umi = createUmi(connectionUrl, commitment);
    umi.use(irysUploader());

    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
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
      const image = await readFile(selectedImage);
      const myUri = await initializeUmi(image);
      setUploadResult(myUri);
      console.log("Image upload successful:", myUri);
      const assets = await fetchAllDigitalAssetByOwner(umi2, "CdZQgtkT8actnoUpjPPvadKWvSw4gYZ9w9SQeeqY5y6k");
      console.log(assets);

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
      const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
      const myKeypairSigner = createSignerFromKeypair(umi, keypair);
      umi.use(signerIdentity(myKeypairSigner));

      const metadata = {
        name: "NFTGLD",
        symbol: "MVPGLD",
        description: metadataValues.description,
        image: uploadResult,
        attributes: [
          { trait_type: "Object", value: metadataValues.object },
          { trait_type: "Date", value: metadataValues.date },
          { trait_type: "Description", value: metadataValues.description },
          { trait_type: "Title", value: metadataValues.title },
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

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

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
            <label htmlFor="imageInput">Select NFT image:</label>
            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <div className="image-preview">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  width={200}
                  height={200}
                />
              </div>
            )}
            <Button onClick={uploadImage} disabled={loading}>
              {loading ? "Uploading..." : "Upload NFT Image"}
            </Button>
          </div>
        )}
        {activeStep === 1 && uploadResult && (
          <div>
            <TextField
              label="Title"
              name="title"
              value={metadataValues.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Object"
              name="object"
              value={metadataValues.object}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={metadataValues.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={metadataValues.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            <Button onClick={createMetadata} disabled={loading}>
              {loading ? "Uploading..." : "Create Metadata"}
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
            Back
          </Button>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </header>
    </div>
  );
}

export default App;
