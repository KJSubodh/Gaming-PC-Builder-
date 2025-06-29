import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  FormControlLabel,
  Switch,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import Button from '@mui/material/Button';
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

// Custom styled OptionCard with improved styling
const OptionCard = styled(Card)(({ theme, selected }) => ({
  animation: `${fadeIn} 0.5s ease-in-out`,
  border: selected ? '2px solid #ff9800' : 'none',
  cursor: 'pointer',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  }
}));

// Custom styled GradientButton for primary actions
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff9800, #f44336)',
  borderRadius: theme.spacing(1.5),
  color: '#fff',
  padding: theme.spacing(1, 3),
  boxShadow: '0 3px 5px 2px rgba(244,67,54, .3)',
  textTransform: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 10px 4px rgba(244,67,54, .3)',
  }
}));

// Custom styled Paper for help texts with gradient background
const HelpPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #fceabb, #f8b500)',
  color: '#333',
  marginBottom: theme.spacing(2)
}));

// Steps for the build process
const steps = [
  "Motherboard",
  "CPU",
  "GPU",
  "RAM",
  "PSU",
  "Case",
  "Cooling",
  "Storage",
  "Review & Build"
];

const BuildYourOwnPC = () => {
  const { addToCart } = useCart();

  // Wizard step state
  const [activeStep, setActiveStep] = useState(0);

  // Component selections
  const [motherboard, setMotherboard] = useState('');
  const [cpu, setCpu] = useState('');
  const [gpu, setGpu] = useState('');
  const [ram, setRam] = useState('');
  const [psu, setPsu] = useState('');
  const [pcCase, setPcCase] = useState('');
  const [cooling, setCooling] = useState('');
  const [primaryStorage, setPrimaryStorage] = useState('');
  const [secondaryStorageType, setSecondaryStorageType] = useState('');
  const [secondaryStorageOption, setSecondaryStorageOption] = useState('');

  // Build completion state
  const [isBuilt, setIsBuilt] = useState(false);

  // Beginner mode toggle
  const [beginnerMode, setBeginnerMode] = useState(true);

  // Alert state for notifications
  const [alertMessage, setAlertMessage] = useState(null);

  // Helper: adjust image URLs
  const getProperImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('/') ? process.env.PUBLIC_URL + url : url;
  };

  // Helper: get a description for an item
  const getDescription = (item) => {
    if (item.description) return item.description;
    if (item.specs) {
      if (typeof item.specs === 'object') return Object.values(item.specs).join(', ');
      return item.specs;
    }
    return '';
  };

  // Render options function with revamped styling for each product
  const renderOptions = (data, displayKey, priceKey, currentSelection, onSelect, category) => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {data.map((item, index) => {
        const isSelected = currentSelection === item[displayKey];
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <OptionCard selected={isSelected ? 1 : 0} onClick={() => onSelect(item[displayKey])}>
              {item.urls && item.urls.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={getProperImageUrl(item.urls[0])}
                  alt={item[displayKey]}
                  sx={{ objectFit: 'contain', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item[displayKey]}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {getDescription(item)}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'medium' }}>
                  ₹{item[priceKey]}
                </Typography>
                <GradientButton
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      type: category,
                      name: item[displayKey],
                      price: parseFloat(item[priceKey]) || 0,
                    });
                    setAlertMessage(`${item[displayKey]} added to cart!`);
                    setTimeout(() => setAlertMessage(null), 3000);
                  }}
                >
                  Add to Cart
                </GradientButton>
              </CardContent>
            </OptionCard>
          </Grid>
        );
      })}
    </Grid>
  );

  // Help text for each step
  const getHelpText = (step) => {
    if (!beginnerMode) return null;
    let helpContent = '';
    switch (step) {
      case 0:
        helpContent = "The motherboard is the main board connecting all your components.";
        break;
      case 1:
        helpContent = "The CPU acts as the brain of your PC.";
        break;
      case 2:
        helpContent = "The GPU handles graphics rendering for smooth visuals.";
        break;
      case 3:
        helpContent = "RAM provides fast memory for your applications.";
        break;
      case 4:
        helpContent = "The PSU provides stable power to all components.";
        break;
      case 5:
        helpContent = "The case houses and protects your components.";
        break;
      case 6:
        helpContent = "Cooling solutions maintain optimal temperatures for performance.";
        break;
      case 7:
        helpContent = "Select your primary storage for the OS and a secondary drive for extra space.";
        break;
      case 8:
        helpContent = "Review your selections before finalizing your build.";
        break;
      default:
        helpContent = "";
    }
    return (
      <HelpPaper elevation={3}>
        <Typography variant="body2">
          <strong>{steps[step]}:</strong> {helpContent}
        </Typography>
      </HelpPaper>
    );
  };

  // Function to add selected components to cart
  const buildPC = () => {
    const addComponentToCart = (type, data, selectedItem, keyName, priceKey) => {
      if (!selectedItem) return;
      const item = data.find((p) => p[keyName] === selectedItem);
      if (item) {
        addToCart({
          type,
          name: item[keyName],
          price: parseFloat(item[priceKey] || item.price) || 0,
        });
      }
    };

    addComponentToCart("Motherboard", mbData, motherboard, 'name', 'pricing (INR)');
    addComponentToCart("CPU", cpuData.gaming_cpus, cpu, 'name', 'price');
    addComponentToCart("GPU", gpuData, gpu, 'name', 'pricing (INR)');
    addComponentToCart("RAM", ramData, ram, 'name', 'pricing (INR)');
    addComponentToCart("PSU", psuData, psu, 'name', 'pricing (INR)');
    addComponentToCart("Case", Object.values(casesData['Gaming PC Cases']).flat(), pcCase, 'Name', 'Price');
    addComponentToCart("Cooling", Object.values(coolingData['Cooling Solutions']).flat(), cooling, 'Name', 'Price');
    addComponentToCart("Primary Storage", storageData["NVMe PCIe M.2 (Primary Storage)"], primaryStorage, 'Name', 'Price (INR)');
    if (secondaryStorageType && secondaryStorageOption) {
      addComponentToCart("Secondary Storage", storageData[`${secondaryStorageType} (Secondary Storage)`], secondaryStorageOption, 'Name', 'Price (INR)');
    }
    setIsBuilt(true);
  };

  // Render step content based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            {getHelpText(0)}
            <Typography variant="h5" gutterBottom>Choose a Motherboard</Typography>
            {renderOptions(mbData, 'name', 'pricing (INR)', motherboard, setMotherboard, "Motherboard")}
          </>
        );
      case 1:
        return (
          <>
            {getHelpText(1)}
            <Typography variant="h5" gutterBottom>Choose a CPU</Typography>
            {renderOptions(cpuData.gaming_cpus, 'name', 'price', cpu, setCpu, "CPU")}
          </>
        );
      case 2:
        return (
          <>
            {getHelpText(2)}
            <Typography variant="h5" gutterBottom>Choose a GPU</Typography>
            {renderOptions(gpuData, 'name', 'pricing (INR)', gpu, setGpu, "GPU")}
          </>
        );
      case 3:
        return (
          <>
            {getHelpText(3)}
            <Typography variant="h5" gutterBottom>Choose RAM</Typography>
            {renderOptions(ramData, 'name', 'pricing (INR)', ram, setRam, "RAM")}
          </>
        );
      case 4:
        return (
          <>
            {getHelpText(4)}
            <Typography variant="h5" gutterBottom>Choose a PSU</Typography>
            {renderOptions(psuData, 'name', 'pricing (INR)', psu, setPsu, "PSU")}
          </>
        );
      case 5:
        return (
          <>
            {getHelpText(5)}
            <Typography variant="h5" gutterBottom>Choose a Case</Typography>
            {renderOptions(Object.values(casesData['Gaming PC Cases']).flat(), 'Name', 'Price', pcCase, setPcCase, "Case")}
          </>
        );
      case 6:
        return (
          <>
            {getHelpText(6)}
            <Typography variant="h5" gutterBottom>Choose a Cooling Solution</Typography>
            {renderOptions(Object.values(coolingData['Cooling Solutions']).flat(), 'Name', 'Price', cooling, setCooling, "Cooling")}
          </>
        );
      case 7:
        return (
          <>
            {getHelpText(7)}
            <Typography variant="h5" gutterBottom>Choose Storage Options</Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Primary Storage
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Primary Storage is for booting your OS.
            </Typography>
            {renderOptions(
              storageData["NVMe PCIe M.2 (Primary Storage)"],
              'Name',
              'Price (INR)',
              primaryStorage,
              setPrimaryStorage,
              "Primary Storage"
            )}
            <Typography variant="subtitle1" gutterBottom mt={2} sx={{ fontWeight: 'bold' }}>
              Secondary Storage
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Secondary Storage provides extra space.
            </Typography>
            {!secondaryStorageType ? (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.keys(storageData)
                  .filter(key => key.includes('(Secondary Storage)'))
                  .map((storageKey, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <GradientButton
                        fullWidth
                        onClick={() => setSecondaryStorageType(storageKey.replace(' (Secondary Storage)', ''))}
                      >
                        {storageKey.replace(' (Secondary Storage)', '')}
                      </GradientButton>
                    </Grid>
                  ))
                }
              </Grid>
            ) : (
              <>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Selected Secondary Type: {secondaryStorageType}
                </Typography>
                {renderOptions(
                  storageData[`${secondaryStorageType} (Secondary Storage)`] || [],
                  'Name',
                  'Price (INR)',
                  secondaryStorageOption,
                  setSecondaryStorageOption,
                  `${secondaryStorageType} (Secondary Storage)`
                )}
              </>
            )}
          </>
        );
      case 8:
        return (
          <>
            {getHelpText(8)}
            <Typography variant="h5" gutterBottom>Review Your Build</Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2, background: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="subtitle1">Motherboard: {motherboard || 'Not selected'}</Typography>
              <Typography variant="subtitle1">CPU: {cpu || 'Not selected'}</Typography>
              <Typography variant="subtitle1">GPU: {gpu || 'Not selected'}</Typography>
              <Typography variant="subtitle1">RAM: {ram || 'Not selected'}</Typography>
              <Typography variant="subtitle1">PSU: {psu || 'Not selected'}</Typography>
              <Typography variant="subtitle1">Case: {pcCase || 'Not selected'}</Typography>
              <Typography variant="subtitle1">Cooling: {cooling || 'Not selected'}</Typography>
              <Typography variant="subtitle1">Primary Storage: {primaryStorage || 'Not selected'}</Typography>
              <Typography variant="subtitle1">
                Secondary Storage:{" "}
                {secondaryStorageType
                  ? `${secondaryStorageType} - ${secondaryStorageOption || 'Not selected'}`
                  : 'Not selected'}
              </Typography>
            </Paper>
            <GradientButton onClick={buildPC}>
              Build My PC
            </GradientButton>
          </>
        );
      default:
        return "Unknown Step";
    }
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  return (
    <>
      {isBuilt ? (
        <div
          style={{
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${process.env.PUBLIC_URL + '/gamingpcwallpaper.jpg'}) no-repeat center center fixed`,
            backgroundSize: 'cover',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paper sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>PC Build Successful!</Typography>
            <Typography variant="body1">
              Your PC build has been added to your cart.
            </Typography>
            <GradientButton sx={{ mt: 2 }} onClick={() => window.location.reload()}>
              Build Another PC
            </GradientButton>
          </Paper>
        </div>
      ) : (
        <div
          style={{
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${process.env.PUBLIC_URL + '/gamingpcwallpaper.jpg'}) no-repeat center center fixed`,
            backgroundSize: 'cover',
            minHeight: '100vh',
            width: '100%',
          }}
        >
          <Container sx={{ py: 4 }}>
            <Paper sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="h3" align="center" gutterBottom>
                Build Your Own Gaming PC
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={beginnerMode}
                    onChange={(e) => setBeginnerMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Help for Beginners"
                sx={{ mb: 2 }}
              />
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderStepContent(activeStep)}
              <Grid container spacing={2} sx={{ mt: 4 }} justifyContent="center">
                {activeStep > 0 && (
                  <Grid item>
                    <GradientButton onClick={handleBack}>Back</GradientButton>
                  </Grid>
                )}
                {activeStep < steps.length - 1 && (
                  <Grid item>
                    <GradientButton onClick={handleNext}>Next</GradientButton>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Container>
        </div>
      )}
      <Snackbar
        open={Boolean(alertMessage)}
        message={alertMessage}
        autoHideDuration={3000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default BuildYourOwnPC;
