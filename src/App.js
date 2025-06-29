import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  Fade,
  Zoom,
  useScrollTrigger
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { CartProvider, useCart } from './context/CartContext';
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
  SportsEsports as AccessoriesIcon
} from '@mui/icons-material';

// Import components
import BuildYourOwnPC from './components/BuildYourOwnPC';
import BuyPreBuiltPC from './components/BuyPreBuiltPC';
import BuyGamingPCParts from './components/BuyGamingPCParts';
import GamingPCAccessories from './components/GamingPCAccessories';
import CartPage from './components/CartPage';
import ContactUs from './components/ContactUs';
import JsonUploader from './components/JsonUploader';
import Search from './components/Search';
import AboutUs from './components/AboutUs';
import { motion } from 'framer-motion';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import HeroSlider from './components/HeroSlider';


// Enhanced theme with custom shadows and transitions
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

// Scroll to top component
function ScrollTop({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const theme = useTheme(); // 👈 Add this line to fix the error

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
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ 
              minWidth: 0, 
              width: 56, 
              height: 56,
              borderRadius: '50%',
              boxShadow: 6,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark
              }
            }}
          >
            <ArrowUpwardIcon fontSize="medium" />
          </Button>
        </motion.div>
      </Box>
    </Zoom>
  );
}


function MainApp() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Keyboard shortcut for JSON Uploader (Ctrl+J)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        navigate('/json-uploader');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const suggestions = searchTerm.length > 2
    ? ['Gaming PC', 'PC Parts', 'Prebuilt PC', 'Gaming Accessories', 'RTX 4090', 'Ryzen 9']
    : [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const executeSearch = (term) => {
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      setSearchTerm('');
    }
  };

  const productSections = [
    {
      title: "Build Your Dream PC",
      description: "Customize every component to create your perfect gaming rig.",
      image: "build_your_PC.jpg",
      path: "/build-your-own-pc",
      color: theme.palette.secondary.main
    },
    {
      title: "Premium PC Parts",
      description: "Top-tier components from trusted brands.",
      image: "gaming_PC_parts.jpg",
      path: "/buy-gaming-pc-parts",
      color: '#4a148c'
    },
    {
      title: "Pre-Built Systems",
      description: "Expertly assembled, ready-to-ship gaming PCs.",
      image: "custom_built_pc.jpg",
      path: "/buy-custom-built-pc",
      color: '#00695c'
    },
    {
      title: "Gaming Accessories",
      description: "Enhance your setup with premium peripherals.",
      image: "gaming_PC_accessories.jpg",
      path: "/gaming-pc-accessories",
      color: '#e65100'
    },
  ];

  // Mobile drawer
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

  {/* About Us */}
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

  {/* Contact Us */}
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

  {/* Cart */}
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/gaming_PC.jpg')",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      {/* Header with scroll effect */}
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
            {/* Mobile menu */}
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

            {/* Logo + Title */}
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

            {/* Search Bar */}
            {!isMobile && (
              <Box sx={{ 
                flexGrow: 1, 
                mx: 3,
                maxWidth: 700,
                width: '100%',
              }}>
                <Autocomplete
                  freeSolo
                  options={suggestions}
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

            {/* Desktop Navigation */}
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

            {/* Mobile Search and Cart */}
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

          {/* Mobile Search Field */}
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
      <Toolbar id="back-to-top-anchor" />

      {/* Mobile Drawer */}
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

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="xl">
<HeroSlider />

          <Grid container spacing={4}>
            {productSections.map((section, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.2 }}
  whileHover={{ scale: 1.03 }}
>
  <Paper
    component={Link}
    to={section.path}
    elevation={3}
    sx={{
      p: 3,
      height: 380,
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${section.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${alpha(section.color, 0.3)}`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(section.color, 0.1)} 0%, transparent 60%)`,
        zIndex: 0,
      },
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          p: 1.5,
          mb: 2,
          borderRadius: '50%',
          backgroundColor: alpha(section.color, 0.2),
          color: section.color,
        }}
      >
        {section.icon}
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 700,
          mb: 1,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {section.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255,255,255,0.9)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {section.description}
      </Typography>
      <Button
        variant="contained"
        size="small"
        sx={{
          mt: 2,
          backgroundColor: section.color,
          '&:hover': {
            backgroundColor: alpha(section.color, 0.9),
          },
        }}
      >
        Explore Now
      </Button>
    </Box>
  </Paper>
</motion.div>

              </Grid>
            ))}
          </Grid>

          {/* Featured Section */}
                <Box sx={{ mt: 10, textAlign: 'center' }}>
        <FeaturedIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>
          Why Choose Us?
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {[
            {
              title: "100% Customizable Builds",
              description: "Tailor every part of your PC from CPU to RGB just the way you like it.",
            },
            {
              title: "Premium Quality Components",
              description: "We source only top-tier parts from trusted brands to ensure maximum performance.",
            },
            {
              title: "Expert Support 24/7",
              description: "Our tech support team is always ready to help with any queries, anytime.",
            },
            {
              title: "Fast & Free Shipping",
              description: "Enjoy lightning-fast delivery with zero shipping charges across India.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  color: 'white',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Container>
            </Box>

      {/* Footer */}
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
          ↑
        </Button>
      </ScrollTop>
    </Box>
  );
}

function RootApp() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/build-your-own-pc" element={<BuildYourOwnPC />} />
            <Route path="/buy-custom-built-pc" element={<BuyPreBuiltPC />} />
            <Route path="/buy-gaming-pc-parts" element={<BuyGamingPCParts />} />
            <Route path="/gaming-pc-accessories" element={<GamingPCAccessories />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/json-uploader" element={<JsonUploader />} />
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default RootApp;