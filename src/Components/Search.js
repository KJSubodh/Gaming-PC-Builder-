import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { useCart } from "../context/CartContext";
import debounce from "lodash.debounce";

// Import JSON data
import pcData from "../data/custom_PC.json";
import cpuData from "../data/cpu.json";
import gpuData from "../data/gpu.json";
import ramData from "../data/ram.json";
import storageData from "../data/storage.json";
import motherboardData from "../data/mb.json";
import miceData from "../data/mice.json";
import keyboardData from "../data/keyboards.json";
import monitorData from "../data/monitor.json";
import headphoneData from "../data/headphones.json";
import microphoneData from "../data/microphone.json";
import webcamData from "../data/webcam.json";
import casesData from "../data/cases.json";
import coolingData from "../data/cooling.json";
import psuData from "../data/psu.json";

// Material UI components
import {
  Box,
  Container,
  TextField,
  IconButton,
  Button,
  Typography,
  Paper,
  Snackbar,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Category as CategoryIcon,
  PriceChange as PriceIcon,
  FavoriteBorder as WishlistIcon,
} from "@mui/icons-material";

// Gradient background with animated particles
const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 30%, ${alpha(
      theme.palette.primary.light,
      0.15
    )} 0%, transparent 20%)`,
    animation: "pulse 15s infinite alternate",
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 0.8,
    },
    "100%": {
      transform: "scale(1.2)",
      opacity: 1,
    },
  },
}));

// Glass morphism container
const GlassContainer = styled(Container)(({ theme }) => ({
  backdropFilter: "blur(12px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.36)}`,
  border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.5)}`,
  },
}));

// Neon search input
const NeonSearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    backgroundColor: alpha(theme.palette.common.white, 0.95),
    boxShadow: `0 0 8px ${alpha(theme.palette.primary.light, 0.5)}`,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.98),
      boxShadow: `0 0 12px ${alpha(theme.palette.primary.light, 0.8)}`,
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.common.white, 0.98),
      boxShadow: `0 0 16px ${alpha(theme.palette.primary.light, 1)}`,
    },
  },
  "& .MuiInputBase-input": {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
}));

// Holographic card effect
const HolographicCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
    "&::before": {
      opacity: 1,
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.light,
      0.1
    )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: 0,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Search = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredResults, setFilteredResults] = useState([]);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [wishlist, setWishlist] = useState([]);
  const searchInputRef = useRef(null);
  const { addToCart, cartItems = [] } = useCart();

  // Memoized product data processing
  const allProducts = useMemo(() => {
    const getFlattenedItems = (data, category) => {
      if (!data) return [];
      return Object.values(data).flat().map((item) => ({ ...item, category }));
    };

    return [
      ...pcData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.PC_Type,
        category: "Prebuilt PC",
      })),
      ...cpuData.gaming_cpus.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.name,
        category: "CPU",
      })),
      ...gpuData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.name,
        category: "GPU",
      })),
      ...ramData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.name,
        category: "RAM",
      })),
      ...getFlattenedItems(storageData["NVMe PCIe M.2 (Primary Storage)"], "NVMe SSD").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...getFlattenedItems(storageData["SATA III SSD (Secondary Storage)"], "SATA SSD").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...getFlattenedItems(storageData["HDD (Secondary Storage)"], "HDD").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...motherboardData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.name,
        category: "Motherboard",
      })),
      ...miceData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.Name,
        category: "Mouse",
      })),
      ...keyboardData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.name,
        category: "Keyboard",
      })),
      ...monitorData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.model,
        category: "Monitor",
      })),
      ...getFlattenedItems(headphoneData["GamingHeadphones/Earphones"], "Headphones").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...getFlattenedItems(microphoneData.microphones, "Microphone").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...getFlattenedItems(webcamData.webcams, "Webcam").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...getFlattenedItems(casesData["Gaming PC Cases"], "Case").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...getFlattenedItems(coolingData["Cooling Solutions"], "Cooling").map((item) => ({
        ...item,
        id: item.id || "",
      })),
      ...psuData.map((item) => ({
        ...item,
        id: item.id || "",
        name: item.name,
        category: "PSU",
      })),
    ];
  }, []);

  // Extract price from product data
  const extractPrice = (item) => {
    const priceKeys = ["pricing (INR)", "Price (INR)", "price", "Price", "pricing"];
    for (let key of priceKeys) {
      if (item[key]) {
        const price = parseFloat(item[key].toString().replace(/[^0-9.]/g, ""));
        return isNaN(price) ? null : Math.round(price);
      }
    }
    return null;
  };

  // Get product name with fallbacks
  const getProductName = (item) => {
    return item.model || item.Name || item.PC_Type || item.name || "Unnamed Product";
  };

  // Fix image URLs if they're relative
  const getProperImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("/") ? process.env.PUBLIC_URL + url : url;
  };

  // Initialize Fuse.js with better search options
  const fuse = useMemo(() => {
    return new Fuse(allProducts, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "PC_Type", weight: 0.4 },
        { name: "Name", weight: 0.4 },
        { name: "model", weight: 0.4 },
        { name: "category", weight: 0.3 },
        { name: "brand", weight: 0.2 },
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      shouldSort: true,
    });
  }, [allProducts]);

  // Debounced search function
  const performSearch = debounce((query) => {
    if (query.trim() === "") {
      setFilteredResults([]);
      setOpenOverlay(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const results = fuse.search(query).map((result) => ({
      ...result.item,
      price: extractPrice(result.item),
      fuseScore: result.score,
    }));

    // Sort by relevance then price
    results.sort((a, b) => {
      if (a.fuseScore !== b.fuseScore) return a.fuseScore - b.fuseScore;
      return (a.price || 0) - (b.price || 0);
    });

    setFilteredResults(results);
    setOpenOverlay(true);
    setIsLoading(false);
  }, 300);

  // Handle search query changes
  useEffect(() => {
    performSearch(searchQuery);
    return () => performSearch.cancel();
  }, [searchQuery]);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setOpenOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allProducts.map((item) => item.category));
    return Array.from(uniqueCategories).sort();
  }, [allProducts]);

  // Filter results by active category
  const filteredByCategory = useMemo(() => {
    if (activeCategory === "all") return filteredResults;
    return filteredResults.filter((item) => item.category === activeCategory);
  }, [filteredResults, activeCategory]);

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setOpenOverlay(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (item) => {
    const productName = item.model || getProductName(item);
    setSearchQuery(productName);
    setOpenOverlay(false);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    const product = {
      id: item.id || "",
      name: item.model || getProductName(item),
      price: item.price,
      category: item.category,
      image: item.urls?.[0] ? getProperImageUrl(item.urls[0]) : "",
    };

    addToCart(product);
    setCartMessage(
      <Box display="flex" alignItems="center">
        <Avatar
          src={product.image}
          sx={{ width: 24, height: 24, mr: 1 }}
          alt={product.name}
        />
        <span>
          <strong>{product.name}</strong> added to cart
        </span>
      </Box>
    );
  };

  // Handle wishlist toggle
  const toggleWishlist = (itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Check if item is in cart
  const isInCart = (item) => {
    if (!cartItems || !Array.isArray(cartItems)) return false;
    return cartItems.some(
      (cartItem) =>
        cartItem.id === (item.id || "") &&
        cartItem.name === (item.model || getProductName(item))
    );
  };

  // Check if item is in wishlist
  const isInWishlist = (itemId) => {
    return wishlist.includes(itemId);
  };

  return (
    <>
      <AnimatedBackground />
      <GlassContainer maxWidth={location.pathname === "/search" ? false : "md"}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 800,
              position: "relative",
              mb: location.pathname === "/search" ? 3 : 0,
            }}
            ref={searchInputRef}
          >
            <NeonSearchInput
              fullWidth
              variant="outlined"
              placeholder="Search for PC components, peripherals, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                startAdornment: (
                  <IconButton
                    sx={{ mr: -1 }}
                    onClick={handleSearch}
                    aria-label="search"
                  >
                    <SearchIcon color="primary" />
                  </IconButton>
                ),
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery("");
                      setOpenOverlay(false);
                    }}
                    aria-label="clear"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />

            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  right: 60,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <CircularProgress size={20} color="primary" />
              </Box>
            )}
          </Box>

          {/* Category filters for search results page */}
          {location.pathname === "/search" && filteredResults.length > 0 && (
            <Box sx={{ width: "100%", overflowX: "auto", py: 2 }}>
              <Box display="flex" justifyContent="center" flexWrap="wrap">
                <Chip
                  label="All"
                  variant={activeCategory === "all" ? "filled" : "outlined"}
                  onClick={() => setActiveCategory("all")}
                  icon={<CategoryIcon fontSize="small" />}
                  sx={{
                    mr: 1,
                    mb: 1,
                    backgroundColor:
                      activeCategory === "all"
                        ? alpha(theme.palette.primary.main, 0.2)
                        : "inherit",
                  }}
                />
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    variant={activeCategory === category ? "filled" : "outlined"}
                    onClick={() => setActiveCategory(category)}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor:
                        activeCategory === category
                          ? alpha(theme.palette.primary.main, 0.2)
                          : "inherit",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Search suggestions overlay */}
        <Dialog
          fullScreen={isMobile}
          fullWidth={!isMobile}
          maxWidth="md"
          open={openOverlay && filteredResults.length > 0 && location.pathname === "/"}
          onClose={() => setOpenOverlay(false)}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : theme.shape.borderRadius * 2,
              overflow: "hidden",
              maxHeight: "80vh",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
              backdropFilter: "blur(12px)",
            },
          }}
        >
          <AppBar
            position="sticky"
            color="inherit"
            elevation={1}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.common.white,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                onClick={() => setOpenOverlay(false)}
                aria-label="close"
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                Search Results
              </Typography>
              <Typography variant="body2">
                {filteredResults.length} items found
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 2, overflowY: "auto" }}>
            <Grid container spacing={2}>
              {filteredResults.slice(0, 12).map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    onClick={() => handleSuggestionClick(item)}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      borderRadius: theme.shape.borderRadius * 2,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.background.paper,
                        0.9
                      )} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    }}
                  >
                    {item.urls && item.urls.length > 0 && (
                      <Box
                        component="img"
                        src={getProperImageUrl(item.urls[0])}
                        alt={getProductName(item)}
                        sx={{
                          width: 64,
                          height: 64,
                          mr: 2,
                          objectFit: "contain",
                          borderRadius: 1,
                          boxShadow: `0 2px 8px ${alpha(
                            theme.palette.common.black,
                            0.2
                          )}`,
                        }}
                      />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{ fontWeight: 600 }}
                      >
                        {getProductName(item)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 0.5,
                        }}
                      >
                        <Chip
                          label={item.category}
                          size="small"
                          sx={{
                            mr: 1,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: theme.palette.primary.dark,
                          }}
                        />
                        {item.price && (
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            ₹{item.price.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Dialog>

        {/* Search results page */}
        {location.pathname === "/search" && (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              {filteredByCategory.length > 0
                ? `Results for "${searchQuery}"`
                : `No results for "${searchQuery}"`}
            </Typography>

            {filteredByCategory.length > 0 ? (
              <Grid container spacing={3}>
                {filteredByCategory.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <HolographicCard elevation={3}>
                      {/* Wishlist button */}
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          color: isInWishlist(item.id)
                            ? theme.palette.error.main
                            : "inherit",
                          backgroundColor: alpha(
                            theme.palette.background.paper,
                            0.8
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.9
                            ),
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id);
                        }}
                        aria-label="add to wishlist"
                      >
                        <WishlistIcon
                          color={
                            isInWishlist(item.id) ? "error" : "inherit"
                          }
                        />
                      </IconButton>

                      {/* Product image */}
                      {item.urls && item.urls.length > 0 && (
                        <Box
                          sx={{
                            position: "relative",
                            pt: "75%", // 4:3 aspect ratio
                            overflow: "hidden",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={getProperImageUrl(item.urls[0])}
                            alt={getProductName(item)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              p: 2,
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        </Box>
                      )}

                      {/* Product details */}
                      <CardContent sx={{ flexGrow: 1, position: "relative" }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {getProductName(item)}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              mr: 1,
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.dark,
                            }}
                          />
                          {item.rating && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "warning.main",
                              }}
                            >
                              <StarIcon fontSize="small" />
                              <Typography
                                variant="body2"
                                sx={{ ml: 0.25, fontWeight: 500 }}
                              >
                                {item.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        {item.price && (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            ₹{item.price.toLocaleString()}
                          </Typography>
                        )}
                      </CardContent>

                      {/* Add to cart button */}
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          startIcon={
                            isInCart(item) ? (
                              <Badge
                                badgeContent="✓"
                                color="success"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                              />
                            ) : (
                              <CartIcon />
                            )
                          }
                          size="small"
                          color={isInCart(item) ? "success" : "primary"}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            boxShadow: `0 2px 8px ${alpha(
                              theme.palette.primary.main,
                              0.3
                            )}`,
                            "&:hover": {
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.primary.main,
                                0.4
                              )}`,
                            },
                          }}
                        >
                          {isInCart(item) ? "Added to Cart" : "Add to Cart"}
                        </Button>
                      </CardActions>
                    </HolographicCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                sx={{
                  p: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.background.paper,
                    0.9
                  )} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
                  borderRadius: theme.shape.borderRadius * 2,
                }}
              >
                <SearchIcon
                  sx={{
                    fontSize: 72,
                    mb: 2,
                    color: alpha(theme.palette.text.secondary, 0.5),
                  }}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  No products found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 400, mb: 3 }}
                >
                  Try different keywords or browse our categories to find what
                  you're looking for
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/categories")}
                  sx={{ borderRadius: 2 }}
                >
                  Browse Categories
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </GlassContainer>

      {/* Cart notification */}
      <Snackbar
        open={Boolean(cartMessage)}
        message={cartMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={() => setCartMessage(null)}
        sx={{
          "& .MuiSnackbarContent-root": {
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            color: theme.palette.common.white,
            borderRadius: theme.shape.borderRadius * 2,
            boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
          },
        }}
      />
    </>
  );
};

export default Search;