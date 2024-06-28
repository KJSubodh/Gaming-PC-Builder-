import React, { useState } from 'react';
import pcConfigs from './custom_PC.json';
import './BuyPreBuiltPC.css';
import PaymentSelection from './paymentselection';


const BuyPreBuiltPC = () => {
  const [currentPCIndex, setCurrentPCIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = (pc) => {
    setCart(prevCart => [...prevCart, pc]);
  };

  const handleRemoveFromCart = (index) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

  const handleProceed = () => {
    // Retrieve user details
    const customerName = document.getElementById('customer-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const address = document.getElementById('address').value;

    // Prepare user details section for the invoice
    const userDetails = `
      <div class="user-details">
        <h2>Purchase Invoice</h2>
        <p><strong>Invoice ID:</strong></p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Customer Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Customer Address:</strong> ${address}</p>
      </div>
    `;

    // Prepare invoice items from cart
    const invoiceItems = cart.map(pc => `
      <div class="invoice-item">
        <table>
          <tr>
            <td><strong>PC Type:</strong></td>
            <td>${pc.PC_Type}</td>
          </tr>
          <tr>
            <td><strong>CPU:</strong></td>
            <td>${pc.CPU}</td>
          </tr>
          <tr>
            <td><strong>GPU:</strong></td>
            <td>${pc.GPU}</td>
          </tr>
          <tr>
            <td><strong>Motherboard:</strong></td>
            <td>${pc.Motherboard}</td>
          </tr>
          <tr>
            <td><strong>RAM:</strong></td>
            <td>${pc.RAM}</td>
          </tr>
          <tr>
            <td><strong>Primary Storage:</strong></td>
            <td>${pc.Primary_Storage}</td>
          </tr>
          <tr>
            <td><strong>Secondary Storage:</strong></td>
            <td>${pc.Secondary_Storage}</td>
          </tr>
          <tr>
            <td><strong>Case:</strong></td>
            <td>${pc.Case}</td>
          </tr>
          <tr>
            <td><strong>Cooling:</strong></td>
            <td>${pc.Cooling}</td>
          </tr>
          <tr>
            <td><strong>Price:</strong></td>
            <td style="font-size: 18px; color: green;"><strong>${pc.Price}</strong></td>
            </tr>
        </table>
      </div>
    `).join('\n\n');

    // Combine user details and invoice items
    const invoiceContent = userDetails + invoiceItems;

    // Open a new window and write the invoice content
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head>
          <title>Buy Pre Built PC Invoice</title>
          <style>
          .invoice-container {
            width: 80%;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            padding: 20px;
            border: 2px solid #ccc;
            border-radius: 10px;
            background-color: white;
          }

          h2 {
          text-align: center;
          }

          .invoice-heading {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
          }

          .user-details {
            margin-bottom: 10px;
          }

          .user-details table {
            width: 100%;
            border-collapse: collapse;
          }

          .user-details table td {
            padding: 5px;
            border: 1px solid #ccc;
          }

          .user-details table td:first-child {
            font-weight: bold;
            background-color: white;
          }

          .invoice-item {
            margin-bottom: 20px;
          }

          .invoice-item table {
            width: 100%;
            border-collapse: collapse;
          }

          .invoice-item table td {
            padding: 8px;
            border: 1px solid #ccc;
          }

          .invoice-item table td:first-child {
            font-weight: bold;
            background-color: #f0f0f0;
          }

          .signatories {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .signatory-box {
            width: 45%;
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 10px;
            border-radius: 5px;
          }

          .signatory-box h3 {
            margin-bottom: 5px;
          }
        </style>


        </head>
        <body>
          <div class="invoice-container">
            <h1 class="invoice-heading">Your Gaming PC Store Name</h1>
            ${invoiceContent}
            <p><strong>Date:</strong> ${formatDate(new Date())}</p>
            <p><strong>Time:</strong> ${formatTime(new Date())}</p>
            <div class="signatories">
              <div class="signatory-box">
                <h3>Authorized Signatory:</h3>
                <!-- Add authorized signatory details here -->
              </div>
              <div class="signatory-box">
                <h3>Customer Signatory:</h3>
                <!-- Add customer signatory details here -->
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const goToPreviousPC = () => {
    setCurrentPCIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : pcConfigs.length - 1));
  };

  const goToNextPC = () => {
    setCurrentPCIndex(prevIndex => (prevIndex < pcConfigs.length - 1 ? prevIndex + 1 : 0));
  };

  const renderImages = (urls) => {
    if (urls && urls.length > 0) {
      return (
        <div>
          {urls.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Pre-built PC ${index + 1}`}
              className="prebuilt-pc-image"
            />
          ))}
        </div>
      );
    } else {
      return null; // Return null if urls array is empty or undefined
    }
  };

  const currentPC = pcConfigs[currentPCIndex];
  console.log("Current PC URLs:", currentPC.urls);


  return (
    <div className="prebuilt-pc-container">
      <h1 className="prebuilt-pc-heading">Buy Pre-Built PC</h1>
      <div className="prebuilt-pc-description-container">
        <p className="prebuilt-pc-description">Purchase Pre-Built Gaming PCs</p>
      </div>
      <div className="prebuilt-pc-item">
      
      <h2 className="prebuilt-pc-type">{currentPC.PC_Type}</h2>
      {renderImages(currentPC.urls)}

        <p className="prebuilt-pc-detail">CPU: {currentPC.CPU}</p>
        <p className="prebuilt-pc-detail">GPU: {currentPC.GPU}</p>
        <p className="prebuilt-pc-detail">Motherboard: {currentPC.Motherboard}</p>
        <p className="prebuilt-pc-detail">RAM: {currentPC.RAM}</p>
        <p className="prebuilt-pc-detail">Primary Storage: {currentPC.Primary_Storage}</p>
        <p className="prebuilt-pc-detail">Secondary Storage: {currentPC.Secondary_Storage}</p>
        <p className="prebuilt-pc-detail">Case: {currentPC.Case}</p>
        <p className="prebuilt-pc-detail">Cooling: {currentPC.Cooling}</p>

        <div className="prebuilt-pc-price">Price: {currentPC.Price}</div>
        <div className="prebuilt-pc-navigation-buttons">
          <button className="prebuilt-pc-button prebuilt-pc-previous-button" onClick={goToPreviousPC}>
            Previous
          </button>
          <button className="prebuilt-pc-button prebuilt-pc-next-button" onClick={goToNextPC}>
            Next
          </button>
        </div>
        <button className="prebuilt-pc-button" onClick={() => handleAddToCart(currentPC)}>
          Add to Cart
        </button>
        <button className="prebuilt-pc-button" onClick={() => setShowCart(!showCart)}>
          {showCart ? 'Hide Cart' : 'Show Cart'}
        </button>
      </div>
      
      {showCart && (
        <div className="prebuilt-pc-cart">
          <h2>Cart</h2>
          <ul>
            {cart.map((pc, index) => (
              <li key={index} className="cart-item">
                <span>{pc.PC_Type}</span>
                <button onClick={() => handleRemoveFromCart(index)}>Remove from Cart</button>
              </li>
            ))}
          </ul>
        </div>
        
      )}
      <PaymentSelection onSelect={setSelectedPaymentMode} />
      <div className="user-details">
        <h2>Enter Your Details</h2>
        <div className="cell customer-name">
          <input type="text" id="customer-name" placeholder="Customer Name" />
        </div>
        <div className="cell phone-number">
          <input type="text" id="phone-number" placeholder="Phone Number" />
        </div>
        <div className="cell address">
          <input type="text" id="address" placeholder="Address" />
        </div>
      </div>
      <div className="prebuilt-pc-buttons-container">
        <button className="prebuilt-pc-button prebuilt-proceed-pc-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>

    </div>
  );
}

export default BuyPreBuiltPC;
