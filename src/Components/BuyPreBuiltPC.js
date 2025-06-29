import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import pcConfigs from '../data/custom_PC.json';
import Payment from './Payment';
import { useCart } from '../context/CartContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BuyPreBuiltPC = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');

  const theme = useTheme();

  const handleAddToCart = async (pc) => {
    if (!pc) return;
    const product = {
      product_id: pc.id,
      name: pc.PC_Type || 'Unnamed PC',
      price: parseFloat(pc.Price.replace(/[^0-9]/g, '')) || 0,
      quantity: 1,
    };
    await addToCart(product);
  };

  const handleOpenDialog = (pc) => {
    setSelectedProduct(pc);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpenDialog(false);
  };

  const toggleCart = () => {
    setOpenCart((prev) => !prev);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Buy Pre Built PCs
          </Typography>
          <IconButton onClick={toggleCart} color="inherit">
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {pcConfigs.map((pc, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                {pc.urls && pc.urls.length > 0 && (
                  <CardMedia
                    component="img"
                    height="150"
                    image={pc.urls[0] || 'blank_image_url'}
                    alt={pc.PC_Type || 'Unnamed PC'}
                    sx={{
                      width: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, py: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {pc.PC_Type || 'Unnamed PC'}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}
                  >
                    Price: ₹{parseFloat(pc.Price.replace(/[^0-9]/g, '')) || 0}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0, fontSize: '0.875rem' }}>
                    <li><strong>CPU:</strong> {pc.CPU || 'N/A'}</li>
                    <li><strong>GPU:</strong> {pc.GPU || 'N/A'}</li>
                    <li><strong>Motherboard:</strong> {pc.Motherboard || 'N/A'}</li>
                    <li><strong>RAM:</strong> {pc.RAM || 'N/A'}</li>
                    <li><strong>Primary Storage:</strong> {pc.Primary_Storage || 'N/A'}</li>
                    <li><strong>Secondary Storage:</strong> {pc.Secondary_Storage || 'N/A'}</li>
                    <li><strong>Case:</strong> {pc.Case || 'N/A'}</li>
                    <li><strong>Cooling:</strong> {pc.Cooling || 'N/A'}</li>
                  </Box>
                </CardContent>
                <CardActions sx={{ py: 1, px: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleAddToCart(pc)}
                    sx={{
                      borderRadius: '20px',
                      flex: 1,
                      backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: '#fff',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 10px rgba(33, 203, 243, 0.3)',
                        backgroundImage: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton onClick={() => handleOpenDialog(pc)} color="primary">
                    <InfoIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Quick View Dialog for detailed product info */}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.PC_Type || 'PC Details'}</DialogTitle>
            <DialogContent dividers>
              {selectedProduct.urls && selectedProduct.urls.length > 0 && (
                <Box
                  component="img"
                  src={selectedProduct.urls[0]}
                  alt={selectedProduct.PC_Type || 'PC Image'}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    mb: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />
              )}
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}
              >
                Price: ₹{parseFloat(selectedProduct.Price.replace(/[^0-9]/g, '')) || 0}
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0, fontSize: '0.875rem' }}>
                <li><strong>CPU:</strong> {selectedProduct.CPU || 'N/A'}</li>
                <li><strong>GPU:</strong> {selectedProduct.GPU || 'N/A'}</li>
                <li><strong>Motherboard:</strong> {selectedProduct.Motherboard || 'N/A'}</li>
                <li><strong>RAM:</strong> {selectedProduct.RAM || 'N/A'}</li>
                <li><strong>Primary Storage:</strong> {selectedProduct.Primary_Storage || 'N/A'}</li>
                <li><strong>Secondary Storage:</strong> {selectedProduct.Secondary_Storage || 'N/A'}</li>
                <li><strong>Case:</strong> {selectedProduct.Case || 'N/A'}</li>
                <li><strong>Cooling:</strong> {selectedProduct.Cooling || 'N/A'}</li>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleAddToCart(selectedProduct)} variant="contained" color="primary">
                Add to Cart
              </Button>
              <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Refined Cart Drawer */}
      <Drawer anchor="right" open={openCart} onClose={toggleCart}>
        <Box sx={{ width: { xs: '100%', sm: 400 }, p: 3, height: '100%', overflowY: 'auto' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Your Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography variant="body1" sx={{ my: 2 }}>
              Cart is empty.
            </Typography>
          ) : (
            <Box>
              {cart.map((item, idx) => (
                <React.Fragment key={idx}>
                  <List>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeFromCart(item.cart_id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item.name} secondary={`₹${item.price}`} />
                    </ListItem>
                  </List>
                  <Divider />
                </React.Fragment>
              ))}
            </Box>
          )}

          {/* User Details Section */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Enter Your Details
            </Typography>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              margin="normal"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
          </Box>

          {/* Payment Section */}
          <Box sx={{ mt: 3 }}>
            <Payment
              cart={cart}
              totalAmount={cart.reduce((sum, item) => sum + item.price, 0)}
              userDetails={{ name: userName, phone: userPhone, address: userAddress }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default BuyPreBuiltPC;
