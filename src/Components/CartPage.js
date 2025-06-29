import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import Payment from "./Payment";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Helper function to format price with Indian comma formatting
const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    address: "",
    houseNumber: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => {
    const num = Number(item.price);
    return sum + (isNaN(num) ? 0 : num) * (item.quantity || 1);
  }, 0);

  const handleCheckout = async () => {
    if (
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.address ||
      !userDetails.houseNumber ||
      !userDetails.city ||
      !userDetails.district ||
      !userDetails.state ||
      !userDetails.pincode
    ) {
      alert("Please fill in all details before checkout.");
      return;
    }
  
    // 🔧 Convert full address into a single string
    const formattedAddress = `
      ${userDetails.houseNumber}, ${userDetails.address}, 
      ${userDetails.city}, ${userDetails.district}, 
      ${userDetails.state} - ${userDetails.pincode}
    `.replace(/\s+/g, ' ').trim();
  
    const response = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: userDetails.name,
        email: userDetails.email,
        phone: `${userDetails.countryCode} ${userDetails.phone}`,
        address: formattedAddress, // ✅ Now a string
        total_price: totalAmount,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity || 1,
          price: Number(item.price) || 0,
        })),
      }),
    });
  
    if (response.ok) {
      clearCart();
      alert("✅ Order placed successfully!");
    } else {
      alert("❌ Error placing order. Try again.");
    }
  };
  

  // Common style for input fields to have rounded corners
  const textFieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px" } };

  return (
    <Box
      sx={{
        backgroundImage: "url('/Cart.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ fontFamily: "'Poppins', sans-serif" }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: "bold", color: "white" }}>
          Your Cart
        </Typography>
        <Grid container spacing={3}>
          {/* Left Column: Cart Items & Delivery Details */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "12px",
              }}
            >
              <Box display="flex" justifyContent="flex-start" mb={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={clearCart}
                  sx={{
                    backgroundColor: "rgba(255,0,0,0.8)",
                    color: "white",
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "red" },
                  }}
                >
                  Clear Cart
                </Button>
              </Box>
              <List>
                {cart.map((item) => (
                  <ListItem
                    key={item.cart_id}
                    secondaryAction={
                      <IconButton onClick={() => removeFromCart(item.cart_id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ borderBottom: "1px solid #eee" }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`₹${formatPrice(item.price)} x ${item.quantity || 1}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Delivery Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email ID"
                    type="email"
                    value={userDetails.email}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, email: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Country Code"
                    value={userDetails.countryCode}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, countryCode: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">🇮🇳</InputAdornment>
                      ),
                    }}
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                    inputProps={{ maxLength: 10 }}
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={userDetails.address}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, address: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="House Number"
                    value={userDetails.houseNumber}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, houseNumber: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={userDetails.city}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, city: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="District"
                    value={userDetails.district}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, district: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  >
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      label="State"
                      value={userDetails.state}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, state: e.target.value })
                      }
                    >
                      {indianStates.map((stateName) => (
                        <MenuItem key={stateName} value={stateName}>
                          {stateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    value={userDetails.pincode}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, pincode: e.target.value })
                    }
                    inputProps={{ maxLength: 6 }}
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Right Column: Order Summary and Payment */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                ₹{totalAmount.toLocaleString("en-IN")}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: "8px",
                  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  color: "white",
                  textTransform: "none",
                  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  },
                }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mt: 2,
                textAlign: "center",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "12px",
              }}
            >
              <Payment
                cart={cart}
                totalAmount={totalAmount}
                userDetails={userDetails}
                onInvoiceGenerated={() => console.log("Invoice generated")}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
