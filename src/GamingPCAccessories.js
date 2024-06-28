import React, { useState } from 'react';
import './product-styles.css'; // Import shared CSS file
import './gaming-pc-styles.css';
import './user-details.css';
import PaymentSelection from './paymentselection';

import mouseData from './mice.json'; // Import the mouse data
import keyboardData from './keyboards.json'; // Import the keyboard data
import monitorData from './monitor.json'; // Import the monitor data
import headphoneData from './headphones.json'; // Import the headphone data
import microphoneData from './microphone.json'; // Import the microphone data
import webcamData from './webcam.json'; // Import the webcam data

const GamingPCAccessories = () => {
  const [selectedMouse, setSelectedMouse] = useState('');
  const [selectedKeyboard, setSelectedKeyboard] = useState('');
  const [selectedMonitor, setSelectedMonitor] = useState('');
  const [selectedHeadphones, setSelectedHeadphones] = useState('');
  const [selectedMicrophone, setSelectedMicrophone] = useState('');
  const [selectedWebcam, setSelectedWebcam] = useState('');
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [totalBill, setTotalBill] = useState(0);


  const handleAddToCart = (type, name, data) => {
    setCart(prevCart => [
      ...prevCart,
      {
        type: type,
        name: name,
        data: data,
      },
    ]);
  };

  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

  const handleMouseChange = (event) => {
    setSelectedMouse(event.target.value);
  };

  const handleKeyboardChange = (event) => {
    setSelectedKeyboard(event.target.value);
  };

  const handleMonitorChange = (event) => {
    setSelectedMonitor(event.target.value);
  };

  const handleHeadphonesChange = (event) => {
    setSelectedHeadphones(event.target.value);
  };

  const handleMicrophoneChange = (event) => {
    setSelectedMicrophone(event.target.value);
  };

  const handleWebcamChange = (event) => {
    setSelectedWebcam(event.target.value);
  };

  const handleShowCart = () => {
    setShowCart(true);
  };

  // Function to remove an item from the cart
  const handleRemoveFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    let bill = 0;
    cart.forEach(item => {
      const price = parseInt(item.data.price.replace('₹', '').replace(',', ''), 10);
      console.log("Item:", item);
      console.log("Price:", price);
      bill += price;
    });
    console.log("Total Bill:", bill);
    setTotalBill(bill);
    setShowCart(true);
    handleGenerateInvoice(); // Call handleGenerateInvoice to generate the invoice
  };
  
  const getAccessorySpecifications = (type, data) => {
    switch (type) {
      case 'monitor':
        return `Refresh Rate: ${data.refresh_rate_hz}Hz, Resolution: ${data.resolution}, Response Time: ${data.response_time_ms} ms`;
      case 'mouse':
        return `${data.DpI} DPI, ${data.Hz} Hz`;
      case 'keyboard':
        return `Type: ${data.type}, Connectivity: ${data.USB}`; // Example specifications for keyboards
      case 'headphones':
        return `Type: ${data.type}, Wireless: ${data.wireless}`; // Example specifications for headphones
      case 'microphone':
        return `Pick Up Pattern: ${data.pickup_pattern}, Connectivity: ${data.connectivity}`; // Example specifications for microphones
      case 'webcam':
        return `Resolution: ${data.resolution}, Frame Rate: ${data.fps} FPS`; // Example specifications for webcams
      default:
        return '';
    }
  };
  

  const handleGenerateInvoice = () => {
    // Generate a unique invoice ID
    const invoiceID = undefined; // Assuming you have a function to generate the ID

    // Get customer information from input fields
    const customerName = document.getElementById('customer-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const address = document.getElementById('address').value;

    
    // Calculate the total bill again to ensure consistency
    let bill = 0;
    cart.forEach(item => {
      const price = parseInt(item.data.price.replace('₹', '').replace(',', ''), 10);
      bill += price;
    });
    
    // Get current date and time
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';

// Convert hours from 24-hour to 12-hour format
    const formattedHours = hours % 12 || 12;

    const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${period}`;

  
    // Generate HTML content for the invoice
    let invoiceContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          
          h1, h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          
          th {
            background-color: #f2f2f2;
          }
          
          .total-bill {
            color: green; /* Blue color */
            text-align: right; /* Centering the text */
            margin-top: 20px;
          }
    
          .capitalize {
            text-transform: capitalize;
          }

          .signatories {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .signatory-box {
            width: 45%;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
          }

          .signatory-box h3 {
            margin-bottom: 10px;
            color: #333;
          }

          .signatory-box p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your Gaming PC Store Name</h1>
          <h2>Purchase Invoice</h2>
          <p><strong>Invoice ID:</strong> ${invoiceID}</p> <!-- Render the invoice ID -->
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Customer Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Customer Address:</strong> ${address}</p>
          <table>
            <thead>
              <tr>
                <th>Accessory Type</th>
                <th>Name</th>
                <th>Specifications</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
              <tr>
                <td class="capitalize">${item.type}</td>
                <td>${item.name}</td>
                <td>${getAccessorySpecifications(item.type, item.data)}</td>
                <td>${item.data.price}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          <h2 class="total-bill">Total Bill: ₹ ${bill}</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
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
    `;
  
    // Open the invoice in a new tab
    const newWindow = window.open();
    newWindow.document.write(invoiceContent);
    newWindow.document.close();
};

return (
  <div className="build-pc-container">
    <h1>Buy Gaming PC Accessories</h1>
    <p>Explore accessories to enhance your gaming experience.</p>

    {/* Mouse selection */}
    <div className="component">
      <h2>Mouse</h2>
      <select value={selectedMouse} onChange={handleMouseChange}>
        <option value="">Select Mouse</option>
        {mouseData.map((mouse, index) => (
          <option key={index} value={mouse.Name}>
            {mouse.Name} - {mouse.DpI} DPI, {mouse.Hz} Hz, {mouse.price}
          </option>
        ))}
      </select>
      {selectedMouse && (
        <div>
          {mouseData.find((mouse) => mouse.Name === selectedMouse)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Mouse ${index + 1}`}
              className="mouse-image"
            />
          ))}
        </div>
      )}
      <button onClick={() => handleAddToCart('mouse', selectedMouse, mouseData.find((mouse) => mouse.Name === selectedMouse))}>
        Add to Cart
      </button>
    </div>

    {/* Keyboard selection */}
    <div className="component">
      <h2>Keyboard</h2>
      <select value={selectedKeyboard} onChange={handleKeyboardChange}>
        <option value="">Select Keyboard</option>
        {keyboardData.map((keyboard, index) => (
          <option key={index} value={keyboard.name}>
            {keyboard.name} - {keyboard.price}
          </option>
        ))}
      </select>
      {selectedKeyboard && (
        <div>
          {keyboardData.find((keyboard) => keyboard.name === selectedKeyboard)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Keyboard ${index + 1}`}
              className="keyboard-image"
            />
          ))}
        </div>
      )}
      <button onClick={() => handleAddToCart('keyboard', selectedKeyboard, keyboardData.find((keyboard) => keyboard.name === selectedKeyboard))}>
        Add to Cart
      </button>
    </div>

    {/* Monitor selection */}
    <div className="component">
      <h2>Monitor</h2>
      <select value={selectedMonitor} onChange={handleMonitorChange}>
        <option value="">Select Monitor</option>
        {monitorData.map((monitor, index) => (
          <option key={index} value={monitor.model}>
            {monitor.model} - Refresh Rate: {monitor.refresh_rate_hz}Hz, Resolution: {monitor.resolution}, Response Time: {monitor.response_time_ms} ms - {monitor.price}
          </option>
        ))}
      </select>
      {selectedMonitor && (
        <div>
          {monitorData.find((monitor) => monitor.model === selectedMonitor)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Monitor ${index + 1}`}
              className="monitor-image"
            />
          ))}
        </div>
      )}
      <button onClick={() => handleAddToCart('monitor', selectedMonitor, monitorData.find((monitor) => monitor.model === selectedMonitor))}>
        Add to Cart
      </button>
    </div>

    {/* Headphones selection */}
    <div className="component">
      <h2>Headphones</h2>
      <select value={selectedHeadphones} onChange={handleHeadphonesChange}>
        <option value="">Select Headphones</option>
        {headphoneData["GamingHeadphones/Earphones"].map((headphones, index) => (
          <option key={index} value={headphones.name}>
            {headphones.name} - {headphones.price}
          </option>
        ))}
      </select>
      {selectedHeadphones && (
        <div>
          {headphoneData["GamingHeadphones/Earphones"].find((headphones) => headphones.name === selectedHeadphones)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Headphones ${index + 1}`}
              className="headphones-image"
            />
          ))}
        </div>
      )}
      <button onClick={() => handleAddToCart('headphones', selectedHeadphones, headphoneData["GamingHeadphones/Earphones"].find((headphones) => headphones.name === selectedHeadphones))}>
        Add to Cart
      </button>
    </div>

    {/* Microphone selection */}
    <div className="component">
      <h2>Microphone</h2>
      <select value={selectedMicrophone} onChange={handleMicrophoneChange}>
        <option value="">Select Microphone</option>
        {microphoneData.microphones.map((microphone, index) => (
          <option key={index} value={microphone.name}>
            {microphone.name} - {microphone.price}
          </option>
        ))}
      </select>
      {selectedMicrophone && (
        <div>
          {microphoneData.microphones.find((microphone) => microphone.name === selectedMicrophone)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Microphone ${index + 1}`}
              className="microphone-image"
            />
          ))}
        </div>
      )}
      <button onClick={() => handleAddToCart('microphone', selectedMicrophone, microphoneData.microphones.find((microphone) => microphone.name === selectedMicrophone))}>
        Add to Cart
      </button>
    </div>

    {/* Webcam selection */}
    <div className="component">
      <h2>Webcam</h2>
      <select value={selectedWebcam} onChange={handleWebcamChange}>
        <option value="">Select Webcam</option>
        {webcamData.webcams.map((webcam, index) => (
          <option key={index} value={webcam.name}>
            {webcam.name} - {webcam.price}
          </option>
        ))}
      </select>
      {selectedWebcam && (
        <div>
          {webcamData.webcams.find((webcam) => webcam.name === selectedWebcam)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Webcam ${index + 1}`}
              className="webcam-image"
            />
          ))}
        </div>
      )}
      <button onClick={() => handleAddToCart('webcam', selectedWebcam, webcamData.webcams.find((webcam) => webcam.name === selectedWebcam))}>
        Add to Cart
      </button>
    </div>

    {/* Cart display */}
    <div className="component">
      <button onClick={handleShowCart}>Show Cart</button>
      <button onClick={() => setShowCart(false)}>Hide Cart</button>
    </div>

    <PaymentSelection onSelect={setSelectedPaymentMode} />

    {showCart && (
      <div className="cart">
        <h2>Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.type.toUpperCase()}: {item.name} - {item.price}
              <button onClick={() => handleRemoveFromCart(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    )}

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
    <button className="prebuilt-pc-button prebuilt-proceed-pc-button" onClick={handleProceed}>
      Proceed
    </button>
  </div>
);

};

export default GamingPCAccessories;
