import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardContent,
  Container,
  Button,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const SubscriptionSelector = ({ initialSelectedPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
  const router = useRouter();

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
    if (selectedPlan) {
      router.push("/associaWallet");
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "€10 al mese",
      benefits: ["Accesso limitato ai documenti", "Supporto base"],
      value: "basic",
      image: "/solanaicon2.png",
    },
    {
      name: "Standard",
      price: "€20 al mese",
      benefits: ["Accesso a tutti i documenti", "Supporto standard"],
      value: "standard",
      image: "/solanaicon2.png",
    },
    {
      name: "Premium",
      price: "€30 al mese",
      benefits: [
        "Accesso a tutti i documenti",
        "Supporto prioritario",
        "Funzionalità extra",
      ],
      value: "premium",
      image: "/solanaicon2.png",
    },
  ];

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
        <RadioGroup
          row
          value={selectedPlan}
          onChange={handleSelectPlan}
          sx={{ display: "flex", justifyContent: "center", gap: 2 }}
        >
          {plans.map((plan, index) => (
            <Card
              key={plan.value}
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
                  {plan.price}
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
          ))}
        </RadioGroup>
        {selectedPlan && (
          <Button variant="contained" onClick={handleContinue} sx={{ mt: 2 }}>
            Continua
          </Button>
        )}
        {selectedPlan && (
          <Box variant="h6" gutterBottom sx={{ mt: 2 }}>
            Hai selezionato il piano: {selectedPlan}
          </Box>
        )}
      </Container>
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
