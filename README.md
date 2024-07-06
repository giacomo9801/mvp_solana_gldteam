

######## ITALIANO ########

COMANDI PER AVVIARE CORRETTAMENTE IL PROGETTO

1 - npm install
2 - npm run dev

----LOGIN----
email: gld@gmail.com
psw: Test

----ASSOCIA WALLET----
aprire il wallet phantom ed importare la chiave privata presente nel file wallet.json, così possiamo monitorare se tutto funge correttamente (visto che si userà la chiave privata in questo file per tutte le transazioni). Eventualmente potete creare un nuovo wallet e inserire la chiave privata nel file wallet.json.

----ABBONAMENTO----
E' possibile scegliere sia l'abbaonemento con SOL sia EURO, scegliendo quello in EURO nella pagina di STRIPE inserire come carta di credito la seguente: 4242 4242 4242 4242, qualsiasi data di scadenza e qualsiasi CVC. Se non dovesse aprirsi provare a refreshare. Con Sol non ci sono problemi visto che quando collegate il wallet vi airdroppa automaticamente SOL.

----MINT----
Per il mint consiglio di utilizzare come test per l'OCR il file presente nella cartella PUBLIC - FILE_OCR, poi potete anche modificare i valori riscontrati per vedere se il sistema funge correttamente.

----DECRIPTAZIONE----
Viene utilizzata una chiave simmetrica sia per la criptazione che per la decriptazione, quindi non c'è bisogno di inserire una chiave privata per decriptare il file, avviene tutto automaticamente.

Se si prova a navigare nelle pagine senza aver effettuato il login, si verrà reindirizzati alla pagina di login (al momento gestite le pagine del wallet, abbonamento e home).


######## ENGLISH ########

COMMANDS TO SUCCESSFULLY START THE PROJECT

1 - npm install
2 - npm run dev

----LOGIN----
email: gld@gmail.com
psw: Test

----ASSOCIATE WALLET----
Open the Phantom wallet and import the private key found in the wallet.json file, so we can monitor if everything functions correctly (since we'll use the private key in this file for all transactions). Optionally, you can create a new wallet and insert the private key into wallet.json.

----SUBSCRIPTION----
You can choose either the subscription with SOL or EURO. If choosing EURO on the STRIPE page, use the following credit card: 4242 4242 4242 4242, any expiration date, and any CVC. If it doesn't open, try refreshing. There are no issues with SOL as it airdrops SOL automatically when you connect your wallet.

----MINTING----
For minting, it's recommended to use the file located in the PUBLIC - FILE_OCR folder as a test for OCR. You can then modify the encountered values to verify if the system functions correctly.

----DECRYPTION----
A symmetric key is used for both encryption and decryption, so there's no need to input a private key to decrypt the file; it all happens automatically.

If you attempt to navigate pages without logging in, you'll be redirected to the login page (currently managing wallet, subscription, and home pages).



