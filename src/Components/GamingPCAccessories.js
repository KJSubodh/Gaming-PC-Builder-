import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Drawer,
  Paper,
  TextField,
  Badge,
  Button,
  Container,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import Payment from './Payment';
import { useCart } from '../context/CartContext';

// Data imports
import mouseData from '../data/mice.json';
import keyboardData from '../data/keyboards.json';
import monitorData from '../data/monitor.json';
import headphoneData from '../data/headphones.json';
import microphoneData from '../data/microphone.json';
import webcamData from '../data/webcam.json';

// Helper to extract price from a string
const extractPrice = (priceValue) => {
  if (!priceValue) return 0;
  const cleaned = priceValue.toString().replace(/[^0-9.]/g, '');
  return cleaned ? parseFloat(cleaned) : 0;
};

// Helper to adjust image URLs
const getProperImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('/') ? process.env.PUBLIC_URL + url : url;
};

// --------------------------
// Helper functions for formatting keys and values
// --------------------------

// Default formatting: remove underscores and convert to Title Case.
const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Special formatting for certain keys
const specialFormats = {
  'dpi': { label: 'DPI', unit: ' DPI' },
  'fps': { label: 'FPS', unit: ' FPS' },
  'hz': { label: 'Frequency', unit: ' Hz' },
  'refresh_rate_hz': { label: 'Refresh Rate', unit: ' Hz' },
  'response_time_ms': { label: 'Response Time', unit: ' ms' },
  'panel_type': { label: 'Panel Type', unit: '' },
  'pickup_pattern': { label: 'Pickup Pattern', unit: '' },
  'rgb_lighting': { label: 'RGB Lighting', unit: '' },
};

// --------------------------
// Styled components
// --------------------------

// Gradient button updated to match BuildYourOwnPC's styling
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff9800, #f44336)',
  borderRadius: theme.spacing(1.5),
  color: '#fff',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(244,67,54,0.3)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 10px 4px rgba(244,67,54,0.3)',
  },
}));

// Styled Card modified to reflect the BuildYourOwnPC OptionCard styling
const StyledCard = styled(Card)(({ theme }) => ({
  animation: '0.5s ease-in-out',
  cursor: 'pointer',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
}));

// TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`accessory-tabpanel-${index}`}
      aria-labelledby={`accessory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

// --------------------------
// Component
// --------------------------
const GamingPCAccessories = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Remove search bar widget from header
  const [searchQuery, setSearchQuery] = useState('');

  // Active tab state for categories
  const [activeTab, setActiveTab] = useState(0);

  // Cart drawer visibility state
  const [showCart, setShowCart] = useState(false);

  // User details for payment
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');

  // Define accessory categories and their respective data
  const accessoryCategories = [
    { label: 'Mouse', data: mouseData, key: 'Name', type: 'Mouse' },
    { label: 'Keyboard', data: keyboardData, key: 'name', type: 'Keyboard' },
    { label: 'Monitor', data: monitorData, key: 'model', type: 'Monitor' },
    { label: 'Headphones', data: headphoneData['GamingHeadphones/Earphones'], key: 'name', type: 'Headphones' },
    { label: 'Microphone', data: microphoneData.microphones, key: 'name', type: 'Microphone' },
    { label: 'Webcam', data: webcamData.webcams, key: 'name', type: 'Webcam' },
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle product selection
  const handleSelectProduct = (categoryType, productName, productData) => {
    addToCart({
      type: categoryType,
      name: productName,
      price: extractPrice(productData.price),
    });
  };

  // Render all properties from a product item
  // The price field is rendered on top in bold. Special keys are handled.
  const renderAllData = (item, displayKey) => {
    return (
      <Box sx={{ mt: 1 }}>
        {item.price && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>
            Price: {item.price}
          </Typography>
        )}
        {Object.entries(item).map(([key, value]) => {
          if (key === displayKey || key === 'urls' || key === 'price') return null;
          const lowerKey = key.toLowerCase();
          if (specialFormats.hasOwnProperty(lowerKey)) {
            const { label, unit } = specialFormats[lowerKey];
            return (
              <Typography variant="body2" color="text.secondary" key={key} sx={{ mt: 0.5 }}>
                <strong>{label}:</strong> {value}{unit}
              </Typography>
            );
          }
          return (
            <Typography variant="body2" color="text.secondary" key={key} sx={{ mt: 0.5 }}>
              <strong>{formatKey(key)}:</strong> {value}
            </Typography>
          );
        })}
      </Box>
    );
  };

  // Render product grid based on active category and search filter
  const renderProducts = (data, displayKey, categoryType) => {
    const filteredData = searchQuery
      ? data.filter((item) =>
          item[displayKey].toLowerCase().includes(searchQuery.toLowerCase())
        )
      : data;
    return (
      <Grid container spacing={3}>
        {filteredData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              {item.urls && item.urls.length > 0 && (
                <CardMedia
                  component="img"
                  image={getProperImageUrl(item.urls[0])}
                  alt={item[displayKey]}
                  sx={{
                    height: 180,
                    objectFit: 'contain',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {item[displayKey]}
                </Typography>
                {renderAllData(item, displayKey)}
              </CardContent>
              <CardActions>
                <GradientButton
                  size="small"
                  fullWidth
                  onClick={() => handleSelectProduct(categoryType, item[displayKey], item)}
                >
                  Add to Cart
                </GradientButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      {/* Header with exact App.js style (logo, title, and cart icon; search bar removed) */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'rgba(34,34,34,0.75)',
          backdropFilter: 'blur(6px)',
          boxShadow: 'none',
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Box
                  component="img"
                  src="/123.jpg"
                  alt="Logo"
                  sx={{ height: 60, mr: 2 }}
                />
              </Link>
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                BuildYourOwnPC
              </Typography>
            </Box>
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{
                ml: 2,
                transform: 'scale(1)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon fontSize="large" />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Container */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          {accessoryCategories.map((category, index) => (
            <Tab key={index} label={category.label} />
          ))}
        </Tabs>

        {accessoryCategories.map((category, index) => (
          <TabPanel value={activeTab} index={index} key={index}>
            {renderProducts(category.data, category.key, category.type)}
          </TabPanel>
        ))}
      </Box>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={showCart}
        onClose={() => setShowCart(false)}
      >
        <Box
          sx={{
            width: { xs: 300, sm: 400 },
            p: 3,
            height: '100%',
            bgcolor: 'rgba(255,255,255,0.95)',
            overflowY: 'auto',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ borderBottom: '2px solid #ccc', pb: 1, mb: 2 }}
          >
            Your Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography variant="body1" sx={{ my: 2 }}>
              Your cart is empty.
            </Typography>
          ) : (
            cart.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  mb: 1,
                  bgcolor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="body1">
                  {item.type}: {item.name} - ₹{parseFloat(item.price).toFixed(2)}
                </Typography>
                <IconButton
                  onClick={() => removeFromCart(item.cart_id)}
                  color="error"
                  sx={{
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}

          {/* User Details Form */}
          <Paper
            sx={{
              mt: 3,
              p: 2,
              bgcolor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Enter Your Details
            </Typography>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              margin="normal"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Paper>

          {/* Payment Section */}
          <Box sx={{ mt: 3 }}>
            <Payment
              cart={cart}
              totalAmount={cart.reduce((sum, item) => sum + extractPrice(item.price), 0)}
              userDetails={{ name: userName, phone: userPhone, address: userAddress }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default GamingPCAccessories;
