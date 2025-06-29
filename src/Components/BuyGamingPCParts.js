import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Payment from './Payment';
import { useCart } from '../context/CartContext';

// Import product data
import cpuData from '../data/cpu.json';
import gpuData from '../data/gpu.json';
import ramData from '../data/ram.json';
import psuData from '../data/psu.json';
import casesData from '../data/cases.json';
import coolingData from '../data/cooling.json';
import storageData from '../data/storage.json';
import mbData from '../data/mb.json';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components for a modern, top–notch look
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%)',
}));

const StyledCard = styled(Card)(({ theme, selected }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  cursor: 'default',
  animation: `${fadeIn} 0.5s ease-in-out`,
  border: selected ? '2px solid #2196F3' : 'none',
  transition: 'transform 0.3s, box-shadow 0.3s',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'background 0.3s, transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

// Define the tabs (categories)
const categoryTabs = [
  { label: 'Motherboard', key: 'motherboard' },
  { label: 'CPU', key: 'cpu' },
  { label: 'GPU', key: 'gpu' },
  { label: 'RAM', key: 'ram' },
  { label: 'PSU', key: 'psu' },
  { label: 'Case', key: 'pcCase' },
  { label: 'Cooling', key: 'cooling' },
  { label: 'Primary Storage', key: 'primaryStorage' },
  { label: 'Secondary Storage', key: 'secondaryStorage' },
  { label: 'Review & Payment', key: 'review' },
];

const BuyGamingPCParts = () => {
  const { addToCart, cart, removeFromCart } = useCart();
  const [activeTab, setActiveTab] = useState(0);

  // State for selected items
  const [selections, setSelections] = useState({
    motherboard: null,
    cpu: null,
    gpu: null,
    ram: null,
    psu: null,
    pcCase: null,
    cooling: null,
    primaryStorage: null,
    secondaryStorage: { type: null, option: null },
  });

  // User details for payment
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Snackbar state for alerts
  const [alertMessage, setAlertMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Helper to adjust image URLs if needed
  const getProperImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('/') ? process.env.PUBLIC_URL + url : url;
  };

  // Generic function to render a grid of product cards with an explicit Add to Cart button
  const renderOptions = (data, displayKey, priceKey, currentSelection, onSelect) => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {data.map((item, index) => {
        const isSelected = currentSelection && currentSelection[displayKey] === item[displayKey];
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard selected={isSelected ? 1 : 0}>
              {item.urls && item.urls.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={getProperImageUrl(item.urls[0])}
                  alt={item[displayKey]}
                  sx={{ objectFit: 'contain' }}
                />
              )}
              <CardContent>
                <Typography variant="h6">{item[displayKey]}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description ||
                    (item.specs && typeof item.specs === 'object'
                      ? Object.values(item.specs).join(', ')
                      : item.specs)}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  ₹{item[priceKey]}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <StyledButton
                  variant="contained"
                  onClick={() => {
                    onSelect(item);
                    const itemName = item[displayKey];
                    setAlertMessage(`${itemName} added to cart!`);
                    setOpenSnackbar(true);
                  }}
                >
                  Add to Cart
                </StyledButton>
              </Box>
            </StyledCard>
          </Grid>
        );
      })}
    </Grid>
  );

  // Handler for selection – update state and add the item to the cart.
  const handleSelect = (categoryKey, item) => {
    setSelections((prev) => ({ ...prev, [categoryKey]: item }));
    addToCart({
      type: categoryKey,
      name: item[categoryKey === 'pcCase' ? 'Name' : 'name'],
      price: parseFloat(item['pricing (INR)'] || item['price'] || item['Price'] || 0),
    });
  };

  // Special handling for secondary storage (choose type then option)
  const handleSelectSecondaryType = (type) => {
    setSelections((prev) => ({
      ...prev,
      secondaryStorage: { type: type.replace(' (Secondary Storage)', ''), option: null },
    }));
  };
  const handleSelectSecondaryOption = (item) => {
    setSelections((prev) => ({
      ...prev,
      secondaryStorage: { ...prev.secondaryStorage, option: item },
    }));
    addToCart({
      type: 'secondaryStorage',
      name: item['Name'],
      price: parseFloat(item['Price (INR)'] || 0),
    });
    setAlertMessage(`${item['Name']} added to cart!`);
    setOpenSnackbar(true);
  };

  // Render the content based on the current tab.
  const renderTabContent = () => {
    const currentCategory = categoryTabs[activeTab].key;
    switch (currentCategory) {
      case 'motherboard':
        return renderOptions(mbData, 'name', 'pricing (INR)', selections.motherboard, (item) =>
          handleSelect('motherboard', item)
        );
      case 'cpu':
        return renderOptions(cpuData.gaming_cpus, 'name', 'price', selections.cpu, (item) =>
          handleSelect('cpu', item)
        );
      case 'gpu':
        return renderOptions(gpuData, 'name', 'pricing (INR)', selections.gpu, (item) =>
          handleSelect('gpu', item)
        );
      case 'ram':
        return renderOptions(ramData, 'name', 'pricing (INR)', selections.ram, (item) =>
          handleSelect('ram', item)
        );
      case 'psu':
        return renderOptions(psuData, 'name', 'pricing (INR)', selections.psu, (item) =>
          handleSelect('psu', item)
        );
      case 'pcCase':
        return renderOptions(
          Object.values(casesData['Gaming PC Cases']).flat(),
          'Name',
          'Price',
          selections.pcCase,
          (item) => handleSelect('pcCase', item)
        );
      case 'cooling':
        return renderOptions(
          Object.values(coolingData['Cooling Solutions']).flat(),
          'Name',
          'Price',
          selections.cooling,
          (item) => handleSelect('cooling', item)
        );
      case 'primaryStorage':
        return renderOptions(
          storageData["NVMe PCIe M.2 (Primary Storage)"],
          'Name',
          'Price (INR)',
          selections.primaryStorage,
          (item) => handleSelect('primaryStorage', item)
        );
      case 'secondaryStorage':
        return (
          <Box sx={{ mt: 2 }}>
            {!selections.secondaryStorage.type ? (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Select Secondary Storage Type
                </Typography>
                <Grid container spacing={3}>
                  {Object.keys(storageData)
                    .filter((key) => key.includes('(Secondary Storage)'))
                    .map((type, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledCard onClick={() => handleSelectSecondaryType(type)}>
                          <CardContent>
                            <Typography variant="h6">
                              {type.replace(' (Secondary Storage)', '')}
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Grid>
                    ))}
                </Grid>
              </>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {selections.secondaryStorage.type} Options
                </Typography>
                {renderOptions(
                  storageData[`${selections.secondaryStorage.type} (Secondary Storage)`] || [],
                  'Name',
                  'Price (INR)',
                  selections.secondaryStorage.option,
                  handleSelectSecondaryOption
                )}
                <Box sx={{ mt: 1 }}>
                  <StyledButton
                    variant="outlined"
                    onClick={() =>
                      setSelections((prev) => ({
                        ...prev,
                        secondaryStorage: { type: null, option: null },
                      }))
                    }
                  >
                    Change Type
                  </StyledButton>
                </Box>
              </>
            )}
          </Box>
        );
      case 'review':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Review Your Build
            </Typography>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 12 }}>
              <Typography variant="body1">
                <strong>Motherboard:</strong>{' '}
                {selections.motherboard ? selections.motherboard.name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>CPU:</strong> {selections.cpu ? selections.cpu.name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>GPU:</strong> {selections.gpu ? selections.gpu.name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>RAM:</strong> {selections.ram ? selections.ram.name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>PSU:</strong> {selections.psu ? selections.psu.name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>Case:</strong> {selections.pcCase ? selections.pcCase.Name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>Cooling:</strong> {selections.cooling ? selections.cooling.Name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>Primary Storage:</strong>{' '}
                {selections.primaryStorage ? selections.primaryStorage.Name : 'Not selected'}
              </Typography>
              <Typography variant="body1">
                <strong>Secondary Storage:</strong>{' '}
                {selections.secondaryStorage.type
                  ? `${selections.secondaryStorage.type} - ${
                      selections.secondaryStorage.option ? selections.secondaryStorage.option.Name : 'Not selected'
                    }`
                  : 'Not selected'}
              </Typography>
            </Paper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter Your Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Address"
                  value={userDetails.address}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, address: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <StyledButton variant="contained" color="primary">
                Proceed to Payment
              </StyledButton>
              <Payment
                cart={cart}
                totalAmount={cart.reduce(
                  (sum, item) => sum + (Number(item.price) || 0),
                  0
                )}
                userDetails={userDetails}
              />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container sx={{ py: 4, fontFamily: 'Poppins, sans-serif' }}>
      {/* Fixed Cart Icon on the top-right with Badge */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <IconButton onClick={() => setActiveTab(categoryTabs.length - 1)}>
          <Badge badgeContent={cart.length} color="primary">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>
      <StyledPaper>
        <Typography variant="h3" align="center" gutterBottom>
          Buy Gaming PC Parts
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
        >
          {categoryTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        {renderTabContent()}
        {activeTab !== categoryTabs.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <StyledButton
              variant="contained"
              onClick={() => setActiveTab(categoryTabs.length - 1)}
            >
              Review & Payment
            </StyledButton>
          </Box>
        )}
        {activeTab === categoryTabs.length - 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" align="center">
              Your Cart
            </Typography>
            <List>
              {cart.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeFromCart(item.cart_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${item.type}: ${item.name} - ₹${parseFloat(
                      item.price
                    ).toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </StyledPaper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={alertMessage}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      />
    </Container>
  );
};

export default BuyGamingPCParts;
