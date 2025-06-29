import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import upiImage from '../upi.png';
import { useCart } from '../context/CartContext';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment'; // Using as "Debit Card"

// MUI Components
import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  useMediaQuery,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Icons
import {
  AccountBalanceWalletOutlined as CashIcon,
  QrCodeScannerOutlined as UPIIcon,
  CreditCardOutlined as CardIcon,
  ReceiptLongOutlined as InvoiceIcon,
  PrintOutlined as PrintIcon,
  PictureAsPdfOutlined as PdfIcon,
  CheckCircleOutlineOutlined as SuccessIcon,
  ErrorOutlineOutlined as ErrorIcon,
  Close as CloseIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';

// Styled Components
const PaymentOptionCard = styled(Paper)(({ theme, selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  textAlign: 'center',
  minHeight: 120,
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius * 2,
  border: selected ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
  transition: 'all 0.2s ease',
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: selected ? theme.palette.primary.contrastText : theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  '& .MuiTypography-root': {
    fontWeight: selected ? 700 : 500,
    color: selected ? theme.palette.primary.contrastText : 'inherit',
  }
}));

const ActionButton = styled(Button)(({ theme, varianttype }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 600,
  textTransform: 'none',
  minWidth: 180,
  ...(varianttype === 'generate' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  }),
  ...(varianttype === 'print' && {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  }),
  ...(varianttype === 'pdf' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),
}));

const Payment = ({ totalAmount, userDetails, onInvoiceGenerated }) => {
  const { cart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const invoiceRef = useRef(null);
  
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentDialogContent, setPaymentDialogContent] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const generateUniqueInvoiceId = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `INV-${timestamp}-${randomString}`;
  };

  const handlePaymentSelection = (e) => {
    const mode = e.target.value;
    setSelectedPaymentMode(mode);
    setInvoiceId(generateUniqueInvoiceId());

    switch (mode) {
      case 'Cash':
        setPaymentDialogContent(renderCashPaymentContent());
        break;
      case 'UPI':
        setPaymentDialogContent(renderUPIPaymentContent());
        break;
      case 'Debit Card':
      case 'Credit Card':
        setPaymentDialogContent(renderCardPaymentContent(mode));
        break;
      default:
        setPaymentDialogContent('');
    }
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Payment Content Renderers
  const renderUPIPaymentContent = () => (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.dark, mb: 3 }}>
        UPI Payment
      </Typography>
      <Box
        component="img"
        src={upiImage}
        alt="UPI QR Code"
        sx={{
          maxWidth: '100%',
          height: 'auto',
          maxHeight: 300,
          borderRadius: 2,
          boxShadow: 3,
          mb: 3
        }}
      />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Scan the QR code above to complete your payment
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.success.main }}>
        <SuccessIcon sx={{ mr: 1 }} />
        <Typography>Payment is simulated for demonstration</Typography>
      </Box>
    </Box>
  );

  const renderCardPaymentContent = (cardType) => (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: theme.palette.primary.dark, mb: 3 }}>
        {cardType} Payment
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Card Number</Typography>
          <Box
            component="input"
            type="text"
            placeholder="•••• •••• •••• ••••"
            sx={{
              width: '100%',
              p: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              fontSize: 16
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Exp. Month</Typography>
            <Box
              component="input"
              type="text"
              placeholder="MM"
              sx={{
                width: '100%',
                p: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                fontSize: 16
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Exp. Year</Typography>
            <Box
              component="input"
              type="text"
              placeholder="YY"
              sx={{
                width: '100%',
                p: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                fontSize: 16
              }}
            />
          </Box>
          <Box sx={{ flex: 0.8 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>CVV</Typography>
            <Box
              component="input"
              type="text"
              placeholder="•••"
              sx={{
                width: '100%',
                p: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                fontSize: 16
              }}
            />
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Name on Card</Typography>
          <Box
            component="input"
            type="text"
            placeholder="As it appears on card"
            sx={{
              width: '100%',
              p: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              fontSize: 16
            }}
          />
        </Box>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2, py: 1.5, fontSize: 18, fontWeight: 'bold' }}
        >
          Pay Now
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, mt: 2 }}>
          <InfoIcon sx={{ mr: 1 }} />
          <Typography variant="caption">
            This is a simulated payment form for demonstration purposes only.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderCashPaymentContent = () => (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <CashIcon sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
      <Typography variant="h4" sx={{ color: theme.palette.primary.dark, mb: 2 }}>
        Cash Payment
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Your order has been placed successfully!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Please proceed to the cash counter to complete your payment.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.info.main }}>
        <InfoIcon sx={{ mr: 1 }} />
        <Typography>Your invoice will be generated upon cash payment</Typography>
      </Box>
    </Box>
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Generate invoice HTML
  const generateInvoiceHTML = () => {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const invoiceRows = cart.map((item, index) => (`
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${formatCurrency(parseFloat(item.price))}</td>
      </tr>
    `)).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${invoiceId}</title>
        <style>
          body { font-family: 'Roboto', sans-serif; line-height: 1.6; color: #333; padding: 20px; }
          .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .header h1 { color: ${theme.palette.primary.main}; margin: 0; font-size: 28px; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; color: ${theme.palette.secondary.main}; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: ${theme.palette.primary.light}; color: white; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 14px; }
          .signature { display: flex; justify-content: space-between; margin-top: 50px; }
          .signature-box { width: 45%; text-align: center; }
          .signature-line { border-top: 1px solid #ccc; margin-top: 60px; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Gaming PC Store</h1>
            <p>123 Tech Street, Bangalore, India - 560001</p>
            <p>Phone: +91 9876543210 | Email: contact@gamingpcstore.com</p>
          </div>

          <div class="section">
            <div class="section-title">Invoice Details</div>
            <div class="detail-row">
              <span><strong>Invoice ID:</strong></span>
              <span>${invoiceId}</span>
            </div>
            <div class="detail-row">
              <span><strong>Date:</strong></span>
              <span>${date}</span>
            </div>
            <div class="detail-row">
              <span><strong>Time:</strong></span>
              <span>${time}</span>
            </div>
            <div class="detail-row">
              <span><strong>Payment Method:</strong></span>
              <span>${selectedPaymentMode}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Customer Details</div>
            <div class="detail-row">
              <span><strong>Name:</strong></span>
              <span>${userDetails.name}</span>
            </div>
            <div class="detail-row">
              <span><strong>Phone:</strong></span>
              <span>${userDetails.phone}</span>
            </div>
            <div class="detail-row">
              <span><strong>Address:</strong></span>
              <span>${userDetails.address}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Summary</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceRows}
                <tr class="total-row">
                  <td colspan="2" style="text-align: right;">Total</td>
                  <td>${formatCurrency(parseFloat(totalAmount))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="signature">
            <div class="signature-box">
              <div class="signature-line">Customer Signature</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Authorized Signature</div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>&copy; ${new Date().getFullYear()} Gaming PC Store. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleGenerateInvoice = () => {
    const invoiceHTML = generateInvoiceHTML();
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    
    showSnackbar('Invoice generated successfully!');
    if (onInvoiceGenerated) onInvoiceGenerated();
  };

  const handlePrintInvoice = () => {
    const invoiceHTML = generateInvoiceHTML();
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
    
    showSnackbar('Invoice sent to printer!');
  };

  const handleSaveAsPDF = () => {
    const invoiceHTML = generateInvoiceHTML();
    const element = document.createElement('div');
    element.innerHTML = invoiceHTML;
    
    html2pdf()
      .set({
        margin: 10,
        filename: `invoice_${invoiceId}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save()
      .then(() => {
        showSnackbar('PDF saved successfully!');
      });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            mb: 3,
          }}
        >
          Select Payment Method
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <RadioGroup
  aria-label="payment method"
  name="payment-method"
  value={selectedPaymentMode}
  onChange={handlePaymentSelection}
>
  <Grid container spacing={3} rowSpacing={4} justifyContent="center">
    <Grid item xs={12} sm={6} md={6}>
      <FormControlLabel
        value="Cash"
        control={<Radio sx={{ display: 'none' }} />}
        label={
          <PaymentOptionCard selected={selectedPaymentMode === 'Cash'}>
            <CashIcon />
            <Typography variant="h6">Cash</Typography>
          </PaymentOptionCard>
        }
        sx={{ m: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={6}>
      <FormControlLabel
        value="UPI"
        control={<Radio sx={{ display: 'none' }} />}
        label={
          <PaymentOptionCard selected={selectedPaymentMode === 'UPI'}>
            <UPIIcon />
            <Typography variant="h6">UPI</Typography>
          </PaymentOptionCard>
        }
        sx={{ m: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={6}>
  <FormControlLabel
    value="Debit Card"
    control={<Radio sx={{ display: 'none' }} />}
    label={
      <PaymentOptionCard selected={selectedPaymentMode === 'Debit Card'}>
        <PaymentIcon sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h6">Debit Card</Typography>
      </PaymentOptionCard>
    }
    sx={{ m: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
  />
</Grid>
<Grid item xs={12} sm={6} md={6}>
  <FormControlLabel
    value="Credit Card"
    control={<Radio sx={{ display: 'none' }} />}
    label={
      <PaymentOptionCard selected={selectedPaymentMode === 'Credit Card'}>
        <CreditCardIcon sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h6">Credit Card</Typography>
      </PaymentOptionCard>
    }
    sx={{ m: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
  />
</Grid>
  </Grid>
</RadioGroup>


        {selectedPaymentMode && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Selected: <span style={{ color: theme.palette.primary.main }}>{selectedPaymentMode}</span>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
              <ActionButton
                varianttype="generate"
                startIcon={<InvoiceIcon />}
                onClick={handleGenerateInvoice}
              >
                Generate Invoice
              </ActionButton>
              <ActionButton
                varianttype="print"
                startIcon={<PrintIcon />}
                onClick={handlePrintInvoice}
              >
                Print Invoice
              </ActionButton>
              <ActionButton
                varianttype="pdf"
                startIcon={<PdfIcon />}
                onClick={handleSaveAsPDF}
              >
                Save as PDF
              </ActionButton>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Payment Process</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClosePaymentDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {paymentDialogContent}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClosePaymentDialog}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Payment;