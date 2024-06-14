import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Button,
  Radio,
  RadioGroup,
  Typography,
  Switch,
  FormControlLabel,
  Backdrop,
} from "@mui/material";
import Atropos from "atropos/react";
import wallet from "./wallet.json";
import "atropos/css";
import * as web3 from "@solana/web3.js";
import { Blocks } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer e toast
import "react-toastify/dist/ReactToastify.css";

const SubscriptionSelector = ({ initialSelectedPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
  const [isVerifying, setIsVerifying] = useState(true);
  const [currency, setCurrency] = useState("EUR");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [isPayingInSol, setIsPayingInSol] = useState(false); // Stato per il pulsante "Paga in SOL"
  const router = useRouter();

  useEffect(() => {
    const verifylogin = sessionStorage.getItem("verifylogin") === "true";
    const verifywallet = sessionStorage.getItem("verifywallet") === "true";

    if (!verifylogin || !verifywallet) {
      router.push("/");
    } else {
      setIsVerifying(false);
    }
  }, [router]);

  const handleSelectPlan = (event) => {
    const plan = event.target.value;
    if (plan) {
      setSelectedPlan(plan);
      sessionStorage.setItem("subscriptionPlan", plan);
    } else {
      console.error("Il valore del piano selezionato non è valido:", plan);
    }
  };

  const handleContinue = () => {
    if (selectedPlan && transactionCompleted) {
      sessionStorage.setItem("verifySubscription", "true");
      router.push("/homepage");
    }
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.checked ? "SOL" : "EUR");
  };

  const handlePayInSol = () => {
    setShowModal(true);
  };

  const connection = new web3.Connection(
    "https://api.devnet.solana.com",
    "finalized"
  );
  const toAddress = "3EwusDY4gJHu6ED1v4gsjZEF5AA1C7VA6HCr1UzBJaw2";
  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setIsPayingInSol(true); // Disabilita il pulsante "Paga in SOL"
    const selectedPlanData = plans.find((plan) => plan.value === selectedPlan);
    const fromKeyArray = new Uint8Array(wallet);
    const from = web3.Keypair.fromSecretKey(fromKeyArray);

    const lamports =
      parseFloat(selectedPlanData.price.SOL) * web3.LAMPORTS_PER_SOL;

    try {
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: new web3.PublicKey(toAddress),
          lamports: lamports,
        })
      );

      const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
      );

      // Notifica alla fine della transazione
      toast.success(
        <a
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visualizza la transazione
        </a>,
        {
          autoClose: 6000, // Durata notifica in millisecondi (8 secondi)
        }
      );

      setTransactionCompleted(true);
    } catch (error) {
      console.error("Errore durante la transazione", error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const plans = [
    {
      name: "Basic",
      price: { EUR: "€10 al mese", SOL: "0.2 Sol al mese" },
      benefits: ["Accesso limitato ai documenti", "Supporto base"],
      value: "basic",
      image: "/solanaicon2.png",
    },
    {
      name: "Standard",
      price: { EUR: "€20 al mese", SOL: "0.4 Sol al mese" },
      benefits: ["Accesso a tutti i documenti", "Supporto standard"],
      value: "standard",
      image: "/solanaicon2.png",
    },
    {
      name: "Premium",
      price: { EUR: "€30 al mese", SOL: "0.6 Sol al mese" },
      benefits: [
        "Accesso a tutti i documenti",
        "Supporto prioritario",
        "Funzionalità extra",
      ],
      value: "premium",
      image: "/solanaicon2.png",
    },
  ];

  if (isVerifying) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#333",
          color: "#fff",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/solanawp.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        p: 2,
      }}
    >
      <Container>
        <Typography variant="h4" gutterBottom>
          Scegli il tuo abbonamento
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={currency === "SOL"}
              onChange={handleCurrencyChange}
              color="primary"
            />
          }
          label={`Mostra prezzi in ${currency === "EUR" ? "Sol" : "€"}`}
          sx={{ mb: 2 }}
        />
        <RadioGroup
          row
          value={selectedPlan}
          onChange={handleSelectPlan}
          sx={{ display: "flex", justifyContent: "center", gap: 2 }}
        >
          {plans.map((plan, index) => (
            <Atropos
              key={plan.value}
              activeOffset={20}
              shadowScale={0.8}
              className="atropos-card"
            >
              <Card
                sx={{
                  width: index === 1 ? 250 : 200,
                  margin: 2,
                  padding: 2,
                  backgroundColor:
                    selectedPlan === plan.value
                      ? "rgba(0, 123, 255, 0.2)"
                      : "rgba(5, 40, 76, 0.7)",
                  borderRadius: 4,
                  textAlign: "center",
                  boxShadow:
                    selectedPlan === plan.value
                      ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                      : "none",
                  color: "#fff",
                }}
              >
                <CardContent>
                  {index === 1 && (
                    <Box
                      sx={{
                        backgroundColor: "gold",
                        borderRadius: 2,
                        padding: "2px 8px",
                        color: "#000",
                        fontWeight: "bold",
                      }}
                    >
                      Il più richiesto
                    </Box>
                  )}
                  <img
                    src={plan.image}
                    alt={`${plan.name} plan`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px",
                      marginBottom: "1rem",
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {plan.price[currency]}
                  </Typography>
                  <Radio
                    defaultChecked={selectedPlan === plan.value}
                    onChange={handleSelectPlan}
                    value={plan.value}
                    name="subscriptionPlan"
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": {
                        color: "#fff",
                      },
                    }}
                  />
                  {plan.benefits.map((benefit, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      • {benefit}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Atropos>
          ))}
        </RadioGroup>
        {selectedPlan && (
          <>
            {currency === "EUR" ? (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => {
                  /* funzione di pagamento con Stripe */
                }}
                disabled={transactionCompleted}
              >
                Paga con Stripe
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handlePayInSol}
                disabled={transactionCompleted || isPayingInSol} // Disabilita il pulsante se la transazione è completata o in corso
              >
                Paga in SOL
              </Button>
            )}
          </>
        )}
        {selectedPlan && (
          <Box variant="h6" gutterBottom sx={{ mt: 2 }}>
            Hai selezionato il piano: {selectedPlan}
          </Box>
        )}
        {transactionCompleted && (
          <Button variant="contained" onClick={handleContinue} sx={{ mt: 2 }}>
            Continua
          </Button>
        )}
      </Container>

      <Backdrop
        open={showModal}
        onClick={() => setShowModal(false)}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Sfondo sfocato
          animationDuration: "4000ms", // Durata dell'animazione in millisecondi (4 secondi)
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "black",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Blocks
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </Box>
          ) : (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                Conferma Pagamento
              </Typography>
              <Typography variant="body1" gutterBottom>
                {sessionStorage.getItem("email") || ""}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Stai pagando{" "}
                {plans.find((plan) => plan.value === selectedPlan)?.price.SOL}{" "}
                SOL all'indirizzo:
              </Typography>
              <Typography variant="body2" gutterBottom>
                {toAddress}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPayment}
                sx={{ mt: 2 }}
              >
                Conferma la transazione
              </Button>
            </>
          )}
        </Box>
      </Backdrop>

      {/* ToastContainer per mostrare le notifiche */}
      <ToastContainer />
    </Box>
  );
};

export async function getServerSideProps() {
  const initialSelectedPlan = null;

  return {
    props: {
      initialSelectedPlan,
    },
  };
}

export default SubscriptionSelector;
