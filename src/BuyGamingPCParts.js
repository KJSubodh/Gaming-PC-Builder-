import React, { useState } from 'react';
import './product-styles.css'; // Import shared CSS file
import cpuData from './cpu.json'; // Import the CPU data
import gpuData from './gpu.json'; // Import the GPU data
import ramData from './ram.json'; // Import the RAM data
import psuData from './psu.json'; // Import the PSU data
import casesData from './cases.json'; // Import the case data
import coolingData from './cooling.json'; // Import the cooling data
import storageData from './storage.json'; // Import the storage data
import mbData from './mb.json'; // Import the motherboard data

import PaymentSelection from './paymentselection';

const BuyGamingPCParts = () => {
  const [selectedParts, setSelectedParts] = useState({
    cpu: '',
    gpu: '',
    ram: '',
    psu: '',
    case: '',
    cooling: '',
    storage: '',
    secondaryStorage: '',
    selectedItem: '',
    motherboard: '',
  });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

  const handleDeleteCartItem = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleEditCartItem = (index, newData) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index] = newData;
      return updatedCart;
    });
  };

  const parseINR = (priceString) => {
    if (typeof priceString === 'string') {
      return parseFloat(priceString.replace(/₹|,/g, '')) || 0;
    }
    return priceString || 0; // Updated to handle non-string price inputs
  };

  const handleAddToCart = (partType) => {
    const selectedPartName = selectedParts[partType];
    let selectedPartData;

    switch (partType) {
      case 'cpu':
        const cpu = cpuData.gaming_cpus.find(cpu => cpu.name === selectedPartName);
        if (cpu) {
          selectedPartData = {
            type: partType,
            name: cpu.name,
            price: parseINR(cpu.price),
          };
        }
        break;
      case 'gpu':
        const gpu = gpuData.find(gpu => gpu.name === selectedPartName);
        if (gpu) {
          selectedPartData = {
            type: partType,
            name: gpu.name,
            price: parseINR(gpu['pricing (INR)']),
          };
        }
        break;
      case 'ram':
        const ram = ramData.find(ram => ram.name === selectedPartName);
        if (ram) {
          selectedPartData = {
            type: partType,
            name: ram.name,
            price: parseINR(ram['pricing (INR)']),
          };
        }
        break;
      case 'psu':
        const psu = psuData.find(psu => psu.name === selectedPartName);
        if (psu) {
          selectedPartData = {
            type: partType,
            name: psu.name,
            price: parseINR(psu['pricing (INR)']),
          };
        }
        break;
      case 'case':
        const caseItem = Object.values(casesData['Gaming PC Cases']).flat().find(caseItem => caseItem.Name === selectedPartName);
        if (caseItem) {
          selectedPartData = {
            type: partType,
            name: caseItem.Name,
            price: parseINR(caseItem.Price),
          };
        }
        break;
      case 'cooling':
        const coolingSolution = Object.values(coolingData['Cooling Solutions']).flatMap(category => category).find(solution => solution.Name === selectedPartName);
        if (coolingSolution) {
          selectedPartData = {
            type: partType,
            name: coolingSolution.Name,
            price: parseINR(coolingSolution.Price),
          };
        }
        break;
      case 'storage':
        const storage = storageData['NVMe PCIe M.2 (Primary Storage)'].find(item => item.Name === selectedPartName);
        if (storage) {
          selectedPartData = {
            type: partType,
            name: storage.Name,
            price: parseINR(storage['Price (INR)']),
          };
        }
        break;
        case 'secondaryStorage':
          const selectedStorage = selectedParts.secondaryStorage;
          const selectedItemName = selectedParts.selectedItem; 
         
          if (selectedStorage && selectedItemName !== '' && storageData[selectedStorage]) {
            const selectedStorageArray = storageData[selectedStorage];
           
            const selectedItemIndex = selectedStorageArray.findIndex(storage => storage.Name === selectedItemName);
        
            if (selectedItemIndex !== -1) { // Check if the item was found
              const secondaryStorageItem = selectedStorageArray[selectedItemIndex];
              
              selectedPartData = {
                type: partType,
                name: secondaryStorageItem.Name,
                price: parseINR(secondaryStorageItem['Price (INR)']),
              };
            } else {
              console.error('Selected item not found in the storage data array:', selectedItemName);
            }
          } else {
            console.error('Invalid selectedStorage or selectedItemName:', selectedStorage, selectedItemName);
          }
          break;        
      case 'motherboard':
        const motherboard = mbData.find(motherboard => motherboard.name === selectedPartName);
        if (motherboard) {
          selectedPartData = {
            type: partType,
            name: motherboard.name,
            price: parseINR(motherboard['pricing (INR)']),
          };
        }
        break;
      default:
        break;
    }

    if (selectedPartData) {
      setCart(prevCart => [
        ...prevCart,
        selectedPartData,
      ]);
      setSelectedParts(prevParts => ({
        ...prevParts,
        [partType]: '',
      }));
    }
  };

  const handlePartChange = (partType) => (event) => {
    const value = event.target.value;
    if (partType === 'secondaryStorage') {
      setSelectedParts((prevParts) => ({
        ...prevParts,
        [partType]: value,
        selectedItem: '',
      }));
    } else {
      setSelectedParts((prevParts) => ({
        ...prevParts,
        [partType]: value,
      }));
    }
  };

  const handleProceedToCheckout = () => {
    const invoiceData = {
      invoiceID: "undefined", // Replace with actual invoice ID
      date: formatDate(new Date()), // Format the date
      time: formatTime(new Date()), // Format the time
      items: cart,
      totalAmount: cart.reduce((total, item) => total + item.price, 0),
      customer: {
        name: document.getElementById('customer-name').value, // Retrieve customer name from input
        phone_number: document.getElementById('phone-number').value, // Retrieve phone number from input
        address: document.getElementById('address').value, // Retrieve address from input
      },
    };
  
    const htmlInvoice = generateInvoiceHTML(invoiceData);
  
    const newWindow = window.open();
    newWindow.document.write(htmlInvoice);
    newWindow.document.close();
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
  
  const generateInvoiceHTML = (invoiceData) => {
    if (!invoiceData || !invoiceData.items || !invoiceData.items.length) {
      return '<p>Error: Cart is empty.</p>';
    }
  
    let totalPrice = 0;
    const invoiceItems = invoiceData.items.map((item, index) => {
      const price = item.price || 0;
      totalPrice += price;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>₹${price.toFixed(2)}</td>
        </tr>
      `;
    }).join('');
  
    return `
      <html>
<head>
  <title>Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f7f7f7;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1, h2, th {
      color: #333;
    }
    h1, h2 {
      color: #333;
    text-align: center; /* Center align h1 and h2 text */
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: white;
    }
    .total-row {
      font-weight: bold;
      color: green; /* Change color to blue */
    }
    .signatories {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
    }
    .signatory-box {
      width: 45%;
      text-align: left;
      border: 1px solid #000;
      padding: 20px;
      border-radius: 5px;
    }
    .signatory-box h3 {
      margin-bottom: 10px;
      color: #333;
      text-align: left;
    }
    .date-time {
      margin-top: 20px;
    }
    .date-time p {
      margin: 5px 0;
    }
    .invoice-info td {
      text-align: left;
      width: 45%;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <h1>Your Gaming PC Store Name</h1>
    <h2>Purchase Invoice</h2>
    <div class="invoice-info">
  <p><strong>Invoice ID:</strong> ${invoiceData.invoiceID}</p>
  <p><strong>Customer Name:</strong> ${invoiceData.customer.name}</p>
  <p><strong>Customer Phone Number:</strong> ${invoiceData.customer.phone_number}</p>
  <p><strong>Customer Address:</strong> ${invoiceData.customer.address}</p>
</div>
    <table>
      <tr>
        <th>Sl. No</th>
        <th>Product Name</th>
        <th>Price</th>
      </tr>
      ${invoiceItems}
      <tr class="total-row">
        <td colspan="2">Total Amount:</td>
        <td>₹${totalPrice.toFixed(2)}</td>
      </tr>
    </table>
    <div class="date-time">
      <p><strong>Date:</strong> ${invoiceData.date}</p>
      <p><strong>Time:</strong> ${invoiceData.time}</p>
    </div>
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
  };
    
  const handleShowCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="container">
      <h1>Buy Gaming PC Parts</h1>

      <div className="component">
  <h2>Select Your Motherboard</h2>
  <select value={selectedParts.motherboard} onChange={handlePartChange('motherboard')}>
    <option value="">Select Motherboard</option>
    {mbData.map((motherboard, index) => (
      <option key={index} value={motherboard.name}>
        {motherboard.name} - ₹{parseINR(motherboard['pricing (INR)']).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('motherboard')}>Add to Cart</button>

  {selectedParts.motherboard && (
    <div>
      {mbData.find((mb) => mb.name === selectedParts.motherboard)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`Motherboard ${index + 1}`}
          className="motherboard-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>CPU</h2>
  <select value={selectedParts.cpu} onChange={handlePartChange('cpu')}>
    <option value="">Select CPU</option>
    {cpuData.gaming_cpus.map((cpu, index) => (
      <option key={index} value={cpu.name}>
        {cpu.name} - ₹{parseINR(cpu.price).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('cpu')}>Add to Cart</button>
  
  {selectedParts.cpu && (
    <div>
      {cpuData.gaming_cpus.find((cpu) => cpu.name === selectedParts.cpu)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`cpu ${index + 1}`}
          className="cpu-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>GPU</h2>
  <select value={selectedParts.gpu} onChange={handlePartChange('gpu')}>
    <option value="">Select GPU</option>
    {gpuData.map((gpu, index) => (
      <option key={index} value={gpu.name}>
        {gpu.name} - ₹{parseINR(gpu['pricing (INR)']).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('gpu')}>Add to Cart</button>
  
  {selectedParts.gpu && (
    <div>
      {gpuData.find((gpu) => gpu.name === selectedParts.gpu)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`GPU ${index + 1}`}
          className="gpu-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>RAM</h2>
  <select value={selectedParts.ram} onChange={handlePartChange('ram')}>
    <option value="">Select RAM</option>
    {ramData.map((ram, index) => (
      <option key={index} value={ram.name}>
        {ram.name} - ₹{parseINR(ram['pricing (INR)']).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('ram')}>Add to Cart</button>
  
  {selectedParts.ram && (
    <div>
      {ramData.find((ram) => ram.name === selectedParts.ram)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`RAM ${index + 1}`}
          className="ram-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>PSU</h2>
  <select value={selectedParts.psu} onChange={handlePartChange('psu')}>
    <option value="">Select PSU</option>
    {psuData.map((psu, index) => (
      <option key={index} value={psu.name}>
        {psu.name} - ₹{parseINR(psu['pricing (INR)']).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('psu')}>Add to Cart</button>
  
  {selectedParts.psu && (
    <div>
      {psuData.find((psu) => psu.name === selectedParts.psu)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`PSU ${index + 1}`}
          className="psu-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>Case</h2>
  <select value={selectedParts.case} onChange={handlePartChange('case')}>
    <option value="">Select Case</option>
    {Object.values(casesData['Gaming PC Cases']).flat().map((caseItem, index) => (
      <option key={index} value={caseItem.Name}>
        {caseItem.Name} - ₹{parseINR(caseItem.Price).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('case')}>Add to Cart</button>
  
  {selectedParts.case && (
    <div>
      {Object.values(casesData['Gaming PC Cases']).flat().find((caseItem) => caseItem.Name === selectedParts.case)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`Case ${index + 1}`}
          className="case-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>Cooling</h2>
  <select value={selectedParts.cooling} onChange={handlePartChange('cooling')}>
    <option value="">Select Cooling Solution</option>
    {Object.values(coolingData['Cooling Solutions']).flatMap(category => category).map((coolingSolution, index) => (
      <option key={index} value={coolingSolution.Name}>
        {coolingSolution.Name} - ₹{parseINR(coolingSolution.Price).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('cooling')}>Add to Cart</button>
  
  {selectedParts.cooling && (
    <div>
      {Object.values(coolingData['Cooling Solutions']).flatMap(category => category).find((coolingSolution) => coolingSolution.Name === selectedParts.cooling)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`Cooling Solution ${index + 1}`}
          className="cooling-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>Storage</h2>
  <select value={selectedParts.storage} onChange={handlePartChange('storage')}>
    <option value="">Select Primary Storage</option>
    {storageData['NVMe PCIe M.2 (Primary Storage)'].map((storage, index) => (
      <option key={index} value={storage.Name}>
        {storage.Name} - ₹{parseINR(storage['Price (INR)']).toFixed(2)}
      </option>
    ))}
  </select>
  <button onClick={() => handleAddToCart('storage')}>Add to Cart</button>
  
  {selectedParts.storage && (
    <div>
      {storageData['NVMe PCIe M.2 (Primary Storage)'].find((storage) => storage.Name === selectedParts.storage)?.urls?.map((url, index) => (
        <img
          key={index}
          src={url || 'blank_image_url'}
          alt={`Storage ${index + 1}`}
          className="storage-image"
        />
      ))}
    </div>
  )}
</div>

<div className="component">
  <h2>Secondary Storage</h2>
  <select value={selectedParts.secondaryStorage} onChange={handlePartChange('secondaryStorage')}>
    <option value="">Select Secondary Storage Type</option>
    {Object.keys(storageData).filter(key => key !== 'NVMe PCIe M.2 (Primary Storage)').map((storageType, index) => (
      <option key={index} value={storageType}>
        {storageType}
      </option>
    ))}
  </select>
  
  {selectedParts.secondaryStorage && (
    <>
      <select value={selectedParts.selectedItem} onChange={handlePartChange('selectedItem')}>
        <option value="">Select Secondary Storage</option>
        {storageData[selectedParts.secondaryStorage].map((storage, index) => (
          <option key={index} value={storage.Name}>
            {storage.Name} - ₹{parseINR(storage['Price (INR)']).toFixed(2)}
          </option>
        ))}
      </select>
      
      {selectedParts.selectedItem && (
        <div>
          {storageData[selectedParts.secondaryStorage].find((storage) => storage.Name === selectedParts.selectedItem)?.urls?.map((url, index) => (
            <img
              key={index}
              src={url || 'blank_image_url'}
              alt={`Secondary Storage ${index + 1}`}
              className="storage-image"
            />
          ))}
        </div>
      )}
    </>
  )}
  
  <button onClick={() => handleAddToCart('secondaryStorage')}>Add to Cart</button>
</div>

      <button onClick={handleShowCart}>Show Cart</button>
      
      {showCart && (
        <div className="cart">
          <h2>Cart</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ₹{item.price.toFixed(2)}
                <button onClick={() => handleDeleteCartItem(index)}>Delete</button>
                <button
                  onClick={() => {
                    const newName = prompt('Enter new name:', item.name);
                    const newPrice = prompt('Enter new price:', item.price.toFixed(2));
                    if (newName && newPrice) {
                      handleEditCartItem(index, {
                        ...item,
                        name: newName,
                        price: parseFloat(newPrice),
                      });
                    }
                  }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        <PaymentSelection onSelect={setSelectedPaymentMode} />
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

<button className="prebuilt-pc-button prebuilt-proceed-pc-button" onClick={handleProceedToCheckout}>Proceed to Checkout</button>

    </div>
  );
};

export default BuyGamingPCParts;
