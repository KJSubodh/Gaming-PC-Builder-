import React, { useState } from 'react';
import upiImage from './upi.png'; // Import the upi.png image

const PaymentSelection = ({ onSelect }) => {
  const [selectedMode, setSelectedMode] = useState('');

  const handleModeChange = (event) => {
    const mode = event.target.value;
    setSelectedMode(mode);
    onSelect(mode);

    console.log("Selected mode:", mode);

    // Open payment mode page in a new tab based on the selected mode
    switch (mode) {
      case 'upi':
        renderUPIPaymentPage();
        break;
      case 'debit_card':
        renderDebitCardPaymentPage();
        break;
      case 'credit_card':
        renderCreditCardPaymentPage();
        break;
        case 'cash':
          renderCashPaymentPage();
          break;
        default:
          break;
    }
  };

  // Function to render UPI payment page in a new tab
  const renderUPIPaymentPage = () => {
    const newTab = window.open('', '_blank');
    newTab.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UPI Payment</title>
<style>
    body {
        font-family: Arial, sans-serif; /* Better font */
        background-color: #f4f4f4;
    }
    div {
        text-align: center; /* Center align the content */
        max-width: 600px;
        margin: 0 auto; /* Center the container */
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h2 {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; /* Better font */
        margin-bottom: 20px; /* Add some space below the heading */
    }
    img {
        display: block; /* Make the image a block element */
        margin: 0 auto 20px; /* Center the image and add some space below it */
        max-width: 100%; /* Make sure the image doesn't exceed its container */
    }
    p {
        font-size: 16px; /* Better font size */
        line-height: 1.6; /* Improved readability */
    }
</style>
</head>
<body>

<div>
    <h2>UPI Payment Page</h2>
    <img src="${upiImage}" alt="UPI Payment" />
</div>

</body>
</html>
    `);
  };

  // Function to render debit card payment page in a new tab
  const renderDebitCardPaymentPage = () => {
    const newTab = window.open('', '_blank');
    newTab.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Debit Card Payment</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    form {
        max-width: 400px;
        margin: 0 auto;
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h2 {
        text-align: center; /* Center align the h2 */
    }
    label {
        display: block;
        margin-bottom: 5px;
    }
    input[type="text"] {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    button[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button[type="submit"]:hover {
        background-color: #45a049;
    }
</style>
</head>
<body>

<div>
    <h2>Debit Card Payment</h2>
    <form>
        <label for="cardNumber">Card Number:</label>
        <input type="text" id="cardNumber" name="cardNumber" />
        <label for="expiryDate">Expiry Date:</label>
        <input type="text" id="expiryDate" name="expiryDate" />
        <label for="expiryMonth">Expiry Month:</label>
        <input type="text" id="expiryMoth" name="expiryMonth" />
        <label for="nameOnCard">Name on Card:</label>
        <input type="text" id="nameOnCard" name="nameOnCard" />
        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" name="cvv" />
        <button type="submit">Pay</button>
    </form>
</div>

</body>
</html>
    `);
  };

  // Function to render credit card payment page in a new tab
  const renderCreditCardPaymentPage = () => {
    const newTab = window.open('', '_blank');
    newTab.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Debit Card Payment</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    form {
        max-width: 400px;
        margin: 0 auto;
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h2 {
        text-align: center; /* Center align the h2 */
    }
    label {
        display: block;
        margin-bottom: 5px;
    }
    input[type="text"] {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    button[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button[type="submit"]:hover {
        background-color: #45a049;
    }
</style>
</head>
<body>

<div>
    <h2>Credit Card Payment</h2>
    <form>
        <label for="cardNumber">Card Number:</label>
        <input type="text" id="cardNumber" name="cardNumber" />
        <label for="expiryDate">Expiry Date:</label>
        <input type="text" id="expiryDate" name="expiryDate" />
        <label for="expiryMonth">Expiry Month:</label>
        <input type="text" id="expiryMoth" name="expiryMonth" />
        <label for="nameOnCard">Name on Card:</label>
        <input type="text" id="nameOnCard" name="nameOnCard" />
        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" name="cvv" />
        <button type="submit">Pay</button>
    </form>
</div>

</body>
</html>
    `);
  };

  const renderCashPaymentPage = () => {
    const newTab = window.open('', '_blank');
    newTab.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cash Payment</title>
      <style>
          body {
              font-family: Arial, sans-serif; /* Better font */
              background-color: #f4f4f4;
              text-align: center;
          }
          .message-container {
              max-width: 400px;
              margin: 100px auto; /* Center the container */
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h2 {
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; /* Better font */
              margin-bottom: 20px; /* Add some space below the heading */
          }
          p {
              font-size: 16px; /* Better font size */
              line-height: 1.6; /* Improved readability */
          }
      </style>
      </head>
      <body>
  
      <div class="message-container">
          <h2>Cash Payment</h2>
          <p>Please pay at the cash counter.</p>
      </div>
  
      </body>
      </html>
    `);
  };
  
  return (
    <div className="payment-mode-container">
      <label htmlFor="payment-mode" className="payment-mode-label">Select Payment Mode:</label>
      <select id="payment-mode" className="payment-mode-select" onChange={handleModeChange}>
        <option value="">Select Payment Mode</option>
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
        <option value="debit_card">Debit Card</option>
        <option value="credit_card">Credit Card</option>
      </select>
    </div>
  );
};

export default PaymentSelection;
