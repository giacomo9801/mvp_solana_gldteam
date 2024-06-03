import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import CryptoJS from "crypto-js";

const DecryptDocuments = () => {
  const router = useRouter();
  const [decryptedMetadata, setDecryptedMetadata] = useState(null);

  useEffect(() => {
    // Simulazione di dati dei metadati criptati
    const encryptedMetadata = {
      // Nome: "NFTGLD",
      Oggetto: "U2FsdGVkX1/5uKTdn6WOPtN4I6IEnqq0zheGA/xTkdQ=",
      Data: "U2FsdGVkX1/mQerWtfTHMi9Ki+cQe3LXQv+dwGdXyKs=",
      Descrizione: "U2FsdGVkX1/LmmpYgrXJrw+fTgdEh+GU5grr/DBGuz8=",
      Titolo: "U2FsdGVkX19rthDpVpG/cqsLNQygf6d37zXXDKofasc="
      
      // Aggiungi altri campi dei metadati criptati qui...
    };

    // Funzione per decriptare un valore specifico
    const decryptValue = (encryptedValue, encryptionKey) => {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, encryptionKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue;
    };

    // Decriptazione dei metadati
    const decryptionKey = "static-encryption-key"; // Chiave di decriptazione statica
    const decrypted = {};
    for (const key in encryptedMetadata) {
      if (Object.hasOwnProperty.call(encryptedMetadata, key)) {
        decrypted[key] = decryptValue(encryptedMetadata[key], decryptionKey);
      }
    }

    setDecryptedMetadata(decrypted);
  }, []);

  return (
    <div>
      <Typography variant="h4">Decrypted Metadata</Typography>
      {decryptedMetadata && (
        <div>
          {/* <Typography variant="h6">Nome: {decryptedMetadata.Nome}</Typography> */}
          <Typography variant="body1">Descrizione: {decryptedMetadata.Oggetto}</Typography>
          <Typography variant="body1">Descrizione: {decryptedMetadata.Titolo}</Typography>
          <Typography variant="body1">Descrizione: {decryptedMetadata.Descrizione}</Typography>
          <Typography variant="body1">Data: {decryptedMetadata.Data}</Typography>
          {/* Aggiungi altre visualizzazioni dei metadati decriptati qui... */}
        </div>
      )}
    </div>
  );
};

export default DecryptDocuments;
