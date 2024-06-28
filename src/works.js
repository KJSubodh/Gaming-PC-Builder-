import React, { useState } from 'react';
import './BuildYourOwnPC.css';
import buildYourOwnPCImage from './build-your-own-PC.jpg';


import cpuData from './cpu.json';
import gpuData from './gpu.json';
import ramData from './ram.json';
import psuData from './psu.json';
import casesData from './cases.json';
import coolingData from './cooling.json';
import storageData from './storage.json';
import mbData from './mb.json';

const BuildYourOwnPC = () => {
  const [selectedCPU, setSelectedCPU] = useState('');
  const [selectedGPU, setSelectedGPU] = useState('');
  const [selectedRAM, setSelectedRAM] = useState('');
  const [selectedPSU, setSelectedPSU] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedCooling, setSelectedCooling] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedSecondaryStorage, setSelectedSecondaryStorage] = useState('');
  const [selectedMotherboard, setSelectedMotherboard] = useState('');
  const [rgbChecked, setRgbChecked] = useState(false);
  const [selectedSecondaryItem, setSelectedSecondaryItem] = useState('');
  const [cart, setCart] = useState([]);
  const [isBuilt, setIsBuilt] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');


  const handleSecondaryItemChange = (event) => {
    setSelectedSecondaryItem(event.target.value);
  };

  const handleCPUChange = (event) => {
    setSelectedCPU(event.target.value);
  };

  const handleGPUChange = (event) => {
    setSelectedGPU(event.target.value);
  };

  const handleRAMChange = (event) => {
    setSelectedRAM(event.target.value);
  };

  const handlePSUChange = (event) => {
    setSelectedPSU(event.target.value);
  };

  const handleCaseChange = (event) => {
    setSelectedCase(event.target.value);
  };

  const handleCoolingChange = (event) => {
    setSelectedCooling(event.target.value);
  };

  const handleStorageChange = (event) => {
    setSelectedStorage(event.target.value);
  };

  const handleSecondaryStorageChange = (event) => {
    setSelectedSecondaryStorage(event.target.value);
    setSelectedSecondaryItem('');
  };

  const handleMotherboardChange = (event) => {
    setSelectedMotherboard(event.target.value);
  };

  const handleRGBChange = (event) => {
    setRgbChecked(event.target.checked);
  };

  const generateInvoiceHTML = (cart, userName, userPhoneNumber, userAddress) => {
    let totalPrice = 0;
    const cartItems = cart.map(item => {
      totalPrice += item.price;
      return `<li>${item.type}: ${item.name} - ₹${item.price.toFixed(2)}</li>`;
    }).join('');
  
    // Include user details in the invoice
    const userDetails = `
      <div class="user-info">
        <p>Name: ${userName}</p>
        <p>Phone Number: ${userPhoneNumber}</p>
        <p>Address: ${userAddress}</p>
      </div>
    `;
  
    return `
      <html>
        <head>
          <title>PC Build Invoice</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 20px;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
              background-color: #fff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              text-align: center;
              color: #333;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin: 10px 0;
              padding: 10px;
              border-bottom: 1px solid #eee;
            }
            .total {
              font-weight: bold;
              text-align: right;
              font-size: 18px;
              margin-top: 20px;
              color: #333;
            }
            .total span {
              color: #ff5722;
            }
            .user-info {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Invoice</h1>
            ${userDetails} <!-- Include user details -->
            <ul>
              ${cartItems}
            </ul>
            <p class="total">Total: <span>₹${totalPrice.toFixed(2)}</span></p>
          </div>
        </body>
      </html>
    `;
  };
  
  
  const handleBuildPC = () => {
    const newCart = [];
  
    if (selectedMotherboard) {
      const motherboard = mbData.find(mb => mb.name === selectedMotherboard);
      if (motherboard) {
        newCart.push({ type: 'Motherboard', name: motherboard.name, price: parseFloat(motherboard['pricing (INR)']) });
      }
    }
  
    if (selectedCPU) {
      const cpu = cpuData.gaming_cpus.find(cpu => cpu.name === selectedCPU);
      if (cpu) {
        newCart.push({ type: 'CPU', name: cpu.name, price: parseFloat(cpu.price) });
      }
    }
  
    if (selectedGPU) {
      const gpu = gpuData.find(gpu => gpu.name === selectedGPU);
      if (gpu) {
        newCart.push({ type: 'GPU', name: gpu.name, price: parseFloat(gpu['pricing (INR)']) });
      }
    }
  
    if (selectedRAM) {
      const ram = ramData.find(ram => ram.name === selectedRAM);
      if (ram) {
        newCart.push({ type: 'RAM', name: ram.name, price: parseFloat(ram['pricing (INR)']) });
      }
    }
  
  
    if (selectedCase) {
      const caseItem = Object.values(casesData['Gaming PC Cases']).flat().find(caseItem => caseItem.Name === selectedCase);
      if (caseItem) {
        newCart.push({ type: 'Case', name: caseItem.Name, price: parseFloat(caseItem.Price) });
      }
    }

    if (selectedPSU) {
      const psu = psuData.find(psu => psu.name === selectedPSU);
      if (psu) {
        const price = parseFloat(psu['pricing (INR)'].replace(/[^\d.]/g, '')); // Remove non-numeric characters
        console.log("PSU Price: ", price); // Check PSU price
        newCart.push({ type: 'PSU', name: psu.name, price: price });
      }
    }
  
    if (selectedCooling) {
      const cooling = Object.values(coolingData['Cooling Solutions']).flat().find(cooling => cooling.Name === selectedCooling);
      if (cooling) {
        newCart.push({ type: 'Cooling', name: cooling.Name, price: parseFloat(cooling.Price) });
      }
    }
  
    // Primary Storage
if (selectedStorage && storageData["NVMe PCIe M.2 (Primary Storage)"]) {
  console.log("Selected Primary Storage:", selectedStorage);
  const storage = storageData["NVMe PCIe M.2 (Primary Storage)"].find(storage => storage.Name === selectedStorage);
  console.log("Retrieved Primary Storage:", storage);
  if (storage) {
    const price = parseFloat(storage['Price (INR)'].replace(/[^\d.]/g, '')); // Remove non-numeric characters
    console.log("Primary Storage Price:", price);
    newCart.push({ type: 'Primary Storage', name: storage.Name, price: price });
  }
}

// Secondary Storage
if (selectedSecondaryStorage && selectedSecondaryItem && storageData[`${selectedSecondaryStorage} (Secondary Storage)`]) {
  const secondaryStorage = storageData[`${selectedSecondaryStorage} (Secondary Storage)`].find(item => item.Name === selectedSecondaryItem);
  if (secondaryStorage) {
    const price = parseFloat(secondaryStorage['Price (INR)'].replace(/[^\d.]/g, ''));
    newCart.push({ type: 'Secondary Storage', name: secondaryStorage.Name, price: price });
  }
}

    if (rgbChecked) {
      newCart.push({ type: 'RGB Lighting', name: 'RGB Lighting', price: 1000 });
    }

  
    console.log("New Cart: ", newCart);
    
    console.log("PSU Data: ", psuData); // Add this line
   
    
// Check new cart
  
    // Calculate total price
    console.log("New Cart: ", newCart);
    const totalPrice = newCart.reduce((acc, item) => acc + parseFloat(item.price), 0);
    console.log("Total Price: ", totalPrice); // Check total price
    setCart(newCart);
    setIsBuilt(true);
  };

  
  const handleProceedToCheckout = () => {
    const invoiceHTML = generateInvoiceHTML(cart, userName, userPhoneNumber, userAddress);
    const newWindow = window.open();
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
  };
  
  
  return (
    <div className="pc-image" style={{ backgroundImage: `url(${buildYourOwnPCImage})` }}>
    <div className="build-pc-container">
      <h1>Build Your Own Gaming PC</h1>
      <p>Select and customize your own gaming PC from scratch.</p>
      {!isBuilt ? (
        <>
          <div className="component">
            <h2>Motherboard</h2>
            <select value={selectedMotherboard} onChange={handleMotherboardChange}>
              <option value="">Select Motherboard</option>
              {mbData && mbData.map((motherboard, index) => (
                <option key={index} value={motherboard.name}>
                  {motherboard.name} - ₹{motherboard['pricing (INR)']}
                </option>
              ))}
            </select>
          </div>
  
          <div className="component">
            <h2>CPU</h2>
            <select value={selectedCPU} onChange={handleCPUChange}>
              <option value="">Select CPU</option>
              {cpuData && cpuData.gaming_cpus.map((cpu, index) => (
                <option key={index} value={cpu.name}>
                  {cpu.name} - {cpu.cores_threads} - {cpu.clock_speed} - ₹{cpu.price}
                </option>
              ))}
            </select>
          </div>
  
          <div className="component">
            <h2>GPU</h2>
            <select value={selectedGPU} onChange={handleGPUChange}>
              <option value="">Select GPU</option>
              {gpuData && gpuData.map((gpu, index) => (
                <option key={index} value={gpu.name}>
                  {gpu.name} - ₹{gpu['pricing (INR)']}
                </option>
              ))}
            </select>
          </div>
  
          <div className="component">
            <h2>RAM</h2>
            <select value={selectedRAM} onChange={handleRAMChange}>
              <option value="">Select RAM</option>
              {ramData && ramData.map((ram, index) => (
                <option key={index} value={ram.name}>
                  {ram.name} - ₹{ram['pricing (INR)']}
                </option>
              ))}
            </select>
          </div>
  
          <div className="component">
            <h2>PSU</h2>
            <select value={selectedPSU} onChange={handlePSUChange}>
              <option value="">Select PSU</option>
              {psuData && psuData.map((psu, index) => (
                <option key={index} value={psu.name}>
                  {psu.name} - {psu['pricing (INR)']}
                </option>
              ))}
            </select>
          </div>
  
          <div className="component">
            <h2>Case</h2>
            <select value={selectedCase} onChange={handleCaseChange}>
              <option value="">Select Case</option>
              {casesData && Object.entries(casesData['Gaming PC Cases']).map(([category, cases], index) => (
                <optgroup label={category} key={index}>
                  {cases.map((caseItem, idx) => (
                    <option key={idx} value={caseItem.Name}>
                      {caseItem.Name} - ₹{caseItem.Price}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
  
          <div className="component">
            <h2>Cooling</h2>
            <select value={selectedCooling} onChange={handleCoolingChange}>
              <option value="">Select Cooling Solution</option>
              {coolingData && Object.entries(coolingData['Cooling Solutions']).map(([category, solutions], index) => (
                <optgroup label={category} key={index}>
                  {solutions.map((solution, idx) => (
                    <option key={idx} value={solution.Name}>
                      {solution.Name} - ₹{solution.Price}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
  
<div className="component">
  <h2>Primary Storage (NVME M.2 SSD)</h2>
  <select value={selectedStorage} onChange={handleStorageChange}>
    <option value="">Select Storage</option>
    {storageData && storageData["NVMe PCIe M.2 (Primary Storage)"] && storageData["NVMe PCIe M.2 (Primary Storage)"].map((item, index) => (
      <option key={index} value={item.Name}>
        {item.Name} - {item['Price (INR)']}
      </option>
    ))}
  </select>
</div>

<div className="component">
  <h2>Secondary Storage</h2>
  <select value={selectedSecondaryStorage} onChange={handleSecondaryStorageChange}>
    <option value="">Select Secondary Storage</option>
    <option value="SSD SATA III">SATA SSD</option>
    <option value="HDD">HDD</option>
  </select>
  {selectedSecondaryStorage && (
    <div className="component">
      <h2>Items</h2>
      <select value={selectedSecondaryItem} onChange={handleSecondaryItemChange}>
        <option value="">Select Item</option>
        {selectedSecondaryStorage === "SSD SATA III" &&
          storageData && storageData["SSD SATA III (2.5\") (Secondary Storage)"] &&
          storageData["SSD SATA III (2.5\") (Secondary Storage)"].map((item, index) => (
            <option key={index} value={item.Name}>
              {item.Name} - ₹{item['Price (INR)']}
            </option>
          ))}
        {selectedSecondaryStorage === "HDD" &&
          storageData && storageData["HDD (3.5\") (Secondary Storage)"] &&
          storageData["HDD (3.5\") (Secondary Storage)"].map((item, index) => (
            <option key={index} value={item.Name}>
              {item.Name} - ₹{item['Price (INR)']}
            </option>
          ))}
      </select>
    </div>
  )}
</div>

          <div className="component">
            <h2>RGB Lighting</h2>
            <label>
              <input type="checkbox" checked={rgbChecked} onChange={handleRGBChange} />
              Enable RGB Lighting
            </label>
          </div>
  
          <button className="build-button" onClick={handleBuildPC}>
            Build Your PC
          </button>
        </>
      ) : (
        <div className="cart">
          <h2>Your PC Build</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.type}: {item.name} - {typeof item.price === 'number' ? `₹${item.price.toFixed(2)}` : 'Price not available'}
              </li>
            ))}
          </ul>
          <button onClick={() => setIsBuilt(false)}>Edit Build</button>
          <div className="user-info">
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" />
          <input type="tel" value={userPhoneNumber} onChange={(e) => setUserPhoneNumber(e.target.value)} placeholder="Enter your phone number (+91)" />
          <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="Enter your address" />
        </div>
          <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
    </div>
  );
  
}

export default BuildYourOwnPC;
