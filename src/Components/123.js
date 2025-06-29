import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Assuming CartContext is correctly implemented
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  InputAdornment,
  TextField,
  Autocomplete,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  CssBaseline,
  Zoom,
  useScrollTrigger,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
  CardContent,
  FormControlLabel,
  Switch,
  Snackbar,
  Divider,
  Chip,
  Avatar,
  Tooltip,
  Fade
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes, alpha, styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Phone as ContactIcon,
  Info as AboutIcon,
  RocketLaunch as FeaturedIcon,
  Build as BuildIcon,
  Memory as PartsIcon,
  Devices as PrebuiltIcon,
  SportsEsports as AccessoriesIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ArrowUpward as ArrowUpwardIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

// Import product data - assuming these paths are correct
import cpuData from '../data/cpu.json';
import gpuData from '../data/gpu.json';
import ramData from '../data/ram.json';
import psuData from '../data/psu.json';
import casesData from '../data/cases.json';
import coolingData from '../data/cooling.json';
import storageData from '../data/storage.json';
import mbData from '../data/mb.json';

// Use the exact same theme from App.js for consistency
let customTheme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.5px'
    },
    h5: {
      fontWeight: 600
    }
  },
  palette: {
    primary: {
      main: '#121212',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ff6d00',
      light: '#ff9e40',
      dark: '#c43c00'
    },
    background: {
      default: '#f5f5f5'
    }
  },
  shape: {
    borderRadius: 12
  },
  transitions: {
    duration: {
      enteringScreen: 300,
      leavingScreen: 200
    }
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0,0,0,0.1)',
    '0px 4px 12px rgba(0,0,0,0.15)',
    ...Array(22).fill('0px 8px 24px rgba(0,0,0,0.2)')
  ]
});

customTheme = responsiveFontSizes(customTheme);

// Scroll to top component (same as App.js)
function ScrollTop({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

// Styled components matching App.js aesthetic
const ComponentCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  border: selected ? `2px solid ${theme.palette.secondary.main}` : '2px solid transparent',
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const BuildYourOwnPC = () => {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // UI states from App.js for header and search
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Component selections state
  const [selections, setSelections] = useState({
    motherboard: null,
    cpu: null,
    gpu: null,
    ram: null,
    psu: null,
    pcCase: null, // Stores the full selected case object
    cooling: null,
    primaryStorage: null,
    secondaryStorageType: null, // Stores the type string, e.g., "SATA SSD"
    secondaryStorageOption: null, // Stores the full selected secondary storage object
  });

  // Build process states
  const [activeStep, setActiveStep] = useState(0);
  const [isBuilt, setIsBuilt] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  // Steps for the build process, defining data source and help text for each
  const steps = [
    { id: 'motherboard', title: 'Motherboard', data: mbData, help: "The foundation of your build. Choose a motherboard compatible with your CPU." },
    { id: 'cpu', title: 'Processor', data: cpuData.gaming_cpus, help: "The brain of your computer. Consider performance needs for gaming or work." },
    { id: 'gpu', title: 'Graphics Card', data: gpuData, help: "Essential for gaming and graphics work. Higher-end cards deliver better visuals." },
    { id: 'ram', title: 'Memory', data: ramData, help: "More RAM allows for better multitasking. 16GB is standard for gaming." },
    { id: 'psu', title: 'Power Supply', data: psuData, help: "Choose a reliable PSU with enough wattage for your components." },
    { id: 'case', title: 'Case', data: Object.values(casesData['Gaming PC Cases']).flat(), help: "Consider size, airflow and aesthetics." },
    { id: 'cooling', title: 'Cooling', data: Object.values(coolingData['Cooling Solutions']).flat(), help: "Keep your system running cool." },
    { id: 'storage', title: 'Storage', data: storageData, help: "SSDs for speed, HDDs for capacity. A combination often works best." },
    { id: 'review', title: 'Review', help: "Double-check your selections before finalizing." },
  ];

  // Scroll to top on component mount and active step change
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on initial load
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when active step changes
  }, [activeStep]);

  // Scroll effect for header (from App.js)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggles mobile drawer open/close
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigates to search results page with the search term
  const executeSearch = (term) => {
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      setSearchTerm('');
    }
  };

  // Product sections for navigation (from App.js)
  const productSections = [
    {
      title: "Build Your Dream PC",
      description: "Customize every component to create your perfect gaming rig.",
      image: "build_your_PC.jpg",
      path: "/build-your-own-pc",
      color: theme.palette.secondary.main,
      icon: <BuildIcon fontSize="large" />
    },
    {
      title: "Premium PC Parts",
      description: "Top-tier components from trusted brands.",
      image: "gaming_PC_parts.jpg",
      path: "/buy-gaming-pc-parts",
      color: '#4a148c',
      icon: <PartsIcon fontSize="large" />
    },
    {
      title: "Pre-Built Systems",
      description: "Expertly assembled, ready-to-ship gaming PCs.",
      image: "custom_built_pc.jpg",
      path: "/buy-custom-built-pc",
      color: '#00695c',
      icon: <PrebuiltIcon fontSize="large" />
    },
    {
      title: "Gaming Accessories",
      description: "Enhance your setup with premium peripherals.",
      image: "gaming_PC_accessories.jpg",
      path: "/gaming-pc-accessories",
      color: '#e65100',
      icon: <AccessoriesIcon fontSize="large" />
    },
  ];

  // Mobile drawer content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h5" sx={{ my: 2, fontWeight: 700, color: theme.palette.secondary.main }}>
        BuildYourOwnPC
      </Typography>
      <List>
        {productSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <ListItem
              button
              component={Link}
              to={section.path}
              sx={{
                borderRadius: 2,
                my: 0.5,
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1)
                }
              }}
            >
              <ListItemIcon sx={{ color: section.color }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          </motion.div>
        ))}

        {/* About Us link */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: productSections.length * 0.1 }}
          whileHover={{ scale: 1.03 }}
        >
          <ListItem
            button
            component={Link}
            to="/about-us"
            sx={{
              borderRadius: 2,
              my: 0.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1)
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              <AboutIcon />
            </ListItemIcon>
            <ListItemText primary="About Us" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>
        </motion.div>

        {/* Contact Us link */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: (productSections.length + 1) * 0.1 }}
          whileHover={{ scale: 1.03 }}
        >
          <ListItem
            button
            component={Link}
            to="/contact-us"
            sx={{
              borderRadius: 2,
              my: 0.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1)
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              <ContactIcon />
            </ListItemIcon>
            <ListItemText primary="Contact Us" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>
        </motion.div>

        {/* Cart link */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: (productSections.length + 2) * 0.1 }}
          whileHover={{ scale: 1.03 }}
        >
          <ListItem
            button
            component={Link}
            to="/cart"
            sx={{
              borderRadius: 2,
              my: 0.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1)
              }
            }}
          >
            <ListItemIcon>
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Your Cart" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>
        </motion.div>
      </List>
    </Box>
  );

  // Helper function to get proper image URL, handling local assets and fallbacks
  const getProperImageUrl = (url) => {
    if (!url) return 'https://placehold.co/180x180/f5f5f5/121212?text=No+Image';
    // Check if the URL is a local path (starts with /) and prepend PUBLIC_URL
    return url.startsWith('/') ? process.env.PUBLIC_URL + url : url;
  };

  // Helper function to get a descriptive text for a component
  const getDescription = (item) => {
    if (item.description) return item.description;
    if (item.specs) {
      // If specs is an object, join its values; otherwise, use directly
      if (typeof item.specs === 'object') return Object.values(item.specs).join(', ');
      return item.specs;
    }
    return 'No description available.';
  };

  // Handles selection of a component for a given step
  const handleSelectComponent = (stepId, item) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      // Special handling for secondary storage type and option selection
      if (stepId === 'secondaryStorageType') {
        newSelections.secondaryStorageType = item; // item here is the type string (e.g., "SATA SSD")
        newSelections.secondaryStorageOption = null; // Reset secondary option when type changes
      } else if (stepId === 'secondaryStorageOption') {
        newSelections.secondaryStorageOption = item; // item here is the full storage object
      } else {
        newSelections[stepId] = item; // For other components, store the full selected item object
      }
      return newSelections;
    });

    // Auto-advance to the next step, unless it's a secondary storage type selection
    // (we wait for the actual storage option to be selected before advancing)
    if (stepId !== 'secondaryStorageType' && activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Function to add all selected components to the cart
  const buildPC = () => {
    // Helper to add a single component to cart
    const addComponentToCart = (type, item, priceKey, nameKey = 'name') => {
      if (item) {
        // Handle price string with commas and parse to float
        const price = parseFloat(String(item[priceKey]).replace(/,/g, '')) || 0;
        addToCart({
          type,
          name: item[nameKey],
          price: price,
        });
      }
    };

    // Add Motherboard
    addComponentToCart("Motherboard", selections.motherboard, 'pricing (INR)');
    // Add CPU
    addComponentToCart("CPU", selections.cpu, 'price');
    // Add GPU
    addComponentToCart("GPU", selections.gpu, 'pricing (INR)');
    // Add RAM
    addComponentToCart("RAM", selections.ram, 'pricing (INR)');
    // Add PSU
    addComponentToCart("PSU", selections.psu, 'pricing (INR)');

    // Add Case - using 'Name' and 'Price' keys as per cases.json
    addComponentToCart("Case", selections.pcCase, 'Price', 'Name');

    // Add Cooling - using 'Name' and 'Price' keys as per cooling.json
    addComponentToCart("Cooling", selections.cooling, 'Price', 'Name');

    // Add Primary Storage
    addComponentToCart("Primary Storage", selections.primaryStorage, 'Price (INR)', 'Name');

    // Add Secondary Storage if selected
    if (selections.secondaryStorageType && selections.secondaryStorageOption) {
      addComponentToCart("Secondary Storage", selections.secondaryStorageOption, 'Price (INR)', 'Name');
    }

    setIsBuilt(true); // Set build as complete
  };

  // Renders component options for a given step
  const renderComponentOptions = (data, displayKey, priceKey, selectedItem, stepId) => {
    // Ensure data is an array before mapping
    if (!data || !Array.isArray(data)) {
      console.error(`Error: Component data for step ${stepId} is not an array or is null.`, data);
      return <Typography color="error">Error: Component data not available.</Typography>;
    }

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {data.map((item, index) => {
          let isSelected = false;
          // Determine if the current item is selected based on stepId and item structure
          if (selectedItem) {
            // For cases, cooling, and storage, compare by 'Name'
            if (['case', 'cooling', 'primaryStorage', 'secondaryStorageOption'].includes(stepId)) {
              isSelected = selectedItem.Name === item.Name;
            } else {
              // For other components (CPU, GPU, RAM, PSU, MB), compare by 'name'
              isSelected = selectedItem.name === item.name;
            }
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ComponentCard
                  selected={isSelected}
                  onClick={() => handleSelectComponent(stepId, item)} // Pass the full item object
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={getProperImageUrl(item.urls?.[0])} // Use the first URL if available
                    alt={item[displayKey]}
                    sx={{
                      objectFit: 'contain',
                      backgroundColor: alpha(theme.palette.secondary.light, 0.05),
                      p: 2
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {item[displayKey]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {getDescription(item)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                        ₹{item[priceKey]}
                      </Typography>
                      {isSelected && (
                        <Chip
                          label="Selected"
                          color="primary"
                          size="small"
                          sx={{ backgroundColor: theme.palette.secondary.main, color: 'white' }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </ComponentCard>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Renders the storage selection section, including primary and secondary options
  const renderStorageOptions = () => {
    return (
      <>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
          Primary Storage (OS Drive)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Fast NVMe SSD recommended for your operating system and frequently used applications.
        </Typography>
        {renderComponentOptions(
          storageData["NVMe PCIe M.2 (Primary Storage)"],
          'Name',
          'Price (INR)',
          selections.primaryStorage,
          'primaryStorage'
        )}

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6 }}>
          Secondary Storage
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Additional storage for games, media, and other files.
        </Typography>

        {!selections.secondaryStorageType ? (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Choose storage type:
            </Typography>
            <Grid container spacing={2}>
              {Object.keys(storageData)
                .filter(key => key.includes('(Secondary Storage)'))
                .map((storageKey, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleSelectComponent('secondaryStorageType', storageKey.replace(' (Secondary Storage)', ''))}
                      sx={{
                        py: 3,
                        textTransform: 'none',
                        borderColor: alpha(theme.palette.secondary.main, 0.3),
                        '&:hover': {
                          borderColor: theme.palette.secondary.main,
                          backgroundColor: alpha(theme.palette.secondary.main, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {storageKey.replace(' (Secondary Storage)', '')}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
            </Grid>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Selected type: <strong>{selections.secondaryStorageType}</strong>
              </Typography>
              <Button
                size="small"
                onClick={() => setSelections(prev => ({
                  ...prev,
                  secondaryStorageType: null,
                  secondaryStorageOption: null
                }))}
                startIcon={<HelpOutlineIcon />} // Generic icon for "change"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.secondary.main
                  }
                }}
              >
                Change type
              </Button>
            </Box>
            {renderComponentOptions(
              storageData[`${selections.secondaryStorageType} (Secondary Storage)`] || [],
              'Name',
              'Price (INR)',
              selections.secondaryStorageOption,
              'secondaryStorageOption'
            )}
          </>
        )}
      </>
    );
  };

  // Renders the final review section before adding to cart
  const renderReviewSection = () => {
    // List of all components and their current selections
    const selectedComponents = [
      { label: 'Motherboard', value: selections.motherboard?.name },
      { label: 'Processor', value: selections.cpu?.name },
      { label: 'Graphics Card', value: selections.gpu?.name },
      { label: 'Memory', value: selections.ram?.name },
      { label: 'Primary Storage', value: selections.primaryStorage?.Name },
      { label: 'Secondary Storage', value: selections.secondaryStorageOption?.Name ?
          `${selections.secondaryStorageType} - ${selections.secondaryStorageOption.Name}` : null },
      { label: 'Power Supply', value: selections.psu?.name },
      { label: 'Case', value: selections.pcCase?.Name },
      { label: 'Cooling', value: selections.cooling?.Name },
    ];

    // Check if all essential components are selected
    const allSelected = selectedComponents.every(comp => comp.value);

    return (
      <Paper sx={{ p: 4, mt: 4, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Review Your Build
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Components Summary
            </Typography>

            <Box sx={{
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              borderRadius: theme.shape.borderRadius,
              p: 3,
              mb: 3
            }}>
              {selectedComponents.map((comp, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderBottom: index < selectedComponents.length - 1 ?
                    `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    {comp.label}:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {comp.value || 'Not selected'}
                  </Typography>
                </Box>
              ))}
            </Box>

            {!allSelected && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.warning.light, 0.1),
                p: 2,
                borderRadius: theme.shape.borderRadius,
                mb: 3
              }}>
                <FeaturedIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Please select all components to complete your build.
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to Build
            </Typography>

            <Paper sx={{
              p: 3,
              backgroundColor: alpha(theme.palette.secondary.light, 0.05),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              mb: 3
            }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Once you're satisfied with your selections, click the button below to add all components to your cart.
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={buildPC} // Triggers the buildPC function to add items to cart
                disabled={!allSelected} // Button is disabled until all components are selected
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mt: 2
                }}
                fullWidth
              >
                Complete Build & Add to Cart
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // Background image with overlay for better readability
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/gaming_PC.jpg')",
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      >
        {/* Header (reused from App.js) */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: scrolled ? alpha(theme.palette.primary.main, 0.9) : 'transparent',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            py: scrolled ? 0.5 : 1.5,
            borderBottom: scrolled ? `1px solid ${alpha(theme.palette.secondary.main, 0.2)}` : 'none'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              sx={{
                justifyContent: 'space-between',
                minHeight: { xs: 64, md: 80 },
                px: { xs: 0, md: 2 }
              }}
            >
              {/* Mobile menu icon */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon fontSize="large" />
                </IconButton>
              )}

              {/* Logo and Title */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexGrow: isMobile ? 0 : 1,
                  minWidth: isMobile ? 'auto' : '200px'
                }}
              >
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="/123.jpg"
                    alt="Logo"
                    sx={{
                      height: isMobile ? 48 : 56,
                      mr: 2,
                      borderRadius: 1,
                      boxShadow: 3
                    }}
                  />
                  {!isMobile && (
                    <Typography
                      variant="h4"
                      component="span"
                      sx={{
                        color: 'white',
                        fontWeight: 670,
                        letterSpacing: '0.5px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      BuildYourOwnPC
                    </Typography>
                  )}
                </Link>
              </Box>

              {/* Desktop Search Bar */}
              {!isMobile && (
                <Box sx={{
                  flexGrow: 1,
                  mx: 3,
                  maxWidth: 700,
                  width: '100%',
                }}>
                  <Autocomplete
                    freeSolo
                    options={[]} // Options can be dynamically loaded for search suggestions
                    inputValue={searchTerm}
                    onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
                    onChange={(event, newValue) => newValue && executeSearch(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Search gaming PCs, parts, accessories..."
                        size="small"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            color: 'white',
                            backgroundColor: alpha(theme.palette.primary.main, 0.4),
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.secondary.main, 0.3)
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.secondary.main, 0.5)
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Desktop Navigation Links */}
              {!isMobile && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Button
                    component={Link}
                    to="/about-us"
                    color="inherit"
                    startIcon={<AboutIcon />}
                    sx={{
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      color: 'white',
                      '&:hover': {
                        color: theme.palette.secondary.light
                      }
                    }}
                  >
                    About
                  </Button>
                  <Button
                    component={Link}
                    to="/contact-us"
                    color="inherit"
                    startIcon={<ContactIcon />}
                    sx={{
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      color: 'white',
                      '&:hover': {
                        color: theme.palette.secondary.light
                      }
                    }}
                  >
                    Contact
                  </Button>
                  <IconButton
                    component={Link}
                    to="/cart"
                    color="inherit"
                    size="large"
                    sx={{
                      ml: 1,
                      '&:hover': {
                        color: theme.palette.secondary.light
                      }
                    }}
                  >
                    <Badge badgeContent={cart.length} color="secondary">
                      <ShoppingCartIcon fontSize="medium" />
                    </Badge>
                  </IconButton>
                </Box>
              )}

              {/* Mobile Search and Cart Icons */}
              {isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="inherit"
                    onClick={() => document.getElementById('mobile-search').focus()}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to="/cart"
                    color="inherit"
                  >
                    <Badge badgeContent={cart.length} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Box>
              )}
            </Toolbar>

            {/* Mobile Search Field (appears below toolbar on mobile) */}
            {isMobile && (
              <Box sx={{ px: 2, pb: 1 }}>
                <TextField
                  id="mobile-search"
                  fullWidth
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeSearch(searchTerm)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      backgroundColor: alpha(theme.palette.primary.main, 0.4),
                      borderRadius: 3,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.secondary.main, 0.3)
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Container>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              backgroundColor: theme.palette.background.default,
              backgroundImage: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main Content Area */}
        {isBuilt ? (
          // Display success message after PC build
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 4, maxWidth: 600, backgroundColor: theme.palette.background.paper }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                  PC Build Successful!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                  Your custom PC build has been added to your cart. Get ready for an unparalleled gaming experience!
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/cart')}
                  sx={{ mr: 2 }}
                >
                  View Cart
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: theme.palette.secondary.main,
                    borderColor: alpha(theme.palette.secondary.main, 0.5),
                    '&:hover': {
                      borderColor: theme.palette.secondary.main,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    },
                  }}
                  onClick={() => window.location.reload()}
                >
                  Build Another PC
                </Button>
              </Paper>
            </motion.div>
          </Box>
        ) : (
          // Display the PC building wizard
          <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
            <Container maxWidth="xl">
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  mb: 6,
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Build Your Dream Gaming PC
              </Typography>

              <Paper sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'rgba(255,255,255,0.95)' }}>
                {/* Toggle for Beginner Mode Help */}
                <Box sx={{ mb: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={beginnerMode}
                        onChange={(e) => setBeginnerMode(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="Show Help for Beginners"
                    sx={{ color: theme.palette.text.primary }}
                  />
                </Box>

                {/* Stepper to show progress */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {steps.map((step) => (
                    <Step key={step.id}>
                      <StepLabel>{step.title}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Help text for the current step */}
                <Box sx={{ mb: 4 }}>
                  {beginnerMode && (
                    <Paper sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                      borderLeft: `4px solid ${theme.palette.secondary.main}`
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                        <HelpOutlineIcon color="secondary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        What is {steps[activeStep].title}?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {steps[activeStep].help}
                      </Typography>
                    </Paper>
                  )}
                </Box>

                {/* Conditional rendering of step content */}
                {activeStep === steps.findIndex(step => step.id === 'storage') ? (
                  // Render storage options for the storage step
                  renderStorageOptions()
                ) : activeStep === steps.findIndex(step => step.id === 'review') ? (
                  // Render review section for the review step
                  renderReviewSection()
                ) : (
                  // Render component options for other steps
                  renderComponentOptions(
                    steps[activeStep].data,
                    // Use 'Name' for cases and cooling, 'name' for others
                    ['case', 'cooling', 'primaryStorage', 'secondaryStorageOption'].includes(steps[activeStep].id) ? 'Name' : 'name',
                    // Use 'Price' for cases and cooling, 'price' for CPU, 'pricing (INR)' for others
                    steps[activeStep].id === 'case' || steps[activeStep].id === 'cooling' ? 'Price' :
                    steps[activeStep].id === 'cpu' ? 'price' : 'pricing (INR)',
                    selections[steps[activeStep].id], // Pass the currently selected item for this step
                    steps[activeStep].id // Pass the step ID
                  )
                )}

                {/* Navigation buttons for stepper */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setActiveStep(prev => Math.max(prev - 1, 0))}
                    disabled={activeStep === 0}
                    sx={{ mr: 2 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length - 1))}
                    disabled={activeStep === steps.length - 1}
                  >
                    Next
                  </Button>
                </Box>
              </Paper>
            </Container>
          </Box>
        )}

        {/* Footer (reused from App.js) */}
        <Box
          component="footer"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
            backdropFilter: 'blur(8px)',
            color: 'white',
            py: 4,
            mt: 'auto',
            borderTop: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  BuildYourOwnPC
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your ultimate destination for custom gaming PCs and components.
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Shop
                </Typography>
                <List dense>
                  {productSections.map((section, index) => (
                    <ListItem key={index} disablePadding>
                      <Button
                        component={Link}
                        to={section.path}
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          '&:hover': {
                            color: theme.palette.secondary.light
                          }
                        }}
                      >
                        {section.title}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Support
                </Typography>
                <List dense>
                  <ListItem disablePadding>
                    <Button
                      component={Link}
                      to="/contact-us"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          color: theme.palette.secondary.light
                        }
                      }}
                    >
                      Contact Us
                    </Button>
                  </ListItem>
                  <ListItem disablePadding>
                    <Button
                      component={Link}
                      to="/about-us"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          color: theme.palette.secondary.light
                        }
                      }}
                    >
                      About Us
                    </Button>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Newsletter
                </Typography>
                <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Your email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.4)'
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      whiteSpace: 'nowrap',
                      px: 3
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{
              mt: 4,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              textAlign: 'center'
            }}>
              <Typography variant="body2">
                &copy; {new Date().getFullYear()} BuildYourOwnPC. All rights reserved.
                {/* Hidden JSON Uploader link (Ctrl+J also works) */}
                <Link
                  to="/json-uploader"
                  style={{
                    color: 'transparent',
                    fontSize: '1px',
                    display: 'inline-block',
                    width: '1px',
                    height: '1px'
                  }}
                >
                  Admin
                </Link>
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Scroll to top button */}
        <ScrollTop>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: 0,
              width: 48,
              height: 48,
              borderRadius: '50%',
              boxShadow: 4
            }}
          >
            <ArrowUpwardIcon />
          </Button>
        </ScrollTop>

        {/* Snackbar for notifications */}
        <Snackbar
          open={Boolean(alertMessage)}
          message={alertMessage}
          autoHideDuration={3000}
          onClose={() => setAlertMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default BuildYourOwnPC;
